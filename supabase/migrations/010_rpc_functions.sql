-- 010_rpc_functions.sql
-- Server-side business logic and atomic scoring functions (SECURITY DEFINER)

-- 1. Start Exam Attempt
CREATE OR REPLACE FUNCTION public.start_attempt(
  p_exam_id uuid,
  p_mode exam_mode DEFAULT 'solo_exam'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_exam public.exams%ROWTYPE;
  v_attempt_id uuid;
  v_deadline timestamptz;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  SELECT * INTO v_exam FROM public.exams WHERE id = p_exam_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Exam not found or not published';
  END IF;

  -- Server-enforced deadline
  v_deadline := now() + (v_exam.time_limit_seconds || ' seconds')::interval;

  INSERT INTO public.attempts (
    user_id,
    exam_id,
    mode,
    status,
    total_points,
    started_at,
    deadline
  ) VALUES (
    v_user_id,
    p_exam_id,
    p_mode,
    'in_progress',
    v_exam.total_points,
    now(),
    v_deadline
  )
  RETURNING id INTO v_attempt_id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'started_at', now(),
    'deadline', v_deadline,
    'time_limit_seconds', v_exam.time_limit_seconds
  );
END;
$$;

-- 2. Save Draft Answer for Attempt
CREATE OR REPLACE FUNCTION public.save_attempt_answer(
  p_attempt_id uuid,
  p_question_id uuid,
  p_answer jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_attempt public.attempts%ROWTYPE;
BEGIN
  SELECT * INTO v_attempt FROM public.attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Attempt not found';
  END IF;

  IF v_attempt.user_id != v_user_id THEN
    RAISE EXCEPTION 'FORBIDDEN: You do not own this attempt';
  END IF;

  IF v_attempt.status != 'in_progress' OR now() > v_attempt.deadline THEN
    RAISE EXCEPTION 'EXPIRED: Attempt is expired or already submitted';
  END IF;

  INSERT INTO public.attempt_answers (
    attempt_id,
    question_id,
    user_answer,
    answered_at
  ) VALUES (
    p_attempt_id,
    p_question_id,
    p_answer,
    now()
  )
  ON CONFLICT (attempt_id, question_id)
  DO UPDATE SET
    user_answer = EXCLUDED.user_answer,
    answered_at = EXCLUDED.answered_at;

  RETURN true;
END;
$$;

-- 3. Submit and Grade Attempt (Atomic Server-Side Scoring)
CREATE OR REPLACE FUNCTION public.submit_attempt(p_attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_attempt public.attempts%ROWTYPE;
  v_rec RECORD;
  v_is_correct boolean;
  v_points integer;
  v_total_score integer := 0;
  v_correct_count integer := 0;
  v_total_questions integer := 0;
BEGIN
  SELECT * INTO v_attempt FROM public.attempts WHERE id = p_attempt_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Attempt not found';
  END IF;

  IF v_attempt.user_id != v_user_id THEN
    RAISE EXCEPTION 'FORBIDDEN: You do not own this attempt';
  END IF;

  IF v_attempt.status = 'completed' THEN
    RETURN jsonb_build_object(
      'score', v_attempt.score,
      'total_points', v_attempt.total_points,
      'status', 'completed'
    );
  END IF;

  -- Grade each answer by checking secret question_answers table
  FOR v_rec IN (
    SELECT
      aa.id AS answer_id,
      aa.question_id,
      aa.user_answer,
      q.points AS max_points,
      qa.answer_payload AS official_answer
    FROM public.attempt_answers aa
    JOIN public.questions q ON q.id = aa.question_id
    JOIN public.question_answers qa ON qa.question_id = aa.question_id
    WHERE aa.attempt_id = p_attempt_id
  ) LOOP
    v_total_questions := v_total_questions + 1;
    v_is_correct := (v_rec.user_answer = v_rec.official_answer);

    IF v_is_correct THEN
      v_points := v_rec.max_points;
      v_correct_count := v_correct_count + 1;
      v_total_score := v_total_score + v_points;
    ELSE
      v_points := 0;
    END IF;

    UPDATE public.attempt_answers
    SET is_correct = v_is_correct,
        points_awarded = v_points
    WHERE id = v_rec.answer_id;
  END LOOP;

  -- Update attempt record
  UPDATE public.attempts
  SET status = 'completed',
      score = v_total_score,
      submitted_at = now()
  WHERE id = p_attempt_id;

  -- Award XP (1 XP per point scored)
  IF v_total_score > 0 THEN
    INSERT INTO public.xp_transactions (
      user_id,
      amount,
      reason,
      source_type,
      source_id
    ) VALUES (
      v_user_id,
      v_total_score,
      'Hoàn thành bài thi',
      'exam',
      p_attempt_id
    );
  END IF;

  RETURN jsonb_build_object(
    'score', v_total_score,
    'total_points', v_attempt.total_points,
    'correct_count', v_correct_count,
    'total_questions', v_total_questions,
    'submitted_at', now()
  );
END;
$$;

-- 4. Create Arena Room
CREATE OR REPLACE FUNCTION public.create_room(
  p_title text,
  p_subject_id uuid DEFAULT NULL,
  p_question_count integer DEFAULT 10,
  p_time_per_question integer DEFAULT 20,
  p_visibility room_visibility DEFAULT 'public'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_code text;
  v_room_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  -- Generate 6-character alphanumeric room PIN
  LOOP
    v_code := upper(substring(md5(random()::text) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.arena_rooms WHERE code = v_code AND status != 'finished');
  END LOOP;

  INSERT INTO public.arena_rooms (
    code,
    host_id,
    subject_id,
    title,
    question_count,
    time_per_question,
    visibility
  ) VALUES (
    v_code,
    v_user_id,
    p_subject_id,
    p_title,
    p_question_count,
    p_time_per_question,
    p_visibility
  )
  RETURNING id INTO v_room_id;

  -- Automatically add host as participant
  INSERT INTO public.arena_participants (
    room_id,
    user_id,
    status
  ) VALUES (
    v_room_id,
    v_user_id,
    'ready'
  );

  RETURN jsonb_build_object(
    'room_id', v_room_id,
    'code', v_code,
    'host_id', v_user_id,
    'title', p_title
  );
END;
$$;

-- 5. Join Arena Room by PIN
CREATE OR REPLACE FUNCTION public.join_room(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_room public.arena_rooms%ROWTYPE;
  v_count integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: User must be logged in';
  END IF;

  SELECT * INTO v_room
  FROM public.arena_rooms
  WHERE code = upper(trim(p_code)) AND status = 'waiting'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Room does not exist or has already started';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.arena_participants
  WHERE room_id = v_room.id AND status != 'forfeited';

  IF v_count >= v_room.max_participants THEN
    RAISE EXCEPTION 'ROOM_FULL: Room has reached maximum capacity';
  END IF;

  INSERT INTO public.arena_participants (
    room_id,
    user_id,
    status
  ) VALUES (
    v_room.id,
    v_user_id,
    'joined'
  )
  ON CONFLICT (room_id, user_id)
  DO UPDATE SET
    status = 'joined',
    last_seen_at = now();

  RETURN jsonb_build_object(
    'room_id', v_room.id,
    'code', v_room.code,
    'title', v_room.title,
    'host_id', v_room.host_id
  );
END;
$$;

-- 6. Leave Arena Room / Host Transfer
CREATE OR REPLACE FUNCTION public.leave_room(p_room_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_room public.arena_rooms%ROWTYPE;
  v_next_host uuid;
BEGIN
  SELECT * INTO v_room FROM public.arena_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', true);
  END IF;

  -- Mark participant as forfeited
  UPDATE public.arena_participants
  SET status = 'forfeited'
  WHERE room_id = p_room_id AND user_id = v_user_id;

  -- If host left, transfer host to next participant or cancel room
  IF v_room.host_id = v_user_id THEN
    SELECT user_id INTO v_next_host
    FROM public.arena_participants
    WHERE room_id = p_room_id AND status != 'forfeited' AND user_id != v_user_id
    ORDER BY joined_at ASC
    LIMIT 1;

    IF v_next_host IS NOT NULL THEN
      UPDATE public.arena_rooms SET host_id = v_next_host WHERE id = p_room_id;
    ELSE
      UPDATE public.arena_rooms SET status = 'cancelled' WHERE id = p_room_id;
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'next_host', v_next_host);
END;
$$;

-- 7. Submit Arena Answer and Award Realtime Points
CREATE OR REPLACE FUNCTION public.submit_arena_answer(
  p_match_id uuid,
  p_question_id uuid,
  p_answer jsonb,
  p_response_time_ms integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_match public.arena_matches%ROWTYPE;
  v_official_answer jsonb;
  v_is_correct boolean;
  v_points integer := 0;
  v_speed_bonus integer := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT * INTO v_match FROM public.arena_matches WHERE id = p_match_id;
  IF NOT FOUND OR v_match.status != 'in_progress' THEN
    RAISE EXCEPTION 'MATCH_NOT_ACTIVE: Match is not currently in progress';
  END IF;

  -- Deadline check
  IF v_match.question_deadline IS NOT NULL AND now() > (v_match.question_deadline + interval '2 seconds') THEN
    RAISE EXCEPTION 'DEADLINE_EXPIRED: Answer submitted after question time expired';
  END IF;

  -- Retrieve secret answer
  SELECT answer_payload INTO v_official_answer
  FROM public.question_answers
  WHERE question_id = p_question_id;

  v_is_correct := (p_answer = v_official_answer);

  IF v_is_correct THEN
    -- Base score: 100 points
    v_points := 100;
    -- Speed bonus: up to +50 points for responses under 5 seconds
    IF p_response_time_ms < 5000 THEN
      v_speed_bonus := floor((5000 - p_response_time_ms) / 100);
      IF v_speed_bonus > 50 THEN v_speed_bonus := 50; END IF;
      v_points := v_points + v_speed_bonus;
    END IF;
  END IF;

  -- Record answer
  INSERT INTO public.arena_answers (
    match_id,
    question_id,
    user_id,
    user_answer,
    is_correct,
    points_awarded,
    response_time_ms,
    answered_at
  ) VALUES (
    p_match_id,
    p_question_id,
    v_user_id,
    p_answer,
    v_is_correct,
    v_points,
    p_response_time_ms,
    now()
  )
  ON CONFLICT (match_id, question_id, user_id) DO NOTHING;

  -- Update participant running score
  IF v_points > 0 THEN
    UPDATE public.arena_participants
    SET score = score + v_points,
        status = 'answered'
    WHERE room_id = v_match.room_id AND user_id = v_user_id;
  ELSE
    UPDATE public.arena_participants
    SET status = 'answered'
    WHERE room_id = v_match.room_id AND user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'points_awarded', v_points,
    'speed_bonus', v_speed_bonus
  );
END;
$$;

-- 8. Heartbeat to maintain online connection status
CREATE OR REPLACE FUNCTION public.arena_heartbeat(p_room_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.arena_participants
  SET last_seen_at = now()
  WHERE room_id = p_room_id AND user_id = auth.uid();
  RETURN true;
END;
$$;
