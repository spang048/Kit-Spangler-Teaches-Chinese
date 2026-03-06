"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUnitsForLevel } from "@/lib/lesson-engine/dataAccess";
import { useProgress } from "@/hooks/useProgress";

export default function HskLevelPage() {
  const params = useParams();
  const router = useRouter();
  const hskLevel = Number(params.hskLevel);
  const units = getAllUnitsForLevel(hskLevel);
  const { completedIds, loading } = useProgress(hskLevel);

  if (!units.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <p className="text-4xl">🔒</p>
        <p className="text-gray-500 text-center">
          HSK {hskLevel} content is coming soon. Complete previous levels first!
        </p>
        <button onClick={() => router.back()} className="text-sm text-red-600 font-semibold">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <button onClick={() => router.back()} className="text-sm text-gray-400 mb-4 block">
        ← HSK Levels
      </button>
      <h1 className="text-xl font-bold text-gray-800 mb-1">HSK {hskLevel}</h1>
      <p className="text-sm text-gray-500 mb-6">{units.length} units</p>

      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {units.map((unit, ui) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter((l) => completedIds.has(l.id)).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const complete = done === total;

          // Unit is unlocked if it's the first, or all lessons of the previous unit are done
          const prevUnit = ui > 0 ? units[ui - 1] : null;
          const unlocked =
            ui === 0 ||
            (prevUnit?.lessons.every((l) => completedIds.has(l.id)) ?? false);

          return (
            <Link
              key={unit.id}
              href={unlocked ? `/learn/${hskLevel}/${unit.id}` : "#"}
              aria-disabled={!unlocked}
              className={`block rounded-3xl border-2 p-5 transition-all ${
                unlocked
                  ? "border-gray-200 bg-white shadow-sm"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-800">Unit {unit.unit_index}: {unit.title}</p>
                  <p className="chinese text-sm text-gray-500">{unit.title_zh}</p>
                </div>
                {!loading && !unlocked && <span className="text-xl">🔒</span>}
                {complete && <span className="text-xl">✅</span>}
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{unit.kit_intro}</p>

              <div>
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
