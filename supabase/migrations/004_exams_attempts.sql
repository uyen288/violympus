-- 004_exams_attempts.sql
-- Exams, exam questions, user attempts, and attempt answers

CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time_limit_seconds integer NOT NULL DEFAULT 1200 CHECK (time_limit_seconds >= 60),
  passing_score integer NOT NULL DEFAULT 50 CHECK (passing_score >= 0),
  total_points integer NOT NULL DEFAULT 100 CHECK (total_points > 0),
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 10 CHECK (points > 0),
  UNIQUE(exam_id, question_id)
);

CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id uuid REFERENCES public.exams(id) ON DELETE SET NULL,
  mode exam_mode NOT NULL DEFAULT 'solo_exam',
  status attempt_status NOT NULL DEFAULT 'in_progress',
  score integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  deadline timestamptz NOT NULL,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer jsonb NOT NULL,
  is_correct boolean,
  points_awarded integer DEFAULT 0,
  answered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- Exams policies
CREATE POLICY "Public can view published exams"
  ON public.exams FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage exams"
  ON public.exams FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Exam questions policies
CREATE POLICY "Public can view published exam questions"
  ON public.exam_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_id
      AND (e.status = 'published' OR public.is_staff(auth.uid()))
    )
  );

CREATE POLICY "Staff can manage exam questions"
  ON public.exam_questions FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Attempts policies (Client reads own attempts; cannot directly insert or mutate scores)
CREATE POLICY "Users can view own attempts"
  ON public.attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- Attempt answers policies (Client reads own answers; grading happens via RPC)
CREATE POLICY "Users can view own attempt answers"
  ON public.attempt_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.attempts a
      WHERE a.id = attempt_id
      AND (a.user_id = auth.uid() OR public.is_staff(auth.uid()))
    )
  );
