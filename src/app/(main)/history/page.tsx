"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistoryIndex } from "@/lib/history/dataAccess";
import { createClient } from "@/lib/supabase/client";
import type { HistoryTopicSummary } from "@/types/history";

const CATEGORY_COLORS: Record<string, string> = {
  history: "bg-amber-50 border-amber-200 text-amber-700",
  culture: "bg-emerald-50 border-emerald-200 text-emerald-700",
  politics: "bg-blue-50 border-blue-200 text-blue-700",
};

export default function HistoryPage() {
  const index = getHistoryIndex();
  const topics: HistoryTopicSummary[] = index.topics;

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("history_progress")
        .select("topic_id")
        .eq("user_id", user.id)
        .eq("quiz_completed", true)
        .then(({ data }) => {
          if (data) setCompletedIds(new Set(data.map((r) => r.topic_id)));
        });
    });
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">History & Culture</h1>
      <p className="text-sm text-gray-500 mb-6">
        78 trips, one perspective — told through 司凯德&apos;s eyes
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {topics.map((topic) => {
          const done = completedIds.has(topic.id);
          const catClass = CATEGORY_COLORS[topic.category] ?? "bg-gray-50 border-gray-200 text-gray-600";

          return (
            <Link
              key={topic.id}
              href={`/history/${topic.id}`}
              className={`rounded-3xl border-2 p-4 flex flex-col gap-2 transition-all active:scale-95 ${
                done ? "border-green-200 bg-green-50" : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{topic.thumbnail_emoji}</span>
                {done && <span className="text-green-500 text-sm">✓</span>}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{topic.title}</p>
                <p className="chinese text-xs text-gray-500 mt-0.5">{topic.title_zh}</p>
              </div>
              <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full border ${catClass}`}>
                {topic.category}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
