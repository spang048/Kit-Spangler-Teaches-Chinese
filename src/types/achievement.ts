export type AchievementTriggerType =
  | "lesson_count"
  | "streak_days"
  | "hsk_level_complete"
  | "history_count"
  | "perfect_score"
  | "total_xp";

export interface AchievementTrigger {
  type: AchievementTriggerType;
  threshold: number;
}

export interface Achievement {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  seal_label: string; // Single Chinese character displayed in the stamp
  xp_bonus: number;
  trigger: AchievementTrigger;
}

export interface AchievementsFile {
  achievements: Achievement[];
}

export interface EarnedAchievement extends Achievement {
  earned: boolean;
  unlocked_at?: string;
}
