import { supabase } from '@/lib/supabase/client';

export interface ExamSummary {
  id: string;
  title: string;
  description: string | null;
  timeLimitSeconds: number;
  passingScore: number;
  totalPoints: number;
  subjectId: string;
  subjectName?: string;
  subjectSlug?: string;
  questionCount?: number;
}

export interface ExamQuestionOption {
  optionKey: string;
  content: string;
  sortOrder: number;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  points: number;
  timeLimitSeconds: number | null;
  sortOrder: number;
  options: ExamQuestionOption[];
}

export interface ExamDetails extends ExamSummary {
  questions: ExamQuestion[];
}

export interface ExamGradingResult {
  examId: string;
  title: string;
  score: number;
  totalPoints: number;
  passingScore: number;
  isPassed: boolean;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: unknown;
    pointsAwarded: number;
    maxPoints: number;
    explanation: string;
    officialAnswer: unknown;
  }>;
}

// Fallback mock exams for zero-network or local offline demo
export const FALLBACK_EXAMS: ExamSummary[] = [
  {
    id: '00000000-0000-0003-0000-000000000001',
    title: 'Đề thi Toán học — Vượt chướng ngại vật Violympus',
    description: 'Bộ câu hỏi tổng hợp: Đạo hàm, cực trị, giải toán điền số và ghép cặp logic.',
    timeLimitSeconds: 1200,
    passingScore: 50,
    totalPoints: 100,
    subjectId: '00000000-0000-0000-0000-000000000001',
    subjectName: 'Toán học',
    subjectSlug: 'toan-hoc',
    questionCount: 3,
  },
  {
    id: '00000000-0000-0003-0000-000000000002',
    title: 'Đề thi Ngữ văn & Tiếng Việt — Tinh hoa ngôn từ',
    description: 'Kiểm tra kiến thức văn học tác phẩm lớn và kỹ năng phân tích biện pháp tu từ.',
    timeLimitSeconds: 900,
    passingScore: 50,
    totalPoints: 100,
    subjectId: '00000000-0000-0000-0000-000000000002',
    subjectName: 'Ngữ văn & Tiếng Việt',
    subjectSlug: 'ngu-van',
    questionCount: 2,
  },
  {
    id: '00000000-0000-0003-0000-000000000003',
    title: 'Đề thi Tiếng Anh — Academic Vocabulary & Grammar',
    description: 'Thử thách ngữ pháp nâng cao, mệnh đề quan hệ và bài tập ghép cặp từ đồng nghĩa.',
    timeLimitSeconds: 900,
    passingScore: 60,
    totalPoints: 100,
    subjectId: '00000000-0000-0000-0000-000000000003',
    subjectName: 'Tiếng Anh',
    subjectSlug: 'tieng-anh',
    questionCount: 2,
  },
  {
    id: '00000000-0000-0003-0000-000000000004',
    title: 'Đề thi Lịch sử & Địa lý — Hành trình non sông',
    description: 'Các mốc son lịch sử Việt Nam và kiến thức địa lý tự nhiên, khí hậu vùng miền.',
    timeLimitSeconds: 900,
    passingScore: 50,
    totalPoints: 100,
    subjectId: '00000000-0000-0000-0000-000000000007',
    subjectName: 'Lịch sử & Địa lý',
    subjectSlug: 'lich-su',
    questionCount: 2,
  },
];

export const examService = {
  async getPublishedExams(subjectId?: string): Promise<ExamSummary[]> {
    try {
      let query = supabase
        .from('exams')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return FALLBACK_EXAMS;
      }

      return data.map((item) => {
        const fallback = FALLBACK_EXAMS.find((f) => f.id === item.id);
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          timeLimitSeconds: item.time_limit_seconds,
          passingScore: item.passing_score,
          totalPoints: item.total_points,
          subjectId: item.subject_id,
          subjectName: fallback?.subjectName || 'Tổng hợp',
          subjectSlug: fallback?.subjectSlug || 'general',
          questionCount: 5,
        };
      });
    } catch {
      return FALLBACK_EXAMS;
    }
  },

  async getExamDetails(examId: string): Promise<ExamDetails> {
    const fallback = FALLBACK_EXAMS.find((e) => e.id === examId) || FALLBACK_EXAMS[0];

    try {
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (examError || !examData) {
        return {
          ...fallback,
          questions: getFallbackQuestionsForExam(examId),
        };
      }

      return {
        id: examData.id,
        title: examData.title,
        description: examData.description,
        timeLimitSeconds: examData.time_limit_seconds,
        passingScore: examData.passing_score,
        totalPoints: examData.total_points,
        subjectId: examData.subject_id,
        subjectName: fallback.subjectName,
        subjectSlug: fallback.subjectSlug,
        questionCount: fallback.questionCount || 3,
        questions: getFallbackQuestionsForExam(examId),
      };
    } catch {
      return {
        ...fallback,
        questions: getFallbackQuestionsForExam(examId),
      };
    }
  },

  async gradeGuestExam(examId: string, answers: Record<string, unknown>): Promise<ExamGradingResult> {
    try {
      const { data, error } = await supabase.rpc('grade_guest_exam', {
        p_exam_id: examId,
        p_answers: answers as Record<string, string>,
      });

      if (error || !data) {
        return evaluateLocalFallback(examId, answers);
      }

      return {
        examId: data.exam_id,
        title: data.title,
        score: data.score,
        totalPoints: data.total_points,
        passingScore: data.passing_score,
        isPassed: data.is_passed,
        correctCount: data.correct_count,
        totalQuestions: data.total_questions,
        submittedAt: data.submitted_at,
        results: data.results.map((r) => ({
          questionId: r.question_id,
          isCorrect: r.is_correct,
          userAnswer: r.user_answer,
          pointsAwarded: r.points_awarded,
          maxPoints: r.max_points,
          explanation: r.explanation,
          officialAnswer: r.official_answer,
        })),
      };
    } catch {
      return evaluateLocalFallback(examId, answers);
    }
  },
};

function getFallbackQuestionsForExam(examId: string): ExamQuestion[] {
  if (
    examId === '00000000-0000-0003-0000-000000000001' ||
    examId === '00000000-0000-0000-0003-000000000001'
  ) {
    return [
      {
        id: '00000000-0000-0000-0002-000000000001',
        prompt: 'Đạo hàm của hàm số f(x) = x^3 - 3x^2 + 2 tại điểm x = 1 là bao nhiêu?',
        type: 'single_choice',
        points: 10,
        timeLimitSeconds: 30,
        sortOrder: 1,
        options: [
          { optionKey: 'A', content: '-3', sortOrder: 1 },
          { optionKey: 'B', content: '3', sortOrder: 2 },
          { optionKey: 'C', content: '0', sortOrder: 3 },
          { optionKey: 'D', content: '-6', sortOrder: 4 },
        ],
      },
      {
        id: '00000000-0000-0000-0002-000000000002',
        prompt: 'Giá trị nhỏ nhất của hàm số f(x) = x^2 - 4x + 9 trên tập số thực là bao nhiêu? (Nhập giá trị số nguyên)',
        type: 'fill_blank',
        points: 15,
        timeLimitSeconds: 30,
        sortOrder: 2,
        options: [],
      },
      {
        id: '00000000-0000-0000-0002-000000000003',
        prompt: 'Ghép mỗi biểu thức toán học ở cột trái với giá trị tương ứng ở cột phải:',
        type: 'matching',
        points: 20,
        timeLimitSeconds: 60,
        sortOrder: 3,
        options: [
          { optionKey: 'L1', content: 'Căn bậc hai của 64', sortOrder: 1 },
          { optionKey: 'L2', content: '2 lũy thừa 5 (2^5)', sortOrder: 2 },
          { optionKey: 'L3', content: 'log2(16)', sortOrder: 3 },
          { optionKey: 'R1', content: '8', sortOrder: 4 },
          { optionKey: 'R2', content: '32', sortOrder: 5 },
          { optionKey: 'R3', content: '4', sortOrder: 6 },
        ],
      },
    ];
  }

  // Default fallback questions for any other exam
  return [
    {
      id: '00000000-0000-0000-0002-000000000004',
      prompt: 'Tác phẩm "Truyện Kiều" của Đại thi hào Nguyễn Du được viết bằng chữ gì và theo thể thơ nào?',
      type: 'single_choice',
      points: 10,
      timeLimitSeconds: 20,
      sortOrder: 1,
      options: [
        { optionKey: 'A', content: 'Chữ Nôm, thể thơ lục bát', sortOrder: 1 },
        { optionKey: 'B', content: 'Chữ Hán, thể thơ thất ngôn bát cú', sortOrder: 2 },
        { optionKey: 'C', content: 'Chữ Quốc ngữ, thể thơ song thất lục bát', sortOrder: 3 },
        { optionKey: 'D', content: 'Chữ Nôm, thể thơ tự do', sortOrder: 4 },
      ],
    },
    {
      id: '00000000-0000-0000-0002-000000000005',
      prompt: 'Điền từ còn thiếu vào câu thơ trong bài thơ Tây Tiến của Quang Dũng: "Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai..."?',
      type: 'fill_blank',
      points: 10,
      timeLimitSeconds: 20,
      sortOrder: 2,
      options: [],
    },
  ];
}

function evaluateLocalFallback(examId: string, answers: Record<string, unknown>): ExamGradingResult {
  const questions = getFallbackQuestionsForExam(examId);
  const correctKeys: Record<string, unknown> = {
    '00000000-0000-0000-0002-000000000001': 'A',
    '00000000-0000-0000-0002-000000000002': '5',
    '00000000-0000-0000-0002-000000000003': { L1: 'R1', L2: 'R2', L3: 'R3' },
    '00000000-0000-0000-0002-000000000004': 'A',
    '00000000-0000-0000-0002-000000000005': 'hùm',
  };

  const explanations: Record<string, string> = {
    '00000000-0000-0000-0002-000000000001': "f'(x) = 3x^2 - 6x. Thay x = 1 ta được 3 - 6 = -3.",
    '00000000-0000-0000-0002-000000000002': 'f(x) = (x - 2)^2 + 5 >= 5 với mọi x. GTNN = 5.',
    '00000000-0000-0000-0002-000000000003': 'Căn 64 = 8; 2^5 = 32; log2(16) = 4.',
    '00000000-0000-0000-0002-000000000004': 'Truyện Kiều viết bằng chữ Nôm theo thể lục bát.',
    '00000000-0000-0000-0002-000000000005': 'Quân xanh màu lá dữ oai hùm.',
  };

  let score = 0;
  let correctCount = 0;
  let totalPoints = 0;

  const results = questions.map((q) => {
    totalPoints += q.points;
    const userAns = answers[q.id];
    const officialAns = correctKeys[q.id];
    let isCorrect = false;

    if (userAns !== undefined && userAns !== null) {
      if (typeof officialAns === 'object' && officialAns !== null) {
        isCorrect = JSON.stringify(userAns) === JSON.stringify(officialAns);
      } else {
        isCorrect = String(userAns).trim().toLowerCase() === String(officialAns).trim().toLowerCase();
      }
    }

    const awarded = isCorrect ? q.points : 0;
    if (isCorrect) {
      correctCount += 1;
      score += awarded;
    }

    return {
      questionId: q.id,
      isCorrect,
      userAnswer: userAns ?? null,
      pointsAwarded: awarded,
      maxPoints: q.points,
      explanation: explanations[q.id] || 'Đáp án chính xác đã được thẩm định.',
      officialAnswer: officialAns,
    };
  });

  return {
    examId,
    title: 'Đề thi Khảo sát Năng lực',
    score,
    totalPoints: totalPoints || 100,
    passingScore: 50,
    isPassed: score >= 50,
    correctCount,
    totalQuestions: questions.length,
    submittedAt: new Date().toISOString(),
    results,
  };
}
