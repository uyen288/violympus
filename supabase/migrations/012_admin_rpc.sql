-- 012_admin_rpc.sql
-- Admin Studio RPCs: CRUD content, role management, import, audit logging
-- All functions are SECURITY DEFINER with role checks.

-- ─────────────────────────────────────────────────────────
-- Helper: log audit event (called from other RPCs)
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_audit(
  p_action text,
  p_entity text,
  p_entity_id uuid DEFAULT NULL,
  p_changes jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, target_entity, target_id, changes)
  VALUES (auth.uid(), p_action, p_entity, p_entity_id, p_changes);
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 1. Subjects CRUD
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_upsert_subject(
  p_id uuid DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_slug text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_icon_name text DEFAULT 'BookOpen',
  p_sort_order integer DEFAULT 0,
  p_status content_status DEFAULT 'published'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result public.subjects%ROWTYPE;
  v_is_update boolean := p_id IS NOT NULL;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'VALIDATION: name is required';
  END IF;
  IF p_slug IS NULL OR trim(p_slug) = '' THEN
    RAISE EXCEPTION 'VALIDATION: slug is required';
  END IF;
  IF p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'VALIDATION: slug must match ^[a-z0-9]+(-[a-z0-9]+)*$';
  END IF;

  IF v_is_update THEN
    UPDATE public.subjects
    SET
      name = p_name,
      slug = p_slug,
      description = p_description,
      icon_name = p_icon_name,
      sort_order = p_sort_order,
      status = p_status,
      updated_at = now()
    WHERE id = p_id
    RETURNING * INTO v_result;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'NOT_FOUND: Subject not found';
    END IF;

    PERFORM public.log_audit('update_subject', 'subjects', p_id,
      jsonb_build_object('name', p_name, 'status', p_status));
  ELSE
    INSERT INTO public.subjects (name, slug, description, icon_name, sort_order, status)
    VALUES (p_name, p_slug, p_description, p_icon_name, p_sort_order, p_status)
    RETURNING * INTO v_result;

    PERFORM public.log_audit('create_subject', 'subjects', v_result.id,
      jsonb_build_object('name', p_name));
  END IF;

  RETURN row_to_json(v_result)::jsonb;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_subject(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_questions boolean;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Admin role required to delete subjects';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.questions q
    JOIN public.topics t ON t.id = q.topic_id
    WHERE t.subject_id = p_id
  ) INTO v_has_questions;

  IF v_has_questions THEN
    -- Archive instead of hard delete when data exists
    UPDATE public.subjects SET status = 'archived', updated_at = now() WHERE id = p_id;
    PERFORM public.log_audit('archive_subject', 'subjects', p_id, NULL);
  ELSE
    DELETE FROM public.subjects WHERE id = p_id;
    PERFORM public.log_audit('delete_subject', 'subjects', p_id, NULL);
  END IF;

  RETURN true;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 2. Topics CRUD
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_upsert_topic(
  p_id uuid DEFAULT NULL,
  p_subject_id uuid DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_slug text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_sort_order integer DEFAULT 0,
  p_status content_status DEFAULT 'published'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result public.topics%ROWTYPE;
  v_is_update boolean := p_id IS NOT NULL;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'VALIDATION: name is required';
  END IF;
  IF p_slug IS NULL OR trim(p_slug) = '' THEN
    RAISE EXCEPTION 'VALIDATION: slug is required';
  END IF;

  IF v_is_update THEN
    UPDATE public.topics
    SET name = p_name, slug = p_slug, description = p_description,
        sort_order = p_sort_order, status = p_status, updated_at = now()
    WHERE id = p_id
    RETURNING * INTO v_result;

    IF NOT FOUND THEN RAISE EXCEPTION 'NOT_FOUND: Topic not found'; END IF;
    PERFORM public.log_audit('update_topic', 'topics', p_id, jsonb_build_object('name', p_name));
  ELSE
    IF p_subject_id IS NULL THEN RAISE EXCEPTION 'VALIDATION: subject_id required for new topic'; END IF;

    INSERT INTO public.topics (subject_id, name, slug, description, sort_order, status)
    VALUES (p_subject_id, p_name, p_slug, p_description, p_sort_order, p_status)
    RETURNING * INTO v_result;

    PERFORM public.log_audit('create_topic', 'topics', v_result.id, jsonb_build_object('name', p_name));
  END IF;

  RETURN row_to_json(v_result)::jsonb;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 3. Questions CRUD (staff can read answers)
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_get_question(p_question_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_q public.questions%ROWTYPE;
  v_options jsonb;
  v_answer jsonb;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  SELECT * INTO v_q FROM public.questions WHERE id = p_question_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'NOT_FOUND: Question not found'; END IF;

  SELECT jsonb_agg(row_to_json(o) ORDER BY o.sort_order)
  INTO v_options
  FROM public.question_options o
  WHERE o.question_id = p_question_id;

  SELECT answer_payload INTO v_answer
  FROM public.question_answers WHERE question_id = p_question_id;

  RETURN jsonb_build_object(
    'question', row_to_json(v_q),
    'options', COALESCE(v_options, '[]'::jsonb),
    'answer_payload', v_answer
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_question(
  p_id uuid DEFAULT NULL,
  p_topic_id uuid DEFAULT NULL,
  p_type question_type DEFAULT 'single_choice',
  p_difficulty difficulty_level DEFAULT 'medium',
  p_prompt text DEFAULT NULL,
  p_explanation text DEFAULT NULL,
  p_points integer DEFAULT 10,
  p_time_limit_seconds integer DEFAULT 30,
  p_status content_status DEFAULT 'draft',
  p_options jsonb DEFAULT '[]'::jsonb,  -- [{key, content, sort_order}]
  p_answer_payload jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_question_id uuid;
  v_is_update boolean := p_id IS NOT NULL;
  v_opt jsonb;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  IF p_prompt IS NULL OR trim(p_prompt) = '' THEN
    RAISE EXCEPTION 'VALIDATION: prompt is required';
  END IF;
  IF p_points <= 0 THEN
    RAISE EXCEPTION 'VALIDATION: points must be positive';
  END IF;

  IF v_is_update THEN
    UPDATE public.questions
    SET topic_id = COALESCE(p_topic_id, topic_id),
        type = p_type, difficulty = p_difficulty,
        prompt = p_prompt, explanation = p_explanation,
        points = p_points, time_limit_seconds = p_time_limit_seconds,
        status = p_status, updated_at = now()
    WHERE id = p_id;

    IF NOT FOUND THEN RAISE EXCEPTION 'NOT_FOUND: Question not found'; END IF;
    v_question_id := p_id;
    PERFORM public.log_audit('update_question', 'questions', p_id,
      jsonb_build_object('status', p_status, 'type', p_type));
  ELSE
    IF p_topic_id IS NULL THEN RAISE EXCEPTION 'VALIDATION: topic_id required'; END IF;

    INSERT INTO public.questions (topic_id, type, difficulty, prompt, explanation,
        points, time_limit_seconds, status, created_by)
    VALUES (p_topic_id, p_type, p_difficulty, p_prompt, p_explanation,
        p_points, p_time_limit_seconds, p_status, auth.uid())
    RETURNING id INTO v_question_id;

    PERFORM public.log_audit('create_question', 'questions', v_question_id,
      jsonb_build_object('type', p_type, 'status', p_status));
  END IF;

  -- Replace options
  IF jsonb_array_length(p_options) > 0 THEN
    DELETE FROM public.question_options WHERE question_id = v_question_id;
    FOR v_opt IN SELECT * FROM jsonb_array_elements(p_options)
    LOOP
      INSERT INTO public.question_options (question_id, option_key, content, sort_order)
      VALUES (
        v_question_id,
        v_opt->>'key',
        v_opt->>'content',
        COALESCE((v_opt->>'sort_order')::integer, 0)
      );
    END LOOP;
  END IF;

  -- Upsert answer payload (only if provided)
  IF p_answer_payload IS NOT NULL THEN
    INSERT INTO public.question_answers (question_id, answer_payload)
    VALUES (v_question_id, p_answer_payload)
    ON CONFLICT (question_id)
    DO UPDATE SET answer_payload = EXCLUDED.answer_payload;
  END IF;

  RETURN jsonb_build_object('question_id', v_question_id, 'success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_question(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  -- Archive if published, hard delete if draft
  UPDATE public.questions
  SET status = CASE WHEN status = 'published' THEN 'archived'::content_status ELSE status END,
      updated_at = now()
  WHERE id = p_id AND status != 'archived';

  IF NOT FOUND THEN
    DELETE FROM public.questions WHERE id = p_id;
  END IF;

  PERFORM public.log_audit('delete_question', 'questions', p_id, NULL);
  RETURN true;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 4. Users / Role management
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_target_user_id uuid,
  p_new_role user_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_role user_role;
  v_admin_count integer;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Admin role required';
  END IF;

  IF p_target_user_id = auth.uid() AND p_new_role != 'admin' THEN
    -- Protect: don't let admin remove their own admin role if they are the last admin
    SELECT count(*) INTO v_admin_count
    FROM public.profiles WHERE role = 'admin';
    IF v_admin_count <= 1 THEN
      RAISE EXCEPTION 'FORBIDDEN: Cannot remove the last admin account';
    END IF;
  END IF;

  SELECT role INTO v_old_role FROM public.profiles WHERE id = p_target_user_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'NOT_FOUND: User not found'; END IF;

  UPDATE public.profiles SET role = p_new_role, updated_at = now()
  WHERE id = p_target_user_id;

  PERFORM public.log_audit('change_user_role', 'profiles', p_target_user_id,
    jsonb_build_object('old_role', v_old_role, 'new_role', p_new_role));

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_users(
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_search text DEFAULT NULL,
  p_role user_role DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows jsonb;
  v_total bigint;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Admin role required';
  END IF;

  SELECT
    jsonb_agg(jsonb_build_object(
      'id', p.id,
      'username', p.username,
      'display_name', p.display_name,
      'role', p.role,
      'xp', p.xp,
      'level', p.level,
      'created_at', p.created_at
    ) ORDER BY p.created_at DESC),
    count(*) OVER ()
  INTO v_rows, v_total
  FROM public.profiles p
  WHERE (p_search IS NULL OR p.display_name ILIKE '%' || p_search || '%' OR p.username ILIKE '%' || p_search || '%')
    AND (p_role IS NULL OR p.role = p_role)
  LIMIT p_limit OFFSET p_offset;

  RETURN jsonb_build_object(
    'users', COALESCE(v_rows, '[]'::jsonb),
    'total', COALESCE(v_total, 0)
  );
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 5. Bulk question import (called after client-side validation)
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.import_questions_batch(
  p_job_id uuid,
  p_rows jsonb  -- array of validated question rows
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row jsonb;
  v_topic_id uuid;
  v_question_id uuid;
  v_success integer := 0;
  v_failed integer := 0;
  v_opt jsonb;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  -- Update job status to processing
  UPDATE public.content_import_jobs
  SET status = 'processing'
  WHERE id = p_job_id;

  FOR v_row IN SELECT * FROM jsonb_array_elements(p_rows)
  LOOP
    BEGIN
      -- Resolve topic by slug
      SELECT t.id INTO v_topic_id
      FROM public.topics t
      JOIN public.subjects s ON s.id = t.subject_id
      WHERE s.slug = v_row->>'subject_slug' AND t.slug = v_row->>'topic_slug';

      IF v_topic_id IS NULL THEN
        RAISE EXCEPTION 'UNKNOWN_TOPIC';
      END IF;

      -- Insert question
      INSERT INTO public.questions (
        topic_id, type, difficulty, prompt, explanation,
        points, time_limit_seconds, status, created_by
      ) VALUES (
        v_topic_id,
        (v_row->>'question_type')::question_type,
        COALESCE((v_row->>'difficulty')::difficulty_level, 'medium'),
        v_row->>'prompt_vi',
        v_row->>'explanation_vi',
        COALESCE((v_row->>'points')::integer, 10),
        30,
        'draft',
        auth.uid()
      )
      RETURNING id INTO v_question_id;

      -- Insert options (A-F)
      FOR v_opt IN
        SELECT key, content FROM (VALUES
          ('A', v_row->>'option_a_vi'),
          ('B', v_row->>'option_b_vi'),
          ('C', v_row->>'option_c_vi'),
          ('D', v_row->>'option_d_vi'),
          ('E', v_row->>'option_e_vi'),
          ('F', v_row->>'option_f_vi')
        ) AS opts(key, content)
        WHERE content IS NOT NULL AND trim(content) != ''
      LOOP
        INSERT INTO public.question_options (question_id, option_key, content)
        VALUES (v_question_id, v_opt->>'key', v_opt->>'content');
      END LOOP;

      -- Insert answer
      IF v_row->>'correct_option_keys' IS NOT NULL THEN
        INSERT INTO public.question_answers (question_id, answer_payload)
        VALUES (
          v_question_id,
          jsonb_build_object('keys', string_to_array(v_row->>'correct_option_keys', ';'))
        );
      ELSIF v_row->>'accepted_answers' IS NOT NULL THEN
        INSERT INTO public.question_answers (question_id, answer_payload)
        VALUES (
          v_question_id,
          jsonb_build_object('accepted', string_to_array(v_row->>'accepted_answers', '|'))
        );
      END IF;

      v_success := v_success + 1;

    EXCEPTION WHEN OTHERS THEN
      v_failed := v_failed + 1;
      INSERT INTO public.content_import_errors (job_id, row_number, error_message)
      VALUES (p_job_id, v_success + v_failed, SQLERRM);
    END;
  END LOOP;

  -- Finalize job
  UPDATE public.content_import_jobs
  SET
    status = CASE WHEN v_failed = 0 THEN 'completed'::import_status ELSE 'failed'::import_status END,
    imported_rows = v_success,
    failed_rows = v_failed,
    total_rows = jsonb_array_length(p_rows),
    finished_at = now()
  WHERE id = p_job_id;

  PERFORM public.log_audit('import_questions', 'content_import_jobs', p_job_id,
    jsonb_build_object('success', v_success, 'failed', v_failed));

  RETURN jsonb_build_object('success', v_success, 'failed', v_failed, 'job_id', p_job_id);
END;
$$;

-- ─────────────────────────────────────────────────────────
-- 6. Create import job record
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_import_job(
  p_file_name text,
  p_file_size integer,
  p_total_rows integer,
  p_duplicate_policy duplicate_policy DEFAULT 'skip'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_id uuid;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff role required';
  END IF;

  INSERT INTO public.content_import_jobs (created_by, file_name, file_size, total_rows, duplicate_policy)
  VALUES (auth.uid(), p_file_name, p_file_size, p_total_rows, p_duplicate_policy)
  RETURNING id INTO v_job_id;

  RETURN v_job_id;
END;
$$;
