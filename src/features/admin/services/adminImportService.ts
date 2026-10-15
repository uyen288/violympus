// src/features/admin/services/adminImportService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export const IMPORT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const IMPORT_MAX_ROWS = 2000;

export interface ImportJobRow {
  id: string;
  file_name: string;
  file_size: number;
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duplicate_policy: 'skip' | 'overwrite' | 'error';
  error_summary: string | null;
  created_at: string;
  finished_at: string | null;
}

export interface ImportError {
  id: string;
  job_id: string;
  row_number: number;
  error_message: string;
  created_at: string;
}

export interface ParsedQuestionRow {
  subject_slug: string;
  topic_slug: string;
  question_type: string;
  prompt_vi: string;
  prompt_en?: string;
  option_a_vi?: string;
  option_b_vi?: string;
  option_c_vi?: string;
  option_d_vi?: string;
  option_e_vi?: string;
  option_f_vi?: string;
  correct_option_keys?: string;
  accepted_answers?: string;
  explanation_vi?: string;
  explanation_en?: string;
  difficulty?: string;
  points?: string;
  status?: string;
  // validation state (client-only)
  _rowIndex: number;
  _errors: string[];
  _valid: boolean;
}

export async function listImportJobs(): Promise<ImportJobRow[]> {
  const { data, error } = await supabase
    .from('content_import_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw AppError.fromSupabaseError(error);
  return (data ?? []) as ImportJobRow[];
}

export async function getImportErrors(jobId: string): Promise<ImportError[]> {
  const { data, error } = await supabase
    .from('content_import_errors')
    .select('*')
    .eq('job_id', jobId)
    .order('row_number', { ascending: true });

  if (error) throw AppError.fromSupabaseError(error);
  return (data ?? []) as ImportError[];
}

export async function createImportJob(params: {
  fileName: string;
  fileSize: number;
  totalRows: number;
  duplicatePolicy: 'skip' | 'overwrite' | 'error';
}): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('create_import_job', {
    p_file_name: params.fileName,
    p_file_size: params.fileSize,
    p_total_rows: params.totalRows,
    p_duplicate_policy: params.duplicatePolicy,
  });

  if (error) throw AppError.fromSupabaseError(error);
  return data as string;
}

export async function importBatch(jobId: string, rows: ParsedQuestionRow[]): Promise<{ success: number; failed: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('import_questions_batch', {
    p_job_id: jobId,
    p_rows: JSON.stringify(rows.filter((r) => r._valid)),
  });

  if (error) throw AppError.fromSupabaseError(error);
  return data as unknown as { success: number; failed: number };
}

/** Client-side CSV parser (pure function, testable without DOM) */
export function parseCsvRows(csvText: string): ParsedQuestionRow[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map((line, i) => {
    // Handle quoted fields with commas inside
    const values: string[] = [];
    let current = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { values.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });

    return validateParsedRow(row, i + 2); // +2: 1 header + 1-indexed
  });
}

const REQUIRED_FIELDS = ['subject_slug', 'topic_slug', 'question_type', 'prompt_vi'];
const VALID_TYPES = ['single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', ''];

export function validateParsedRow(row: Record<string, string>, rowIndex: number): ParsedQuestionRow {
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || row[field].trim() === '') {
      errors.push(`MISSING_REQUIRED: ${field}`);
    }
  }

  if (row['question_type'] && !VALID_TYPES.includes(row['question_type'])) {
    errors.push(`INVALID_ENUM: question_type must be one of ${VALID_TYPES.join(', ')}`);
  }

  if (row['difficulty'] && !VALID_DIFFICULTIES.includes(row['difficulty'])) {
    errors.push(`INVALID_ENUM: difficulty must be easy|medium|hard`);
  }

  if (row['points'] && (isNaN(Number(row['points'])) || Number(row['points']) <= 0)) {
    errors.push(`VALIDATION: points must be a positive number`);
  }

  // Type-specific validation
  const qtype = row['question_type'];
  if (qtype === 'single_choice' || qtype === 'multiple_choice') {
    if (!row['option_a_vi'] || !row['option_b_vi']) {
      errors.push('TOO_FEW_OPTIONS: single_choice requires at least option_a_vi and option_b_vi');
    }
    if (!row['correct_option_keys']) {
      errors.push('MISSING_REQUIRED: correct_option_keys');
    }
  }
  if (qtype === 'true_false' && !row['correct_option_keys']) {
    errors.push('MISSING_REQUIRED: correct_option_keys (true or false)');
  }
  if (qtype === 'fill_blank' && !row['accepted_answers']) {
    errors.push('MISSING_REQUIRED: accepted_answers');
  }

  // Sanitize: strip dangerous characters from prompt fields
  const sanitize = (s: string) => s.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim();

  return {
    subject_slug: row['subject_slug'] ?? '',
    topic_slug: row['topic_slug'] ?? '',
    question_type: row['question_type'] ?? '',
    prompt_vi: sanitize(row['prompt_vi'] ?? ''),
    prompt_en: row['prompt_en'] ? sanitize(row['prompt_en']) : undefined,
    option_a_vi: row['option_a_vi'] || undefined,
    option_b_vi: row['option_b_vi'] || undefined,
    option_c_vi: row['option_c_vi'] || undefined,
    option_d_vi: row['option_d_vi'] || undefined,
    option_e_vi: row['option_e_vi'] || undefined,
    option_f_vi: row['option_f_vi'] || undefined,
    correct_option_keys: row['correct_option_keys'] || undefined,
    accepted_answers: row['accepted_answers'] || undefined,
    explanation_vi: row['explanation_vi'] || undefined,
    explanation_en: row['explanation_en'] || undefined,
    difficulty: row['difficulty'] || 'medium',
    points: row['points'] || '10',
    status: row['status'] || 'draft',
    _rowIndex: rowIndex,
    _errors: errors,
    _valid: errors.length === 0,
  };
}

/** Generate CSV error report (safe, strips formula injection) */
export function generateErrorReport(rows: ParsedQuestionRow[]): string {
  const safeCell = (s: string) => (/^[=+\-@]/.test(s) ? `'${s}` : s);
  const header = 'row_number,field,error_code,message\n';
  const lines = rows
    .filter((r) => !r._valid)
    .flatMap((r) =>
      r._errors.map((e) => {
        const [code, ...rest] = e.split(':');
        return `${safeCell(String(r._rowIndex))},${safeCell(code.trim())},${safeCell(code.trim())},${safeCell(rest.join(':').trim())}`;
      })
    );
  return header + lines.join('\n');
}
