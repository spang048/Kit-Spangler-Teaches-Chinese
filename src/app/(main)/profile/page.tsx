"use client";

import { useEffect, useState } from "react";
import { KitAvatar } from "@/components/ui/KitAvatar";
import { useStreak } from "@/hooks/useStreak";
import { createClient } from "@/lib/supabase/client";

interface ProfileStats {
  displayName: string;
  totalXp: number;
  lessonsCompleted: number;
  hskLevel: number;
}

export default function ProfilePage() {
  const { streak } = useStreak();
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const [{ data: profile }, { data: lessonRows }] = await Promise.all([
        supabase.from("profiles").select("display_name, total_xp, current_hsk").eq("id", user.id).single(),
        supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true),
      ]);

      setStats({
        displayName: profile?.display_name ?? "Learner",
        totalXp: profile?.total_xp ?? 0,
        lessonsCompleted: lessonRows?.length ?? 0,
        hskLevel: profile?.current_hsk ?? 1,
      });
    });
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">My Profile</h1>
      <p className="chinese text-sm text-gray-500 mb-6">我的档案</p>

      {/* User name */}
      {stats && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
            style={{ background: "#FEF2F2" }}>
            🧑‍🎓
          </div>
          <p className="font-bold text-gray-800 text-lg">{stats.displayName}</p>
          <p className="text-sm text-gray-500">HSK {stats.hskLevel} learner</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total XP", value: stats?.totalXp ?? "—", icon: "⭐" },
          { label: "Streak", value: streak ? `${streak.current_streak}d` : "—", icon: "🔥" },
          { label: "Lessons", value: stats?.lessonsCompleted ?? "—", icon: "📖" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className="font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kit's note */}
      <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
        <h2 className="font-bold text-gray-800 mb-3">About Your Teacher</h2>
        <KitAvatar
          mood="neutral"
          message="I've visited China 78 times since 1990. My belief: you cannot truly understand a language without understanding its history and culture. That's why this app teaches both."
        />
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          Kit Spangler (司凯德) holds an M.A. in Asian Civilizations from the University of Iowa.
          A former dairy farmer turned China expert, he served as China Business Director at Cargill
          and has spent decades building bridges between East and West.
          This app is his gift — 视角180 — a perspective shift through language.
        </p>
      </div>
    </div>
  );
}
