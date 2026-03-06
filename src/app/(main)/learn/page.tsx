"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { SealStamp } from "@/components/ui/SealStamp";
import { isHskLevelComplete, getAllUnitsForLevel } from "@/lib/lesson-engine/dataAccess";

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];

const LEVEL_LABELS: Record<number, { zh: string; desc: string }> = {
  1: { zh: "入门", desc: "Beginner — 150 words" },
  2: { zh: "基础", desc: "Elementary — 300 words" },
  3: { zh: "初级", desc: "Pre-intermediate — 600 words" },
  4: { zh: "中级", desc: "Intermediate — 1,200 words" },
  5: { zh: "高级", desc: "Advanced — 2,500 words" },
  6: { zh: "精通", desc: "Mastery — 5,000+ words" },
};

export default function LearnPage() {
  const { completedIds, loading } = useProgress();

  function isUnlocked(level: number) {
    if (level === 1) return true;
    return isHskLevelComplete(level - 1, completedIds);
  }

  function getLevelProgress(level: number): { done: number; total: number } {
    if (level !== 1) return { done: 0, total: 0 };
    const units = getAllUnitsForLevel(level);
    const total = units.reduce((sum, u) => sum + u.lessons.length, 0);
    const done = units.reduce(
      (sum, u) => sum + u.lessons.filter((l) => completedIds.has(l.id)).length,
      0
    );
    return { done, total };
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">HSK Levels</h1>
      <p className="text-sm text-gray-500 mb-6">
        Master each level to advance — just like Kit did!
      </p>

      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {HSK_LEVELS.map((level) => {
          const unlocked = isUnlocked(level);
          const { done, total } = getLevelProgress(level);
          const complete = total > 0 && done === total;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const label = LEVEL_LABELS[level];

          return (
            <Link
              key={level}
              href={unlocked ? `/learn/${level}` : "#"}
              aria-disabled={!unlocked}
              className={`block rounded-3xl border-2 p-5 transition-all ${
                unlocked
                  ? "border-gray-200 bg-white shadow-sm"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-4">
                <SealStamp label={`${level}`} earned={complete} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-800">
                      HSK {level}
                    </span>
                    <span className="chinese text-sm text-gray-500">
                      {label.zh}
                    </span>
                    {!loading && !unlocked && (
                      <span className="ml-auto text-lg">🔒</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{label.desc}</p>

                  {unlocked && total > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{done} / {total} lessons</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: complete ? "#D4AF37" : "#C8102E",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {unlocked && total === 0 && (
                    <p className="text-xs text-gray-400 mt-1 italic">Coming soon</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 italic">
        司凯德 started with 你好 — so can you!
      </p>
    </div>
  );
}
