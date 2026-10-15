import { describe, it, expect } from 'vitest';
import {
  parseCsvRows,
  validateParsedRow,
  generateErrorReport,
} from './adminImportService';

describe('adminImportService - CSV Parsing & Validation', () => {
  it('returns empty array when CSV is empty or only contains header', () => {
    expect(parseCsvRows('')).toEqual([]);
    expect(parseCsvRows('subject_slug,topic_slug,question_type,prompt_vi')).toEqual([]);
  });

  it('correctly parses and validates a valid single_choice row', () => {
    const csv = [
      'subject_slug,topic_slug,question_type,prompt_vi,option_a_vi,option_b_vi,correct_option_keys,difficulty,points',
      'toan-hoc,dai-so,single_choice,2 + 2 bằng mấy?,3,4,B,easy,10',
    ].join('\n');

    const rows = parseCsvRows(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]._valid).toBe(true);
    expect(rows[0]._errors).toHaveLength(0);
    expect(rows[0].subject_slug).toBe('toan-hoc');
    expect(rows[0].topic_slug).toBe('dai-so');
    expect(rows[0].question_type).toBe('single_choice');
    expect(rows[0].prompt_vi).toBe('2 + 2 bằng mấy?');
    expect(rows[0].option_a_vi).toBe('3');
    expect(rows[0].option_b_vi).toBe('4');
    expect(rows[0].correct_option_keys).toBe('B');
  });

  it('handles quotes with commas inside fields', () => {
    const csv = [
      'subject_slug,topic_slug,question_type,prompt_vi,option_a_vi,option_b_vi,correct_option_keys',
      'van-hoc,tho-ca,single_choice,"Trời xanh, mây trắng, nắng vàng",Đúng,Sai,A',
    ].join('\n');

    const rows = parseCsvRows(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]._valid).toBe(true);
    expect(rows[0].prompt_vi).toBe('Trời xanh, mây trắng, nắng vàng');
  });

  it('flags missing required fields', () => {
    const row = validateParsedRow({
      subject_slug: '',
      topic_slug: 'dai-so',
      question_type: 'single_choice',
      prompt_vi: '',
    }, 2);

    expect(row._valid).toBe(false);
    expect(row._errors).toContain('MISSING_REQUIRED: subject_slug');
    expect(row._errors).toContain('MISSING_REQUIRED: prompt_vi');
  });

  it('validates type-specific rules for true_false and fill_blank', () => {
    // true_false without answer
    const tfRow = validateParsedRow({
      subject_slug: 'toan',
      topic_slug: 'hinh',
      question_type: 'true_false',
      prompt_vi: 'Tam giác đều có 3 cạnh bằng nhau',
    }, 2);
    expect(tfRow._valid).toBe(false);
    expect(tfRow._errors).toContain('MISSING_REQUIRED: correct_option_keys (true or false)');

    // fill_blank without accepted_answers
    const fbRow = validateParsedRow({
      subject_slug: 'hoa',
      topic_slug: 'chat',
      question_type: 'fill_blank',
      prompt_vi: 'Công thức hóa học của nước là gì?',
    }, 3);
    expect(fbRow._valid).toBe(false);
    expect(fbRow._errors).toContain('MISSING_REQUIRED: accepted_answers');
  });

  it('sanitizes script tags from prompt fields', () => {
    const row = validateParsedRow({
      subject_slug: 'cntt',
      topic_slug: 'web',
      question_type: 'fill_blank',
      prompt_vi: 'Hello <script>alert("hack")</script> World',
      accepted_answers: 'World',
    }, 4);

    expect(row._valid).toBe(true);
    expect(row.prompt_vi).toBe('Hello  World');
  });

  it('generates a CSV error report and neutralizes formula injection', () => {
    const invalidRows = [
      validateParsedRow({
        subject_slug: '',
        topic_slug: '',
        question_type: 'unknown_type',
        prompt_vi: '',
      }, 5),
    ];
    // Manually push a formula injection error to test safeCell
    invalidRows[0]._errors.push('=CMD: malicious formula payload');

    const report = generateErrorReport(invalidRows);
    expect(report).toContain('row_number,field,error_code,message');
    expect(report).toContain('5,MISSING_REQUIRED');
    // Formula prefix starting with = must be escaped with single quote
    expect(report).toContain("'=CMD");
  });
});
