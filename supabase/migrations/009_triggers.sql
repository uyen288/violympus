-- 009_triggers.sql
-- Automatic timestamp updates and XP/Level synchronization triggers

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_arena_rooms_updated_at
  BEFORE UPDATE ON public.arena_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Synchronize XP and Level on user profiles upon new XP transactions
CREATE OR REPLACE FUNCTION public.sync_user_xp_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_xp integer;
  v_new_level integer;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_new_xp
  FROM public.xp_transactions
  WHERE user_id = new.user_id;

  IF v_new_xp < 0 THEN
    v_new_xp := 0;
  END IF;

  -- Level formula: Level 1 starts at 0 XP, each 500 XP = +1 Level
  v_new_level := 1 + floor(v_new_xp / 500);

  UPDATE public.profiles
  SET xp = v_new_xp,
      level = v_new_level,
      updated_at = now()
  WHERE id = new.user_id;

  RETURN new;
END;
$$;

CREATE TRIGGER on_xp_transaction_inserted
  AFTER INSERT ON public.xp_transactions
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_xp_level();
