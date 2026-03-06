"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface DailyGoalState {
  minutesStudied: number;
  goalMinutes: number;
  goalComplete: boolean;
}

export function useDailyGoal(): DailyGoalState & { loading: boolean } {
  const [state, setState] = useState<DailyGoalState>({
    minutesStudied: 0,
    goalMinutes: 10,
    goalComplete: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      const [{ data: profile }, { data: activity }] = await Promise.all([
        supabase.from("profiles").select("daily_goal_min").eq("id", user.id).single(),
        supabase
          .from("daily_activity")
          .select("minutes_studied, goal_completed")
          .eq("user_id", user.id)
          .eq("activity_date", today)
          .single(),
      ]);

      setState({
        minutesStudied: activity?.minutes_studied ?? 0,
        goalMinutes: profile?.daily_goal_min ?? 10,
        goalComplete: activity?.goal_completed ?? false,
      });
      setLoading(false);
    });
  }, []);

  return { ...state, loading };
}
