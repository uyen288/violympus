-- 007_admin_audit.sql
-- Import jobs, errors, and append-only audit logs

CREATE TABLE public.content_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  total_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  failed_rows integer NOT NULL DEFAULT 0,
  status import_status NOT NULL DEFAULT 'pending',
  duplicate_policy duplicate_policy NOT NULL DEFAULT 'skip',
  error_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE public.content_import_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.content_import_jobs(id) ON DELETE CASCADE,
  row_number integer NOT NULL,
  raw_data jsonb,
  error_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_entity text NOT NULL,
  target_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_import_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view content import jobs"
  ON public.content_import_jobs FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can view import errors"
  ON public.content_import_errors FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));
