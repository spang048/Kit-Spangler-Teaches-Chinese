"use client";

interface Props {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: Props) {
  const isActive = currentStreak > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <span className="text-3xl" style={{ filter: isActive ? "none" : "grayscale(1)" }}>
          🔥
        </span>
        <span
          className="text-3xl font-bold"
          style={{ color: isActive ? "#D4AF37" : "#9CA3AF" }}
        >
          {currentStreak}
        </span>
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Day streak</p>
      {longestStreak > 0 && (
        <p className="text-xs text-gray-400">Best: {longestStreak}</p>
      )}
    </div>
  );
}
