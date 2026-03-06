"use client";

import Link from "next/link";
import Image from "next/image";
import { KitAvatar } from "@/components/ui/KitAvatar";
import { SealStamp } from "@/components/ui/SealStamp";
import { DailyGoalRing } from "@/components/dashboard/DailyGoalRing";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { useDailyGoal } from "@/hooks/useDailyGoal";
import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";

const KIT_MESSAGES = [
  "你好！Ready to learn today? Every character you master opens a new door to understanding China.",
  "I visited China 78 times — and every trip started with a single word. What will yours be today?",
  "The Chinese say 万事起头难 — every beginning is hard. But you've already begun!",
  "学而时习之，不亦说乎 — To learn and then practice — is that not a joy?",
  "In 1990 I first set foot in China with just a handful of words. You're already ahead of where I started!",
];

function getTodayMessage(name: string | null) {
  const day = new Date().getDay();
  const msg = KIT_MESSAGES[day % KIT_MESSAGES.length];
  return name ? msg : msg;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { minutesStudied, goalMinutes, goalComplete } = useDailyGoal();
  const { streak } = useStreak();

  const displayName = user?.user_metadata?.display_name ?? null;
  const greeting = displayName ? `${displayName}, ` : "";

  return (
    <div className="px-4 py-6">
      {/* Perspective 180 branding */}
      <div className="flex justify-center mb-5">
        <Image
          src="/images/perspective180-logo.png"
          alt="Perspective 180"
          width={200}
          height={67}
          className="object-contain"
          priority
        />
      </div>

      {/* Kit greeting */}
      <KitAvatar
        mood={goalComplete ? "celebrating" : "encouraging"}
        message={getTodayMessage(displayName)}
        className="mb-6"
      />

      {/* Stats row */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4 flex items-center justify-around">
        <DailyGoalRing
          minutesStudied={minutesStudied}
          goalMinutes={goalMinutes}
          goalComplete={goalComplete}
        />
        <div className="w-px h-16 bg-gray-100" />
        <StreakCard
          currentStreak={streak?.current_streak ?? 0}
          longestStreak={streak?.longest_streak ?? 0}
        />
        <div className="w-px h-16 bg-gray-100" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-bold text-gray-800">
            {/* XP from TopBar — just show a prompt */}
            🎯
          </span>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Keep going!
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/learn"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-start gap-2 active:scale-95 transition-transform"
        >
          <span className="text-2xl">📖</span>
          <span className="font-semibold text-gray-800 text-sm">Continue Learning</span>
          <span className="text-xs text-gray-500 chinese">继续学习</span>
        </Link>

        <Link
          href="/history"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-start gap-2 active:scale-95 transition-transform"
        >
          <span className="text-2xl">🏯</span>
          <span className="font-semibold text-gray-800 text-sm">History & Culture</span>
          <span className="text-xs text-gray-500 chinese">历史文化</span>
        </Link>
      </div>

      {/* Achievement teaser */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
        <SealStamp label="始" size="sm" earned={false} />
        <div>
          <p className="text-sm font-semibold text-gray-800">Complete your first lesson</p>
          <p className="text-xs text-gray-500">to earn your first seal stamp 🏮</p>
        </div>
        <Link
          href="/achievements"
          className="ml-auto text-xs text-red-600 font-semibold shrink-0"
        >
          View all →
        </Link>
      </div>

      {greeting && (
        <p className="text-center text-xs text-gray-400 mt-6">
          Logged in as {greeting.replace(", ", "")}
        </p>
      )}
    </div>
  );
}
