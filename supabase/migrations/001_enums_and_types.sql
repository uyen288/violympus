-- 001_enums_and_types.sql
-- Violympus core enums and types

CREATE TYPE user_role AS ENUM ('learner', 'editor', 'admin');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE question_type AS ENUM ('single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE exam_mode AS ENUM ('solo_practice', 'solo_exam', 'arena_match');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed', 'expired', 'abandoned');
CREATE TYPE room_status AS ENUM ('waiting', 'in_match', 'finished', 'cancelled');
CREATE TYPE match_status AS ENUM ('countdown', 'in_progress', 'finished');
CREATE TYPE participant_status AS ENUM ('joined', 'ready', 'answering', 'answered', 'disconnected', 'forfeited');
CREATE TYPE room_visibility AS ENUM ('public', 'private');
CREATE TYPE import_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE duplicate_policy AS ENUM ('skip', 'overwrite', 'error');
