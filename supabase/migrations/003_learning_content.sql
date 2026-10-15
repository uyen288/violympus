-- 003_learning_content.sql
-- Subjects, topics, lessons, questions, options, and server-side secret answers

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'BookOpen',
  sort_order integer NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(subject_id, slug)
);

CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  content_markdown text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(topic_id, slug)
);

CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  type question_type NOT NULL DEFAULT 'single_choice',
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  prompt text NOT NULL,
  explanation text,
  points integer NOT NULL DEFAULT 10 CHECK (points > 0),
  time_limit_seconds integer NOT NULL DEFAULT 30 CHECK (time_limit_seconds >= 5),
  status content_status NOT NULL DEFAULT 'published',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_key text NOT NULL,
  content text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE(question_id, option_key)
);

-- CRITICAL: question_answers stores the official answer keys.
-- Client CANNOT read this table directly under any circumstances.
CREATE TABLE public.question_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid UNIQUE NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;

-- Subjects policies
CREATE POLICY "Public can view published subjects"
  ON public.subjects FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage subjects"
  ON public.subjects FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Topics policies
CREATE POLICY "Public can view published topics"
  ON public.topics FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage topics"
  ON public.topics FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Lessons policies
CREATE POLICY "Public can view published lessons"
  ON public.lessons FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Questions policies (Note: does NOT include answers)
CREATE POLICY "Public can view published questions"
  ON public.questions FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage questions"
  ON public.questions FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Question options policies
CREATE POLICY "Public can view question options"
  ON public.question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      WHERE q.id = question_id
      AND (q.status = 'published' OR public.is_staff(auth.uid()))
    )
  );

CREATE POLICY "Staff can manage question options"
  ON public.question_options FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Question answers policy: NO SELECT for authenticated/anon!
-- Only staff can view in Admin Studio; all grading happens via SECURITY DEFINER functions.
CREATE POLICY "Staff can view/manage question answers in studio"
  ON public.question_answers FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
