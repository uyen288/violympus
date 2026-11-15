import { describe, it, expect } from 'vitest';
import {
  OLYMPIA_KHOI_DONG,
  OLYMPIA_OBSTACLE,
  OLYMPIA_TANG_TOC,
  OLYMPIA_VE_DICH,
} from './olympiaBank';

describe('olympiaBank', () => {
  it('Khởi Động round contains at least 8 valid questions', () => {
    expect(OLYMPIA_KHOI_DONG.length).toBeGreaterThanOrEqual(8);
    for (const q of OLYMPIA_KHOI_DONG) {
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.points).toBe(10);
    }
  });

  it('Vượt Chướng Ngại Vật has valid keyword and clues', () => {
    expect(OLYMPIA_OBSTACLE.keyword).toBe('VIỆT NAM');
    expect(OLYMPIA_OBSTACLE.rows.length).toBe(4);
    for (const row of OLYMPIA_OBSTACLE.rows) {
      expect(row.options.length).toBe(4);
      expect(row.correctIndex).toBeGreaterThanOrEqual(0);
      expect(row.correctIndex).toBeLessThan(4);
      expect(row.answer.length).toBeGreaterThan(0);
    }
  });

  it('Tăng Tốc round contains 4 speed questions', () => {
    expect(OLYMPIA_TANG_TOC.length).toBe(4);
    for (const q of OLYMPIA_TANG_TOC) {
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it('Về Đích packages contain 20pt and 30pt questions', () => {
    expect(OLYMPIA_VE_DICH.length).toBeGreaterThanOrEqual(4);

    for (const q of OLYMPIA_VE_DICH) {
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect([20, 30]).toContain(q.points);
    }
  });
});
