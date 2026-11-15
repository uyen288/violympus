-- 017_fix_profiles_and_auth.sql
-- Fix HTTP 406 on GET /rest/v1/profiles, guarantee 1:1 profiles for all auth.users,
-- add self-healing trigger & ensure_profile RPC, add missing RLS INSERT policy,
-- and auto-confirm existing unconfirmed users stuck without emails.

-- 1. Auto-confirm existing auth users stuck without confirmation emails
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- 2. Backfill missing profiles for existing auth.users
-- Ensures each account in auth.users has exactly one matching record in public.profiles (id = auth.users.id)
INSERT INTO public.profiles (
  id,
  email,
  username,
  display_name,
  avatar_url,
  role,
  xp,
  level,
  gems,
  streak_days,
  climb_high_score,
  is_banned,
  is_public
)
SELECT
  u.id,
  COALESCE(NULLIF(u.email, ''), u.id::text || '@violympus.local'),
  -- Generate guaranteed safe unique username
  LOWER(
    REGEXP_REPLACE(
      COALESCE(
        NULLIF(u.raw_user_meta_data->>'username', ''),
        split_part(COALESCE(NULLIF(u.email, ''), 'user'), '@', 1),
        'user'
      ),
      '[^a-zA-Z0-9_]', '', 'g'
    )
  ) || '_' || substr(replace(u.id::text, '-', ''), 1, 6),
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'full_name', ''),
    NULLIF(u.raw_user_meta_data->>'name', ''),
    NULLIF(u.raw_user_meta_data->>'display_name', ''),
    split_part(COALESCE(NULLIF(u.email, ''), 'Người học'), '@', 1),
    'Người học'
  ),
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(u.raw_user_meta_data->>'picture', '')
  ),
  'learner'::user_role,
  0,
  1,
  50,
  1,
  0,
  false,
  true
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO UPDATE SET
  email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
  display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
  avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

-- 3. Exception-safe, bulletproof handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_raw_username text;
  v_username text;
  v_display_name text;
  v_avatar_url text;
  v_role user_role;
  v_count integer := 0;
BEGIN
  -- 1. Determine safe email
  v_email := COALESCE(NULLIF(new.email, ''), new.id::text || '@violympus.local');

  -- 2. Determine safe display name
  v_display_name := COALESCE(
    NULLIF(new.raw_user_meta_data->>'full_name', ''),
    NULLIF(new.raw_user_meta_data->>'name', ''),
    NULLIF(new.raw_user_meta_data->>'display_name', ''),
    split_part(v_email, '@', 1),
    'Người học'
  );

  -- 3. Determine safe avatar URL
  v_avatar_url := COALESCE(
    NULLIF(new.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(new.raw_user_meta_data->>'picture', '')
  );

  -- 4. Determine safe role (guard against invalid enum casts)
  BEGIN
    v_role := COALESCE(
      (NULLIF(new.raw_user_meta_data->>'role', ''))::user_role,
      'learner'::user_role
    );
  EXCEPTION WHEN OTHERS THEN
    v_role := 'learner'::user_role;
  END;

  -- 5. Determine unique username (clean non-alphanumeric, ensure unique)
  v_raw_username := LOWER(
    REGEXP_REPLACE(
      COALESCE(
        NULLIF(new.raw_user_meta_data->>'username', ''),
        split_part(v_email, '@', 1),
        'user'
      ),
      '[^a-zA-Z0-9_]', '', 'g'
    )
  );

  IF length(v_raw_username) < 3 THEN
    v_raw_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 6);
  END IF;

  v_username := v_raw_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username AND id != new.id) LOOP
    v_count := v_count + 1;
    v_username := v_raw_username || '_' || substr(replace(new.id::text, '-', ''), 1, 4) || v_count::text;
  END LOOP;

  -- 6. Insert or update profile
  INSERT INTO public.profiles (
    id,
    email,
    username,
    display_name,
    avatar_url,
    role,
    xp,
    level,
    gems,
    streak_days,
    climb_high_score,
    is_banned,
    is_public
  ) VALUES (
    new.id,
    v_email,
    v_username,
    v_display_name,
    v_avatar_url,
    v_role,
    0,
    1,
    50,
    1,
    0,
    false,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Never abort user creation in auth.users
  RAISE WARNING 'handle_new_user exception caught: %', SQLERRM;
  RETURN new;
END;
$$;

-- 4. Re-attach trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RPC function: public.ensure_profile() (Self-healing on demand for authenticated users)
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_user auth.users%ROWTYPE;
  v_profile public.profiles%ROWTYPE;
  v_email text;
  v_username text;
  v_display_name text;
  v_avatar_url text;
  v_count integer := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be authenticated to ensure profile';
  END IF;

  -- Return existing profile if present
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
  IF FOUND THEN
    RETURN v_profile;
  END IF;

  -- Read auth user data
  SELECT * INTO v_user FROM auth.users WHERE id = v_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND: Record not found in auth.users';
  END IF;

  v_email := COALESCE(NULLIF(v_user.email, ''), v_user_id::text || '@violympus.local');

  v_display_name := COALESCE(
    NULLIF(v_user.raw_user_meta_data->>'full_name', ''),
    NULLIF(v_user.raw_user_meta_data->>'name', ''),
    NULLIF(v_user.raw_user_meta_data->>'display_name', ''),
    split_part(v_email, '@', 1),
    'Người học'
  );

  v_avatar_url := COALESCE(
    NULLIF(v_user.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(v_user.raw_user_meta_data->>'picture', '')
  );

  v_username := LOWER(
    REGEXP_REPLACE(
      COALESCE(
        NULLIF(v_user.raw_user_meta_data->>'username', ''),
        split_part(v_email, '@', 1),
        'user'
      ),
      '[^a-zA-Z0-9_]', '', 'g'
    )
  );

  IF length(v_username) < 3 THEN
    v_username := 'user_' || substr(replace(v_user_id::text, '-', ''), 1, 6);
  END IF;

  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username AND id != v_user_id) LOOP
    v_count := v_count + 1;
    v_username := v_username || '_' || substr(replace(v_user_id::text, '-', ''), 1, 4) || v_count::text;
  END LOOP;

  INSERT INTO public.profiles (
    id,
    email,
    username,
    display_name,
    avatar_url,
    role,
    xp,
    level,
    gems,
    streak_days,
    climb_high_score,
    is_banned,
    is_public
  ) VALUES (
    v_user_id,
    v_email,
    v_username,
    v_display_name,
    v_avatar_url,
    'learner'::user_role,
    0,
    1,
    50,
    1,
    0,
    false,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url)
  RETURNING * INTO v_profile;

  RETURN v_profile;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated, service_role;

-- 6. RLS Policies on public.profiles: Fix Missing INSERT, and Ensure Robust SELECT / UPDATE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own profile row if missing
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow public viewing if is_public = true, or owner, or staff/admin
DROP POLICY IF EXISTS "Profiles are viewable by public if is_public or owner or staff" ON public.profiles;
CREATE POLICY "Profiles are viewable by public if is_public or owner or staff"
  ON public.profiles FOR SELECT
  USING (
    is_public = true
    OR auth.uid() = id
    OR public.is_staff(auth.uid())
  );

-- Allow users to update their own profile fields
DROP POLICY IF EXISTS "Users can update own display profile" ON public.profiles;
CREATE POLICY "Users can update own display profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND xp = (SELECT xp FROM public.profiles WHERE id = auth.uid())
    AND level = (SELECT level FROM public.profiles WHERE id = auth.uid())
  );
