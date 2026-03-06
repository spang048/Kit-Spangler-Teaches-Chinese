"use client";

import { ProgressRing } from "@/components/ui/ProgressRing";

interface Props {
  minutesStudied: number;
  goalMinutes: number;
  goalComplete: boolean;
}

export function DailyGoalRing({ minutesStudied, goalMinutes, goalComplete }: Props) {
  const pct = Math.min(100, Math.round((minutesStudied / goalMinutes) * 100));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ProgressRing
          percentage={pct}
          size={88}
          strokeWidth={8}
          color={goalComplete ? "#D4AF37" : "#C8102E"}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{minutesStudied}</span>
          <span className="text-xs text-gray-400">/ {goalMinutes} min</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {goalComplete ? "🎉 Goal done!" : "Daily goal"}
      </p>
    </div>
  );
}
