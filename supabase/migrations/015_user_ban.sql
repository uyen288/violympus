-- 015_user_ban.sql
-- Add ban, edit, and delete functionality to user management in Admin Studio

-- 1. Add is_banned column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banned_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ban_reason text DEFAULT NULL;

-- 2. RPC: admin_ban_user
CREATE OR REPLACE FUNCTION public.admin_ban_user(
  p_target_user_id uuid,
  p_ban boolean,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_caller_role text;
  v_target_role text;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT role INTO v_caller_role FROM public.profiles WHERE id = v_caller_id;
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'FORBIDDEN: Only admin can ban/unban users';
  END IF;

  -- Cannot ban yourself
  IF v_caller_id = p_target_user_id THEN
    RAISE EXCEPTION 'SELF_BAN: Cannot ban your own account';
  END IF;

  -- Cannot ban another admin
  SELECT role INTO v_target_role FROM public.profiles WHERE id = p_target_user_id;
  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;

  IF v_target_role = 'admin' AND p_ban THEN
    RAISE EXCEPTION 'CANNOT_BAN_ADMIN: Cannot ban another admin';
  END IF;

  UPDATE public.profiles
  SET is_banned = p_ban,
      banned_at = CASE WHEN p_ban THEN now() ELSE NULL END,
      ban_reason = CASE WHEN p_ban THEN p_reason ELSE NULL END,
      updated_at = now()
  WHERE id = p_target_user_id;

  -- Log to audit
  INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, metadata)
  VALUES (
    v_caller_id,
    CASE WHEN p_ban THEN 'ban_user' ELSE 'unban_user' END,
    'profiles',
    p_target_user_id,
    jsonb_build_object('reason', p_reason)
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', p_target_user_id,
    'is_banned', p_ban
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_ban_user(uuid, boolean, text) TO authenticated;

-- 3. RPC: admin_delete_user
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_target_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_caller_role text;
  v_target_role text;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT role INTO v_caller_role FROM public.profiles WHERE id = v_caller_id;
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'FORBIDDEN: Only admin can delete users';
  END IF;

  -- Cannot delete yourself
  IF v_caller_id = p_target_user_id THEN
    RAISE EXCEPTION 'SELF_DELETE: Cannot delete your own account';
  END IF;

  SELECT role INTO v_target_role FROM public.profiles WHERE id = p_target_user_id;
  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;

  IF v_target_role = 'admin' THEN
    RAISE EXCEPTION 'CANNOT_DELETE_ADMIN: Cannot delete another admin account';
  END IF;

  -- Delete from profiles (cascades or cleans up dependencies)
  DELETE FROM public.profiles WHERE id = p_target_user_id;

  -- Log to audit
  INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, metadata)
  VALUES (
    v_caller_id,
    'delete_user',
    'profiles',
    p_target_user_id,
    jsonb_build_object('target_user_id', p_target_user_id)
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', p_target_user_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- 4. RPC: admin_update_user
CREATE OR REPLACE FUNCTION public.admin_update_user(
  p_target_user_id uuid,
  p_display_name text,
  p_username text,
  p_role text,
  p_xp integer DEFAULT NULL,
  p_gems integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_caller_role text;
  v_new_level integer;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT role INTO v_caller_role FROM public.profiles WHERE id = v_caller_id;
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'FORBIDDEN: Only admin can update user profiles';
  END IF;

  IF p_role NOT IN ('learner', 'editor', 'admin') THEN
    RAISE EXCEPTION 'INVALID_ROLE: Role must be learner, editor, or admin';
  END IF;

  IF p_xp IS NOT NULL THEN
    v_new_level := GREATEST(1, floor(sqrt(p_xp::float / 100.0))::integer + 1);
  END IF;

  UPDATE public.profiles
  SET display_name = COALESCE(p_display_name, display_name),
      username = COALESCE(p_username, username),
      role = p_role::public.user_role,
      xp = COALESCE(p_xp, xp),
      level = COALESCE(v_new_level, level),
      gems = COALESCE(p_gems, gems),
      updated_at = now()
  WHERE id = p_target_user_id;

  INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, metadata)
  VALUES (
    v_caller_id,
    'update_user',
    'profiles',
    p_target_user_id,
    jsonb_build_object(
      'display_name', p_display_name,
      'username', p_username,
      'role', p_role,
      'xp', p_xp,
      'gems', p_gems
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', p_target_user_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_user(uuid, text, text, text, integer, integer) TO authenticated;

-- 5. RPC: admin_create_user
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email text,
  p_display_name text,
  p_username text,
  p_role text DEFAULT 'learner',
  p_gems integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_caller_role text;
  v_new_id uuid := gen_random_uuid();
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT role INTO v_caller_role FROM public.profiles WHERE id = v_caller_id;
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'FORBIDDEN: Only admin can create users';
  END IF;

  IF p_role NOT IN ('learner', 'editor', 'admin') THEN
    RAISE EXCEPTION 'INVALID_ROLE: Role must be learner, editor, or admin';
  END IF;

  -- Check if username already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = p_username) THEN
    RAISE EXCEPTION 'USERNAME_EXISTS: Username already taken';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    username,
    display_name,
    role,
    xp,
    level,
    gems,
    streak_days,
    created_at,
    updated_at
  ) VALUES (
    v_new_id,
    p_email,
    p_username,
    p_display_name,
    p_role::public.user_role,
    0,
    1,
    COALESCE(p_gems, 50),
    1,
    now(),
    now()
  );

  INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, metadata)
  VALUES (
    v_caller_id,
    'create_user',
    'profiles',
    v_new_id,
    jsonb_build_object(
      'email', p_email,
      'username', p_username,
      'display_name', p_display_name,
      'role', p_role
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_new_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_create_user(text, text, text, text, integer) TO authenticated;
