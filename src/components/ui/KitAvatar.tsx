import { cn } from "@/lib/utils/cn";

type Mood = "neutral" | "encouraging" | "celebrating";

interface KitAvatarProps {
  message?: string;
  mood?: Mood;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const moodEmoji: Record<Mood, string> = {
  neutral: "🧑‍🏫",
  encouraging: "💪",
  celebrating: "🎉",
};

export function KitAvatar({
  message,
  mood = "neutral",
  size = "md",
  className,
}: KitAvatarProps) {
  const avatarSizes = { sm: "w-10 h-10 text-xl", md: "w-14 h-14 text-3xl", lg: "w-20 h-20 text-4xl" };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {/* Avatar circle */}
      <div
        className={cn(
          "rounded-full bg-red-50 border-2 border-brand-red flex items-center justify-center flex-shrink-0",
          avatarSizes[size]
        )}
        style={{ borderColor: "#C8102E" }}
      >
        <span>{moodEmoji[mood]}</span>
      </div>

      {/* Speech bubble */}
      {message && (
        <div className="relative bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
          {/* Name tag */}
          <p className="text-xs font-semibold mb-1" style={{ color: "#C8102E" }}>
            司凯德 · Kit
          </p>
          <p className="text-sm text-gray-700 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
}
