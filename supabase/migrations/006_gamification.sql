-- 006_gamification.sql
-- XP transactions and badges ledger

CREATE TABLE public.xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  source_type text NOT NULL, -- 'exam', 'practice', 'arena', 'badge'
  source_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Award',
  xp_reward integer NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP transactions"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Public can view badges"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Public can view earned user badges"
  ON public.user_badges FOR SELECT
  USING (true);
