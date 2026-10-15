-- 005_arena.sql
-- Realtime arena rooms, participants, matches, and answers

CREATE TABLE public.arena_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  host_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  title text NOT NULL,
  status room_status NOT NULL DEFAULT 'waiting',
  visibility room_visibility NOT NULL DEFAULT 'public',
  max_participants integer NOT NULL DEFAULT 16 CHECK (max_participants >= 2 AND max_participants <= 64),
  question_count integer NOT NULL DEFAULT 10 CHECK (question_count >= 3 AND question_count <= 50),
  time_per_question integer NOT NULL DEFAULT 20 CHECK (time_per_question >= 5 AND time_per_question <= 120),
  current_question_index integer NOT NULL DEFAULT 0,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.arena_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.arena_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status participant_status NOT NULL DEFAULT 'joined',
  score integer NOT NULL DEFAULT 0,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

CREATE TABLE public.arena_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid UNIQUE NOT NULL REFERENCES public.arena_rooms(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'countdown',
  current_question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL,
  question_index integer NOT NULL DEFAULT 0,
  question_started_at timestamptz,
  question_deadline timestamptz,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE public.arena_match_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 100 CHECK (points > 0),
  UNIQUE(match_id, question_id)
);

CREATE TABLE public.arena_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_answer jsonb NOT NULL,
  is_correct boolean,
  points_awarded integer DEFAULT 0,
  response_time_ms integer CHECK (response_time_ms >= 0),
  answered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(match_id, question_id, user_id)
);

-- Enable RLS
ALTER TABLE public.arena_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_match_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_answers ENABLE ROW LEVEL SECURITY;

-- Arena rooms policies
CREATE POLICY "Public can view active public rooms or rooms they are in"
  ON public.arena_rooms FOR SELECT
  USING (
    visibility = 'public'
    OR host_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.arena_participants p
      WHERE p.room_id = id AND p.user_id = auth.uid()
    )
  );

-- Arena participants policies
CREATE POLICY "Users can view participants in their room"
  ON public.arena_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.arena_rooms r
      WHERE r.id = room_id
      AND (
        r.visibility = 'public'
        OR r.host_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.arena_participants p2
          WHERE p2.room_id = r.id AND p2.user_id = auth.uid()
        )
      )
    )
  );

-- Arena matches policies
CREATE POLICY "Participants can view matches in their room"
  ON public.arena_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.arena_participants p
      WHERE p.room_id = room_id AND p.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.arena_rooms r
      WHERE r.id = room_id AND r.host_id = auth.uid()
    )
  );

-- Arena match questions policies
CREATE POLICY "Participants can view match questions"
  ON public.arena_match_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.arena_matches m
      JOIN public.arena_participants p ON p.room_id = m.room_id
      WHERE m.id = match_id AND p.user_id = auth.uid()
    )
  );

-- Arena answers policies: users only see their own answers during match
CREATE POLICY "Users can view own arena answers"
  ON public.arena_answers FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
