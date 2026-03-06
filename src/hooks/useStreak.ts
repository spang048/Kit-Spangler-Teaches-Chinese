"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Streak } from "@/types/user";

export function useStreak() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          setStreak(data);
          setLoading(false);
        });
    });
  }, []);

  return { streak, loading };
}
