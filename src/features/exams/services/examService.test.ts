import { describe, it, expect } from 'vitest';
import { examService, FALLBACK_EXAMS } from './examService';

describe('examService - Guest and Public Exam Features', () => {
  it('should return published exams list with fallback', async () => {
    const exams = await examService.getPublishedExams();
    expect(exams).toBeDefined();
    expect(exams.length).toBeGreaterThanOrEqual(1);
    expect(exams[0]).toHaveProperty('id');
    expect(exams[0]).toHaveProperty('title');
    expect(exams[0]).toHaveProperty('passingScore');
  });

  it('should filter exams by subjectId', async () => {
    const targetSubjectId = FALLBACK_EXAMS[0].subjectId;
    const exams = await examService.getPublishedExams(targetSubjectId);
    expect(exams).toBeDefined();
  });

  it('should retrieve full exam details and questions', async () => {
    const exam = await examService.getExamDetails(FALLBACK_EXAMS[0].id);
    expect(exam).toBeDefined();
    expect(exam.questions.length).toBeGreaterThan(0);
    expect(exam.questions[0]).toHaveProperty('prompt');
    expect(exam.questions[0]).toHaveProperty('type');
  });

  it('should grade guest exam correctly without requiring user auth', async () => {
    const answers = {
      '00000000-0000-0000-0002-000000000001': 'A',
      '00000000-0000-0000-0002-000000000002': '5',
    };

    const result = await examService.gradeGuestExam(FALLBACK_EXAMS[0].id, answers);
    expect(result).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
    expect(result.totalQuestions).toBe(3);
    expect(result.results.length).toBe(3);

    // Q1 should be marked correct with explanation
    const q1Result = result.results.find((r) => r.questionId === '00000000-0000-0000-0002-000000000001');
    expect(q1Result?.isCorrect).toBe(true);
    expect(q1Result?.pointsAwarded).toBe(10);
    expect(q1Result?.explanation).toBeDefined();
  });

  it('should handle incorrect answers gracefully', async () => {
    const answers = {
      '00000000-0000-0000-0002-000000000001': 'WRONG_KEY',
    };

    const result = await examService.gradeGuestExam(FALLBACK_EXAMS[0].id, answers);
    expect(result).toBeDefined();
    const q1Result = result.results.find((r) => r.questionId === '00000000-0000-0000-0002-000000000001');
    expect(q1Result?.isCorrect).toBe(false);
    expect(q1Result?.pointsAwarded).toBe(0);
  });
});
