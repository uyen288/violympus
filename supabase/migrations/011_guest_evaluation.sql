-- 011_guest_evaluation.sql
-- Server-side grading for guest learners without mandatory authentication
-- Allows free practice and exam taking without account creation
-- Official answer keys remain protected on the server and are only revealed upon submission

-- 1. Evaluate single practice question (Guest / Open Practice)
CREATE OR REPLACE FUNCTION public.check_practice_answer(
  p_question_id uuid,
  p_user_answer jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_question public.questions%ROWTYPE;
  v_official_answer jsonb;
  v_is_correct boolean;
BEGIN
  SELECT * INTO v_question FROM public.questions WHERE id = p_question_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Question not found or not published';
  END IF;

  SELECT answer_payload INTO v_official_answer FROM public.question_answers WHERE question_id = p_question_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'INTERNAL_ERROR: Answer key not configured for this question';
  END IF;

  v_is_correct := (p_user_answer = v_official_answer);

  RETURN jsonb_build_object(
    'question_id', p_question_id,
    'is_correct', v_is_correct,
    'points_awarded', CASE WHEN v_is_correct THEN v_question.points ELSE 0 END,
    'explanation', v_question.explanation,
    'official_answer', v_official_answer
  );
END;
$$;

-- Grant execution to anon (guests) and authenticated users
GRANT EXECUTE ON FUNCTION public.check_practice_answer(uuid, jsonb) TO anon, authenticated;

-- 2. Evaluate full exam for guest (Guest Exam Taking)
CREATE OR REPLACE FUNCTION public.grade_guest_exam(
  p_exam_id uuid,
  p_answers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exam public.exams%ROWTYPE;
  v_q RECORD;
  v_user_ans jsonb;
  v_official_ans jsonb;
  v_is_correct boolean;
  v_points integer;
  v_total_score integer := 0;
  v_correct_count integer := 0;
  v_total_questions integer := 0;
  v_results jsonb := '[]'::jsonb;
BEGIN
  SELECT * INTO v_exam FROM public.exams WHERE id = p_exam_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Exam not found or not published';
  END IF;

  FOR v_q IN (
    SELECT
      eq.question_id,
      eq.points AS max_points,
      eq.sort_order,
      q.prompt,
      q.type AS question_type,
      q.explanation,
      qa.answer_payload AS official_answer
    FROM public.exam_questions eq
    JOIN public.questions q ON q.id = eq.question_id
    JOIN public.question_answers qa ON qa.question_id = eq.question_id
    WHERE eq.exam_id = p_exam_id
    ORDER BY eq.sort_order ASC
  ) LOOP
    v_total_questions := v_total_questions + 1;
    v_user_ans := p_answers -> (v_q.question_id::text);
    v_official_ans := v_q.official_answer;

    IF v_user_ans IS NOT NULL AND v_user_ans = v_official_ans THEN
      v_is_correct := true;
      v_points := v_q.max_points;
      v_correct_count := v_correct_count + 1;
      v_total_score := v_total_score + v_points;
    ELSE
      v_is_correct := false;
      v_points := 0;
    END IF;

    v_results := v_results || jsonb_build_object(
      'question_id', v_q.question_id,
      'is_correct', v_is_correct,
      'user_answer', v_user_ans,
      'points_awarded', v_points,
      'max_points', v_q.max_points,
      'explanation', v_q.explanation,
      'official_answer', v_official_ans
    );
  END LOOP;

  RETURN jsonb_build_object(
    'exam_id', p_exam_id,
    'title', v_exam.title,
    'score', v_total_score,
    'total_points', v_exam.total_points,
    'passing_score', v_exam.passing_score,
    'is_passed', (v_total_score >= v_exam.passing_score),
    'correct_count', v_correct_count,
    'total_questions', v_total_questions,
    'submitted_at', now(),
    'results', v_results
  );
END;
$$;

-- Grant execution to anon (guests) and authenticated users
GRANT EXECUTE ON FUNCTION public.grade_guest_exam(uuid, jsonb) TO anon, authenticated;
