import { describe, it, expect } from 'vitest';
import {
  LEVEL_TIERS,
  getLevelMeta,
  calculateLevel,
  getLevelProgress,
} from './xpSystem';

describe('xpSystem', () => {
  it('should have monotonic tiers starting at level 1', () => {
    expect(LEVEL_TIERS.length).toBeGreaterThan(0);
    expect(LEVEL_TIERS[0].level).toBe(1);
    expect(LEVEL_TIERS[0].minXP).toBe(0);

    for (let i = 1; i < LEVEL_TIERS.length; i++) {
      expect(LEVEL_TIERS[i].level).toBe(LEVEL_TIERS[i - 1].level + 1);
      expect(LEVEL_TIERS[i].minXP).toBe(LEVEL_TIERS[i - 1].maxXP + 1);
    }
  });

  describe('getLevelMeta and calculateLevel', () => {
    it('returns Level 1 (Tập sự) for 0 XP', () => {
      const meta = getLevelMeta(0);
      expect(meta.level).toBe(1);
      expect(meta.title).toBe('Tập sự');
      expect(calculateLevel(0)).toBe(1);
    });

    it('returns Level 2 (Học giả) for 150 XP', () => {
      const meta = getLevelMeta(150);
      expect(meta.level).toBe(2);
      expect(meta.title).toBe('Học giả');
      expect(calculateLevel(150)).toBe(2);
    });

    it('returns Level 4 (Dũng sĩ Olympia) for 750 XP', () => {
      const meta = getLevelMeta(750);
      expect(meta.level).toBe(4);
      expect(meta.title).toBe('Dũng sĩ Olympia');
      expect(calculateLevel(750)).toBe(4);
    });

    it('returns highest tier for extreme XP', () => {
      const meta = getLevelMeta(50000);
      expect(meta.level).toBe(8);
      expect(meta.title).toBe('Đỉnh Olympus');
      expect(calculateLevel(50000)).toBe(8);
    });
  });

  describe('getLevelProgress', () => {
    it('calculates progress at tier start correctly', () => {
      const progress = getLevelProgress(0);
      expect(progress.currentLevel).toBe(1);
      expect(progress.nextLevel).toBe(2);
      expect(progress.currentXP).toBe(0);
      expect(progress.percentage).toBe(0);
      expect(progress.xpNeeded).toBe(100);
      expect(progress.title).toBe('Tập sự');
    });

    it('calculates percentage correctly mid-tier', () => {
      const progress = getLevelProgress(50);
      expect(progress.currentLevel).toBe(1);
      expect(progress.percentage).toBe(50);
      expect(progress.xpNeeded).toBe(50);
    });

    it('caps percentage at 100% when at or near maxXP', () => {
      const progress = getLevelProgress(100);
      expect(progress.currentLevel).toBe(1);
      expect(progress.percentage).toBe(100);
      expect(progress.xpNeeded).toBe(0);
    });
  });
});
