export interface LevelMeta {
  level: number;
  minXP: number;
  maxXP: number;
  title: string;
  badgeColor: string;
  badgeBg: string;
}

export const LEVEL_TIERS: LevelMeta[] = [
  { level: 1, minXP: 0, maxXP: 100, title: 'Tập sự', badgeColor: 'text-slate-600', badgeBg: 'bg-slate-100' },
  { level: 2, minXP: 101, maxXP: 250, title: 'Học giả', badgeColor: 'text-blue-600', badgeBg: 'bg-blue-100' },
  { level: 3, minXP: 251, maxXP: 500, title: 'Chiến binh tri thức', badgeColor: 'text-emerald-600', badgeBg: 'bg-emerald-100' },
  { level: 4, minXP: 501, maxXP: 900, title: 'Dũng sĩ Olympia', badgeColor: 'text-amber-600', badgeBg: 'bg-amber-100' },
  { level: 5, minXP: 901, maxXP: 1500, title: 'Bậc thầy', badgeColor: 'text-purple-600', badgeBg: 'bg-purple-100' },
  { level: 6, minXP: 1501, maxXP: 2300, title: 'Đại kiện tướng', badgeColor: 'text-rose-600', badgeBg: 'bg-rose-100' },
  { level: 7, minXP: 2301, maxXP: 3300, title: 'Huyền thoại', badgeColor: 'text-indigo-600', badgeBg: 'bg-indigo-100' },
  { level: 8, minXP: 3301, maxXP: 100000, title: 'Đỉnh Olympus', badgeColor: 'text-yellow-600', badgeBg: 'bg-yellow-100' },
];

export function getLevelMeta(xp: number): LevelMeta {
  const currentTier = LEVEL_TIERS.find((t) => xp >= t.minXP && xp <= t.maxXP);
  return currentTier || LEVEL_TIERS[LEVEL_TIERS.length - 1];
}

export function calculateLevel(xp: number): number {
  return getLevelMeta(xp).level;
}

export function getLevelProgress(xp: number): {
  currentLevel: number;
  nextLevel: number;
  currentXP: number;
  minXP: number;
  maxXP: number;
  percentage: number;
  xpNeeded: number;
  title: string;
} {
  const meta = getLevelMeta(xp);
  const currentLevel = meta.level;
  const nextLevel = Math.min(LEVEL_TIERS.length, currentLevel + 1);
  const span = meta.maxXP - meta.minXP;
  const currentInTier = Math.max(0, xp - meta.minXP);
  const percentage = Math.min(100, Math.round((currentInTier / span) * 100));
  const xpNeeded = Math.max(0, meta.maxXP - xp);

  return {
    currentLevel,
    nextLevel,
    currentXP: xp,
    minXP: meta.minXP,
    maxXP: meta.maxXP,
    percentage,
    xpNeeded,
    title: meta.title,
  };
}
