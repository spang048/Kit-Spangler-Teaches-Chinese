"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUnitsForLevel, getUnlockedLessonIds } from "@/lib/lesson-engine/dataAccess";
import { useProgress } from "@/hooks/useProgress";

export default function UnitPage() {
  const params = useParams();
  const router = useRouter();
  const hskLevel = Number(params.hskLevel);
  const unitId = params.unitId as string;
  const { completedIds, loading } = useProgress(hskLevel);

  const units = getAllUnitsForLevel(hskLevel);
  const unit = units.find((u) => u.id === unitId);

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <p className="text-gray-500">Unit not found.</p>
        <button onClick={() => router.back()} className="text-sm text-red-600 font-semibold">
          ← Back
        </button>
      </div>
    );
  }

  const unlockedIds = getUnlockedLessonIds(hskLevel, completedIds);

  return (
    <div className="px-4 py-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-4 block"
      >
        ← Unit list
      </button>

      <h1 className="text-xl font-bold text-gray-800">
        Unit {unit.unit_index}: {unit.title}
      </h1>
      <p className="chinese text-sm text-gray-500 mb-2">{unit.title_zh}</p>

      {/* Kit's intro */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-red-600 mb-1">司凯德 says:</p>
        <p className="text-sm text-gray-700 italic">&ldquo;{unit.kit_intro}&rdquo;</p>
      </div>

      {/* Lessons */}
      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {unit.lessons.map((lesson, li) => {
          const isDone = completedIds.has(lesson.id);
          const isUnlocked = unlockedIds.has(lesson.id);

          return (
            <Link
              key={lesson.id}
              href={isUnlocked ? `/learn/${hskLevel}/${unitId}/${lesson.id}` : "#"}
              aria-disabled={!isUnlocked}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                isDone
                  ? "border-green-200 bg-green-50"
                  : isUnlocked
                  ? "border-gray-200 bg-white shadow-sm"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
            >
              {/* Lesson number / status */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: isDone ? "#22c55e" : isUnlocked ? "#C8102E" : "#E5E7EB",
                  color: isDone || isUnlocked ? "white" : "#9CA3AF",
                }}
              >
                {isDone ? "✓" : li + 1}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{lesson.title}</p>
                <p className="chinese text-xs text-gray-500">{lesson.title_zh}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {lesson.estimated_minutes} min · {lesson.xp_reward} XP
                </p>
              </div>

              {!loading && !isUnlocked && !isDone && (
                <span className="text-gray-300 text-lg">🔒</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
