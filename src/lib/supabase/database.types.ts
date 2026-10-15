export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'learner' | 'editor' | 'admin';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExamMode = 'solo_practice' | 'solo_exam' | 'arena_match';
export type AttemptStatus = 'in_progress' | 'completed' | 'expired' | 'abandoned';
export type RoomStatus = 'waiting' | 'in_match' | 'finished' | 'cancelled';
export type MatchStatus = 'countdown' | 'in_progress' | 'finished';
export type ParticipantStatus = 'joined' | 'ready' | 'answering' | 'answered' | 'disconnected' | 'forfeited';
export type RoomVisibility = 'public' | 'private';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type DuplicatePolicy = 'skip' | 'overwrite' | 'error';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          role: UserRole;
          xp: number;
          level: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          xp?: number;
          level?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          xp?: number;
          level?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_name: string;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_name?: string;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_name?: string;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          subject_id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          topic_id: string;
          slug: string;
          title: string;
          content_markdown: string;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          slug: string;
          title: string;
          content_markdown?: string;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          slug?: string;
          title?: string;
          content_markdown?: string;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          topic_id: string;
          type: QuestionType;
          difficulty: DifficultyLevel;
          prompt: string;
          explanation: string | null;
          points: number;
          time_limit_seconds: number;
          status: ContentStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          type?: QuestionType;
          difficulty?: DifficultyLevel;
          prompt: string;
          explanation?: string | null;
          points?: number;
          time_limit_seconds?: number;
          status?: ContentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          type?: QuestionType;
          difficulty?: DifficultyLevel;
          prompt?: string;
          explanation?: string | null;
          points?: number;
          time_limit_seconds?: number;
          status?: ContentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      question_options: {
        Row: {
          id: string;
          question_id: string;
          option_key: string;
          content: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          option_key: string;
          content: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          question_id?: string;
          option_key?: string;
          content?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      question_answers: {
        Row: {
          id: string;
          question_id: string;
          answer_payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          answer_payload: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          answer_payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      exams: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          description: string | null;
          time_limit_seconds: number;
          passing_score: number;
          total_points: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          description?: string | null;
          time_limit_seconds?: number;
          passing_score?: number;
          total_points?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          description?: string | null;
          time_limit_seconds?: number;
          passing_score?: number;
          total_points?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exam_questions: {
        Row: {
          id: string;
          exam_id: string;
          question_id: string;
          sort_order: number;
          points: number;
        };
        Insert: {
          id?: string;
          exam_id: string;
          question_id: string;
          sort_order?: number;
          points?: number;
        };
        Update: {
          id?: string;
          exam_id?: string;
          question_id?: string;
          sort_order?: number;
          points?: number;
        };
        Relationships: [];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string | null;
          mode: ExamMode;
          status: AttemptStatus;
          score: number;
          total_points: number;
          started_at: string;
          deadline: string;
          submitted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id?: string | null;
          mode?: ExamMode;
          status?: AttemptStatus;
          score?: number;
          total_points?: number;
          started_at?: string;
          deadline: string;
          submitted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string | null;
          mode?: ExamMode;
          status?: AttemptStatus;
          score?: number;
          total_points?: number;
          started_at?: string;
          deadline?: string;
          submitted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      attempt_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          user_answer: Json;
          is_correct: boolean | null;
          points_awarded: number | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          user_answer: Json;
          is_correct?: boolean | null;
          points_awarded?: number | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          user_answer?: Json;
          is_correct?: boolean | null;
          points_awarded?: number | null;
          answered_at?: string;
        };
        Relationships: [];
      };
      arena_rooms: {
        Row: {
          id: string;
          code: string;
          host_id: string;
          subject_id: string | null;
          title: string;
          status: RoomStatus;
          visibility: RoomVisibility;
          max_participants: number;
          question_count: number;
          time_per_question: number;
          current_question_index: number;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          host_id: string;
          subject_id?: string | null;
          title: string;
          status?: RoomStatus;
          visibility?: RoomVisibility;
          max_participants?: number;
          question_count?: number;
          time_per_question?: number;
          current_question_index?: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          host_id?: string;
          subject_id?: string | null;
          title?: string;
          status?: RoomStatus;
          visibility?: RoomVisibility;
          max_participants?: number;
          question_count?: number;
          time_per_question?: number;
          current_question_index?: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      arena_participants: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          status: ParticipantStatus;
          score: number;
          last_seen_at: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          status?: ParticipantStatus;
          score?: number;
          last_seen_at?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          status?: ParticipantStatus;
          score?: number;
          last_seen_at?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      arena_matches: {
        Row: {
          id: string;
          room_id: string;
          status: MatchStatus;
          current_question_id: string | null;
          question_index: number;
          question_started_at: string | null;
          question_deadline: string | null;
          started_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          status?: MatchStatus;
          current_question_id?: string | null;
          question_index?: number;
          question_started_at?: string | null;
          question_deadline?: string | null;
          started_at?: string;
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          status?: MatchStatus;
          current_question_id?: string | null;
          question_index?: number;
          question_started_at?: string | null;
          question_deadline?: string | null;
          started_at?: string;
          finished_at?: string | null;
        };
        Relationships: [];
      };
      arena_match_questions: {
        Row: {
          id: string;
          match_id: string;
          question_id: string;
          sort_order: number;
          points: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          question_id: string;
          sort_order?: number;
          points?: number;
        };
        Update: {
          id?: string;
          match_id?: string;
          question_id?: string;
          sort_order?: number;
          points?: number;
        };
        Relationships: [];
      };
      arena_answers: {
        Row: {
          id: string;
          match_id: string;
          question_id: string;
          user_id: string;
          user_answer: Json;
          is_correct: boolean | null;
          points_awarded: number | null;
          response_time_ms: number | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          question_id: string;
          user_id: string;
          user_answer: Json;
          is_correct?: boolean | null;
          points_awarded?: number | null;
          response_time_ms?: number | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          question_id?: string;
          user_id?: string;
          user_answer?: Json;
          is_correct?: boolean | null;
          points_awarded?: number | null;
          response_time_ms?: number | null;
          answered_at?: string;
        };
        Relationships: [];
      };
      xp_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source_type: string;
          source_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          source_type: string;
          source_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          reason?: string;
          source_type?: string;
          source_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_name: string;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_name?: string;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_name?: string;
          xp_reward?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          awarded_at?: string;
        };
        Relationships: [];
      };
      content_import_jobs: {
        Row: {
          id: string;
          created_by: string;
          file_name: string;
          file_size: number;
          total_rows: number;
          imported_rows: number;
          failed_rows: number;
          status: ImportStatus;
          duplicate_policy: DuplicatePolicy;
          error_summary: string | null;
          created_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          created_by: string;
          file_name: string;
          file_size?: number;
          total_rows?: number;
          imported_rows?: number;
          failed_rows?: number;
          status?: ImportStatus;
          duplicate_policy?: DuplicatePolicy;
          error_summary?: string | null;
          created_at?: string;
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          created_by?: string;
          file_name?: string;
          file_size?: number;
          total_rows?: number;
          imported_rows?: number;
          failed_rows?: number;
          status?: ImportStatus;
          duplicate_policy?: DuplicatePolicy;
          error_summary?: string | null;
          created_at?: string;
          finished_at?: string | null;
        };
        Relationships: [];
      };
      content_import_errors: {
        Row: {
          id: string;
          job_id: string;
          row_number: number;
          raw_data: Json | null;
          error_message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          row_number: number;
          raw_data?: Json | null;
          error_message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          row_number?: number;
          raw_data?: Json | null;
          error_message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          changes: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          changes?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_entity?: string;
          target_id?: string | null;
          changes?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      start_attempt: {
        Args: {
          p_exam_id: string;
          p_mode?: ExamMode;
        };
        Returns: {
          attempt_id: string;
          started_at: string;
          deadline: string;
          time_limit_seconds: number;
        };
      };
      save_attempt_answer: {
        Args: {
          p_attempt_id: string;
          p_question_id: string;
          p_answer: Json;
        };
        Returns: boolean;
      };
      submit_attempt: {
        Args: {
          p_attempt_id: string;
        };
        Returns: {
          score: number;
          total_points: number;
          correct_count: number;
          total_questions: number;
          submitted_at: string;
        };
      };
      create_room: {
        Args: {
          p_title: string;
          p_subject_id?: string | null;
          p_question_count?: number;
          p_time_per_question?: number;
          p_visibility?: RoomVisibility;
        };
        Returns: {
          room_id: string;
          code: string;
          host_id: string;
          title: string;
        };
      };
      join_room: {
        Args: {
          p_code: string;
        };
        Returns: {
          room_id: string;
          code: string;
          title: string;
          host_id: string;
        };
      };
      leave_room: {
        Args: {
          p_room_id: string;
        };
        Returns: {
          success: boolean;
          next_host: string | null;
        };
      };
      submit_arena_answer: {
        Args: {
          p_match_id: string;
          p_question_id: string;
          p_answer: Json;
          p_response_time_ms?: number;
        };
        Returns: {
          is_correct: boolean;
          points_awarded: number;
          speed_bonus: number;
        };
      };
      arena_heartbeat: {
        Args: {
          p_room_id: string;
        };
        Returns: boolean;
      };
      check_practice_answer: {
        Args: {
          p_question_id: string;
          p_user_answer: Json;
        };
        Returns: {
          question_id: string;
          is_correct: boolean;
          points_awarded: number;
          explanation: string;
          official_answer: Json;
        };
      };
      grade_guest_exam: {
        Args: {
          p_exam_id: string;
          p_answers: Json;
        };
        Returns: {
          exam_id: string;
          title: string;
          score: number;
          total_points: number;
          passing_score: number;
          is_passed: boolean;
          correct_count: number;
          total_questions: number;
          submitted_at: string;
          results: Array<{
            question_id: string;
            is_correct: boolean;
            user_answer: Json;
            points_awarded: number;
            max_points: number;
            explanation: string;
            official_answer: Json;
          }>;
        };
      };
    };
  };
}

/** Convenience helper to extract table Row types */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

/** Typed RPC caller that accepts any function name (for admin RPCs not in generated types) */
export type AdminRpcName =
  | 'admin_upsert_subject'
  | 'admin_delete_subject'
  | 'admin_upsert_topic'
  | 'admin_get_question'
  | 'admin_upsert_question'
  | 'admin_delete_question'
  | 'admin_list_users'
  | 'admin_set_user_role'
  | 'import_questions_batch'
  | 'create_import_job'
  | 'log_audit';
