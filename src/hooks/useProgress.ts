"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LessonProgress } from "@/types/user";

export function useProgress(hskLevel?: number) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      let query = supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (hskLevel) {
        query = query.like("lesson_id", `hsk${hskLevel}-%`);
      }

      const { data } = await query;
      setProgress(data ?? []);
      setLoading(false);
    }

    load();
  }, [hskLevel]);

  const completedIds = new Set(progress.map((p) => p.lesson_id));

  return { progress, completedIds, loading };
}
