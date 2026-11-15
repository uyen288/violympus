-- 013_user_account_rpc.sql
-- User account management RPCs: delete account and OAuth profile enhancement

-- 1. Delete own account (SECURITY DEFINER)
-- Allows an authenticated user to delete their own account from auth.users.
-- Cascading foreign keys will remove public.profiles, attempts, arena participation, etc.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  -- Delete the user from auth.users, which cascades to public.profiles and related tables
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- 2. Enhanced handle_new_user trigger for Google OAuth and other providers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_display_name text;
  v_avatar_url text;
BEGIN
  v_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
  );
  v_display_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );
  v_avatar_url := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  INSERT INTO public.profiles (
    id,
    email,
    username,
    display_name,
    avatar_url,
    role
  ) VALUES (
    new.id,
    new.email,
    v_username,
    v_display_name,
    v_avatar_url,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'learner')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN new;
END;
$$;
