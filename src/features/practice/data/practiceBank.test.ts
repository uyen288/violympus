import { describe, it, expect } from 'vitest';
import {
  SUBJECT_METAS,
  getMatchingCardsForSubjects,
  getPracticeQuestionsForSubjects,
  getBlankQuestionsForSubjects,
  getTrueFalseQuestionsForSubjects,
  getMultiSelectQuestionsForSubjects,
} from './practiceBank';

describe('practiceBank - Subject Multi-select Filtering', () => {
  it('should have 11 subjects defined', () => {
    expect(SUBJECT_METAS).toHaveLength(11);
  });

  it('should strictly return matching pairs for single selected subject', () => {
    const mathCards = getMatchingCardsForSubjects(['toan-hoc'], 6);
    expect(mathCards.length).toBeGreaterThan(0);
    // All cards must belong to Toán học
    mathCards.forEach((c) => {
      expect(c.category).toBe('Toán học');
    });

    const engCards = getMatchingCardsForSubjects(['tieng-anh'], 6);
    expect(engCards.length).toBeGreaterThan(0);
    engCards.forEach((c) => {
      expect(c.category).toBe('Tiếng Anh');
    });
  });

  it('should strictly filter multiple choice questions by selected subjects without cross-contamination', () => {
    const selected = ['vat-ly', 'hoa-hoc'];
    const questions = getPracticeQuestionsForSubjects(selected, 10);
    expect(questions.length).toBeGreaterThan(0);
    questions.forEach((q) => {
      expect(selected).toContain(q.subjectSlug);
    });
  });

  it('should strictly filter fill-in-the-blank questions by selected subject', () => {
    const historyBlanks = getBlankQuestionsForSubjects(['lich-su'], 5);
    expect(historyBlanks.length).toBeGreaterThan(0);
    historyBlanks.forEach((q) => {
      expect(q.subjectSlug).toBe('lich-su');
    });
  });

  it('should strictly filter true/false questions by selected subjects', () => {
    const logicTF = getTrueFalseQuestionsForSubjects(['triet-hoc-logic'], 5);
    expect(logicTF.length).toBeGreaterThan(0);
    logicTF.forEach((q) => {
      expect(q.subjectSlug).toBe('triet-hoc-logic');
    });
  });

  it('should strictly filter multi-select questions by selected subjects', () => {
    const multiQuestions = getMultiSelectQuestionsForSubjects(['toan-hoc', 'tin-hoc'], 5);
    expect(multiQuestions.length).toBeGreaterThan(0);
    multiQuestions.forEach((q) => {
      expect(['toan-hoc', 'tin-hoc']).toContain(q.subjectSlug);
      expect(Array.isArray(q.correctKeys)).toBe(true);
    });
  });
});
