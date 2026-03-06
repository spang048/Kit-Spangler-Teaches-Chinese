"use client";

import { StreakDisplay } from "@/components/ui/StreakDisplay";
import { ProgressRing } from "@/components/ui/ProgressRing";

interface TopBarProps {
  streak?: number;
  xp?: number;
  dailyProgress?: number; // 0-100
}

export function TopBar({ streak = 0, xp = 0, dailyProgress = 0 }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-2"
      style={{ paddingTop: "env(safe-area-inset-top, 8px)" }}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* App name */}
        <span className="chinese text-lg font-bold" style={{ color: "#C8102E" }}>
          司凯德教中文
        </span>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          {/* XP */}
          <div className="flex items-center gap-1">
            <span className="text-base">⭐</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "#D4AF37" }}>
              {xp.toLocaleString()}
            </span>
          </div>

          {/* Streak */}
          <StreakDisplay streak={streak} size="sm" />

          {/* Daily goal ring */}
          <ProgressRing percentage={dailyProgress} size={32} strokeWidth={4}>
            <span className="text-[8px] font-bold" style={{ color: "#C8102E" }}>
              {Math.round(dailyProgress)}%
            </span>
          </ProgressRing>
        </div>
      </div>
    </header>
  );
}
