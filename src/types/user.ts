export interface Profile {
  id: string;
  display_name: string;
  daily_goal_min: 5 | 10 | 15 | 20;
  starting_hsk: number;
  current_hsk: number;
  total_xp: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null; // ISO date string YYYY-MM-DD
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  hsk_level: number;
  unit_index: number;
  lesson_index: number;
  completed: boolean;
  score: number | null; // 0-100
  xp_earned: number;
  completed_at: string | null;
  created_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  activity_date: string; // YYYY-MM-DD
  minutes_studied: number;
  xp_earned: number;
  goal_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HistoryProgress {
  id: string;
  user_id: string;
  topic_id: string;
  article_read: boolean;
  quiz_completed: boolean;
  quiz_score: number | null;
  xp_earned: number;
  completed_at: string | null;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  source_type: "lesson_complete" | "quiz_complete" | "streak_bonus" | "daily_goal";
  source_id: string | null;
  created_at: string;
}
