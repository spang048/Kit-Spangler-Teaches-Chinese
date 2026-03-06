import type { Achievement, AchievementsFile, EarnedAchievement } from "@/types/achievement";

export function getAllAchievements(): Achievement[] {
  const data: AchievementsFile = require("@/data/achievements/achievements.json");
  return data.achievements;
}

export function checkNewAchievements(params: {
  lessonCount: number;
  streakDays: number;
  completedHskLevels: number[];
  historyCount: number;
  hasPerfectScore: boolean;
  totalXp: number;
  alreadyEarned: Set<string>;
}): Achievement[] {
  const all = getAllAchievements();
  const newly: Achievement[] = [];

  for (const a of all) {
    if (params.alreadyEarned.has(a.id)) continue;

    let earned = false;
    switch (a.trigger.type) {
      case "lesson_count":
        earned = params.lessonCount >= a.trigger.threshold;
        break;
      case "streak_days":
        earned = params.streakDays >= a.trigger.threshold;
        break;
      case "hsk_level_complete":
        earned = params.completedHskLevels.includes(a.trigger.threshold);
        break;
      case "history_count":
        earned = params.historyCount >= a.trigger.threshold;
        break;
      case "perfect_score":
        earned = params.hasPerfectScore;
        break;
      case "total_xp":
        earned = params.totalXp >= a.trigger.threshold;
        break;
    }

    if (earned) newly.push(a);
  }

  return newly;
}

export function mergeWithEarned(
  all: Achievement[],
  earnedIds: Set<string>,
  earnedDates: Map<string, string>
): EarnedAchievement[] {
  return all.map((a) => ({
    ...a,
    earned: earnedIds.has(a.id),
    unlocked_at: earnedDates.get(a.id),
  }));
}
