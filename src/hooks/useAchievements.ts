"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAllAchievements, mergeWithEarned } from "@/lib/achievements/dataAccess";
import type { EarnedAchievement } from "@/types/achievement";

export function useAchievements() {
  const [achievements, setAchievements] = useState<EarnedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setAchievements(mergeWithEarned(getAllAchievements(), new Set(), new Map()));
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", user.id);

      const earnedIds = new Set((data ?? []).map((r) => r.achievement_id as string));
      const earnedDates = new Map((data ?? []).map((r) => [r.achievement_id as string, r.unlocked_at as string]));

      setAchievements(mergeWithEarned(getAllAchievements(), earnedIds, earnedDates));
      setLoading(false);
    });
  }, []);

  return { achievements, loading };
}
