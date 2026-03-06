/**
 * XP and scoring calculations for lessons and quizzes.
 */

export const XP_PER_CORRECT = 3;
export const XP_BONUS_PERFECT = 10;
export const XP_STREAK_BONUS = 5;

export function calculateLessonXP(
  correct: number,
  total: number,
  baseReward: number
): number {
  const accuracy = total > 0 ? correct / total : 0;
  const isPerfect = accuracy === 1;

  return baseReward + (isPerfect ? XP_BONUS_PERFECT : 0);
}

export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calculateHistoryQuizXP(
  correct: number,
  total: number,
  baseReward: number
): number {
  const ratio = total > 0 ? correct / total : 0;
  return Math.round(baseReward * ratio);
}
