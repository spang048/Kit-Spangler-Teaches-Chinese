"use client";

import { SealStamp } from "@/components/ui/SealStamp";
import { useAchievements } from "@/hooks/useAchievements";

export default function AchievementsPage() {
  const { achievements, loading } = useAchievements();
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Seal Stamps</h1>
      <p className="text-sm text-gray-500 mb-1">
        印章 — your achievements in Chinese seal form
      </p>
      <p className="text-sm font-semibold mb-6" style={{ color: "#C8102E" }}>
        {earnedCount} / {achievements.length} earned
      </p>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${
                a.earned
                  ? "border-yellow-200 bg-yellow-50 shadow-sm"
                  : "border-gray-100 bg-white opacity-50"
              }`}
            >
              <SealStamp label={a.seal_label} size="md" earned={a.earned} />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-800 leading-snug">{a.title}</p>
                {a.earned && a.xp_bonus > 0 && (
                  <p className="text-xs text-yellow-600">+{a.xp_bonus} XP</p>
                )}
                {!a.earned && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{a.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-8 italic">
        司凯德 earned his first seal in 1990. Your turn!
      </p>
    </div>
  );
}
