-- 002_identity.sql
-- Profiles and security helper functions

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'learner',
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level integer NOT NULL DEFAULT 1 CHECK (level >= 1),
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Helper functions for RLS checks (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND role IN ('editor', 'admin')
  );
$$;

-- Trigger to create profile automatically on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_display_name text;
BEGIN
  v_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
  );
  v_display_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
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
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'learner')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by public if is_public or owner or staff"
  ON public.profiles FOR SELECT
  USING (
    is_public = true
    OR auth.uid() = id
    OR public.is_staff(auth.uid())
  );

CREATE POLICY "Users can update own display profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Ensure user cannot self-promote role, xp, or level
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND xp = (SELECT xp FROM public.profiles WHERE id = auth.uid())
    AND level = (SELECT level FROM public.profiles WHERE id = auth.uid())
  );
