/**
 * Determines streak state given current streak data and today's UTC date.
 *
 * Rules:
 *   - last_activity_date === today  → already credited, no change
 *   - last_activity_date === yesterday → increment streak
 *   - last_activity_date older or null → reset to 1
 */

export function getTodayUTC(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

export type StreakUpdateResult =
  | { action: "no_change"; current_streak: number }
  | { action: "increment"; new_streak: number; longest: number }
  | { action: "reset"; new_streak: 1 };

export function computeStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null
): StreakUpdateResult {
  const today = getTodayUTC();
  const yesterday = getYesterdayUTC();

  if (lastActivityDate === today) {
    return { action: "no_change", current_streak: currentStreak };
  }

  if (lastActivityDate === yesterday) {
    const newStreak = currentStreak + 1;
    return {
      action: "increment",
      new_streak: newStreak,
      longest: Math.max(longestStreak, newStreak),
    };
  }

  // Missed a day or first time
  return { action: "reset", new_streak: 1 };
}

export function isDailyGoalComplete(
  minutesStudied: number,
  goalMinutes: number
): boolean {
  return minutesStudied >= goalMinutes;
}
