-- 014_gamification_and_gems.sql
-- Gems currency, daily check-in, streak tracking, and study statistics

-- 1. Add gamification columns to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gems integer NOT NULL DEFAULT 50 CHECK (gems >= 0),
  ADD COLUMN IF NOT EXISTS streak_days integer NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
  ADD COLUMN IF NOT EXISTS last_active_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS study_seconds_today integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS climb_high_score integer NOT NULL DEFAULT 0;

-- 2. Atomic RPC function to award XP and update Level
CREATE OR REPLACE FUNCTION public.add_user_xp(
  p_amount integer,
  p_reason text,
  p_source_type text DEFAULT 'practice',
  p_source_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_new_xp integer;
  v_new_level integer;
  v_old_level integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  SELECT xp, level INTO v_new_xp, v_old_level FROM public.profiles WHERE id = v_user_id;

  v_new_xp := GREATEST(0, v_new_xp + p_amount);
  -- Formula: Level = floor(sqrt(xp / 100)) + 1
  v_new_level := GREATEST(1, floor(sqrt(v_new_xp::float / 100.0))::integer + 1);

  UPDATE public.profiles
  SET xp = v_new_xp,
      level = v_new_level,
      updated_at = now()
  WHERE id = v_user_id;

  -- Log transaction
  INSERT INTO public.xp_transactions (
    user_id,
    amount,
    reason,
    source_type,
    source_id
  ) VALUES (
    v_user_id,
    p_amount,
    p_reason,
    p_source_type,
    p_source_id
  );

  RETURN jsonb_build_object(
    'xp', v_new_xp,
    'level', v_new_level,
    'leveled_up', (v_new_level > v_old_level)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_user_xp(integer, text, text, uuid) TO authenticated;

-- 3. Atomic RPC to modify gems (earn or spend)
CREATE OR REPLACE FUNCTION public.modify_gems(
  p_amount integer, -- positive to earn, negative to spend
  p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_current_gems integer;
  v_new_gems integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  SELECT gems INTO v_current_gems FROM public.profiles WHERE id = v_user_id;

  IF (v_current_gems + p_amount) < 0 THEN
    RAISE EXCEPTION 'INSUFFICIENT_GEMS: You do not have enough gems';
  END IF;

  v_new_gems := v_current_gems + p_amount;

  UPDATE public.profiles
  SET gems = v_new_gems,
      updated_at = now()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'gems', v_new_gems,
    'amount', p_amount,
    'reason', p_reason
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.modify_gems(integer, text) TO authenticated;

-- 4. Atomic Daily Check-in & Streak update
CREATE OR REPLACE FUNCTION public.claim_daily_checkin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.profiles%ROWTYPE;
  v_today date := CURRENT_DATE;
  v_streak integer;
  v_gem_reward integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

  IF v_profile.last_active_date = v_today THEN
    -- Already checked in today
    RETURN jsonb_build_object(
      'already_claimed', true,
      'streak', v_profile.streak_days,
      'gems', v_profile.gems
    );
  END IF;

  -- Calculate streak
  IF v_profile.last_active_date = (v_today - interval '1 day')::date THEN
    v_streak := v_profile.streak_days + 1;
  ELSE
    v_streak := 1;
  END IF;

  -- Gem reward: Base 15 gems + 5 per streak day (up to 50 max)
  v_gem_reward := LEAST(50, 10 + (v_streak * 5));

  UPDATE public.profiles
  SET gems = gems + v_gem_reward,
      streak_days = v_streak,
      last_active_date = v_today,
      study_seconds_today = 0,
      updated_at = now()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'already_claimed', false,
    'streak', v_streak,
    'gems_earned', v_gem_reward,
    'total_gems', v_profile.gems + v_gem_reward
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_daily_checkin() TO authenticated;
