"use client";

import { useEffect } from "react";
import { SealStamp } from "@/components/ui/SealStamp";
import { useSound } from "@/hooks/useSound";

interface Props {
  score: number;         // 0–100
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  onContinue: () => void;
}

export function LessonComplete({ score, xpEarned, correctCount, totalCount, onContinue }: Props) {
  const { play } = useSound();

  useEffect(() => {
    play("lessonComplete");
  }, [play]);

  const isPerfect = score === 100;
  const label = isPerfect ? "完" : score >= 70 ? "好" : "加";

  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-10 text-center">
      {/* Seal stamp with animation */}
      <div className="animate-stamp-reveal">
        <SealStamp label={label} earned size="lg" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isPerfect ? "Perfect lesson!" : score >= 70 ? "Great work!" : "Keep going!"}
        </h2>
        <p className="text-gray-500 mt-1">
          {correctCount} of {totalCount} correct
        </p>
      </div>

      {/* XP badge */}
      <div className="flex items-center gap-2 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-6 py-3">
        <span className="text-2xl">⭐</span>
        <div className="text-left">
          <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">XP Earned</p>
          <p className="text-3xl font-bold text-yellow-700">+{xpEarned}</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Score</span>
          <span>{score}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              background: score === 100 ? "#D4AF37" : score >= 70 ? "#22c55e" : "#C8102E",
            }}
          />
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform"
        style={{ background: "#C8102E" }}
      >
        Continue →
      </button>
    </div>
  );
}
