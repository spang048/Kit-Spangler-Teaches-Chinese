import { cn } from "@/lib/utils/cn";

interface StreakDisplayProps {
  streak: number;
  size?: "sm" | "md";
  className?: string;
}

export function StreakDisplay({ streak, size = "md", className }: StreakDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className={size === "sm" ? "text-lg" : "text-2xl"}>🔥</span>
      <span
        className={cn(
          "font-bold tabular-nums",
          size === "sm" ? "text-sm" : "text-lg"
        )}
        style={{ color: streak > 0 ? "#D4AF37" : "#9CA3AF" }}
      >
        {streak}
      </span>
    </div>
  );
}
