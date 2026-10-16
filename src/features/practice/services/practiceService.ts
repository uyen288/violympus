// src/features/practice/services/practiceService.ts
import { supabase } from '@/lib/supabase/client';
import {
  SUBJECT_METAS,
  getMatchingCardsForSubjects,
  getPracticeQuestionsForSubjects,
  getBlankQuestionsForSubjects,
  getTrueFalseQuestionsForSubjects,
  getMultiSelectQuestionsForSubjects,
  type PracticeQuestion,
} from '../data/practiceBank';

export interface PracticeQuestionsOptions {
  selectedSubjectSlugs: string[];
  limit?: number;
}

interface SupabaseOptionRow {
  option_key: string;
  content: string;
  sort_order: number;
}

interface SupabaseQuestionRow {
  id: string;
  prompt: string;
  explanation: string | null;
  points: number;
  time_limit_seconds: number;
  topics?: {
    slug: string;
    subject_id: string;
    subjects?: {
      slug: string;
      name: string;
    } | null;
  } | null;
  question_options?: SupabaseOptionRow[] | null;
}

export async function fetchQuestionsForPractice(options: PracticeQuestionsOptions): Promise<PracticeQuestion[]> {
  const { selectedSubjectSlugs, limit = 10 } = options;

  try {
    // Attempt to query Supabase published questions if online
    let query = supabase
      .from('questions')
      .select('id,prompt,explanation,points,time_limit_seconds,topics!inner(slug,subject_id,subjects!inner(slug,name)),question_options(option_key,content,sort_order)')
      .eq('status', 'published')
      .limit(limit * 2);

    if (selectedSubjectSlugs.length > 0) {
      query = query.in('topics.subjects.slug', selectedSubjectSlugs);
    }

    const { data, error } = await query;

    if (!error && data && data.length >= 3) {
      const rows = data as unknown as SupabaseQuestionRow[];
      const mapped: PracticeQuestion[] = rows.map((row) => ({
        id: row.id,
        subjectSlug: row.topics?.subjects?.slug || 'chung',
        subjectName: row.topics?.subjects?.name || 'Kiến thức chung',
        prompt: row.prompt,
        options: (row.question_options || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((o) => ({ key: o.option_key, text: o.content })),
        correctKey: 'A',
        explanation: row.explanation || 'Đáp án đã được lưu trữ và thẩm định.',
      }));

      if (mapped.length >= 3) {
        return mapped.slice(0, limit);
      }
    }
  } catch {
    // In case of network error or Supabase not reachable, fallback to offline bank
  }

  // Pure strict subject-filtered bank fallback
  return getPracticeQuestionsForSubjects(selectedSubjectSlugs, limit);
}

export {
  SUBJECT_METAS,
  getMatchingCardsForSubjects,
  getPracticeQuestionsForSubjects,
  getBlankQuestionsForSubjects,
  getTrueFalseQuestionsForSubjects,
  getMultiSelectQuestionsForSubjects,
};
