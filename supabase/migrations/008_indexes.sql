-- 008_indexes.sql
-- Performance indexes for lookups, leaderboard, and arena real-time queries

CREATE INDEX idx_profiles_xp_leaderboard ON public.profiles (xp DESC, level DESC);
CREATE INDEX idx_profiles_role ON public.profiles (role);

CREATE INDEX idx_subjects_slug ON public.subjects (slug);
CREATE INDEX idx_topics_subject_slug ON public.topics (subject_id, slug);
CREATE INDEX idx_lessons_topic_slug ON public.lessons (topic_id, slug);

CREATE INDEX idx_questions_topic_status ON public.questions (topic_id, status);
CREATE INDEX idx_questions_difficulty ON public.questions (difficulty);
CREATE INDEX idx_question_options_question_id ON public.question_options (question_id);

CREATE INDEX idx_exams_subject_status ON public.exams (subject_id, status);
CREATE INDEX idx_exam_questions_exam ON public.exam_questions (exam_id, sort_order);

CREATE INDEX idx_attempts_user_status ON public.attempts (user_id, status);
CREATE INDEX idx_attempts_exam ON public.attempts (exam_id);
CREATE INDEX idx_attempt_answers_attempt ON public.attempt_answers (attempt_id);

CREATE INDEX idx_arena_rooms_code ON public.arena_rooms (code);
CREATE INDEX idx_arena_rooms_status_vis ON public.arena_rooms (status, visibility);
CREATE INDEX idx_arena_participants_room_user ON public.arena_participants (room_id, user_id);
CREATE INDEX idx_arena_participants_last_seen ON public.arena_participants (room_id, last_seen_at);
CREATE INDEX idx_arena_matches_room ON public.arena_matches (room_id);
CREATE INDEX idx_arena_answers_match_user ON public.arena_answers (match_id, user_id);

CREATE INDEX idx_xp_transactions_user ON public.xp_transactions (user_id, created_at DESC);
CREATE INDEX idx_audit_logs_actor_created ON public.audit_logs (actor_id, created_at DESC);
