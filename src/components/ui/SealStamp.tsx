"use client";

import { cn } from "@/lib/utils/cn";

interface SealStampProps {
  label: string;
  size?: "sm" | "md" | "lg";
  earned?: boolean;
  animate?: boolean;
  className?: string;
}

const sizes = {
  sm: { outer: 56, inner: 44, fontSize: 18, border: 3 },
  md: { outer: 80, inner: 64, fontSize: 26, border: 4 },
  lg: { outer: 112, inner: 90, fontSize: 36, border: 5 },
};

export function SealStamp({
  label,
  size = "md",
  earned = true,
  animate = false,
  className,
}: SealStampProps) {
  const dim = sizes[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        animate && "stamp-reveal",
        className
      )}
      style={{ width: dim.outer, height: dim.outer }}
    >
      {/* Outer ring */}
      <svg
        width={dim.outer}
        height={dim.outer}
        viewBox={`0 0 ${dim.outer} ${dim.outer}`}
        className="absolute inset-0"
      >
        <rect
          x={dim.border}
          y={dim.border}
          width={dim.outer - dim.border * 2}
          height={dim.outer - dim.border * 2}
          rx={4}
          ry={4}
          fill="none"
          stroke={earned ? "#C8102E" : "#D1D5DB"}
          strokeWidth={dim.border}
          opacity={earned ? 0.9 : 0.4}
        />
        {/* Inner ring */}
        <rect
          x={dim.border + 4}
          y={dim.border + 4}
          width={dim.outer - (dim.border + 4) * 2}
          height={dim.outer - (dim.border + 4) * 2}
          rx={2}
          ry={2}
          fill="none"
          stroke={earned ? "#C8102E" : "#D1D5DB"}
          strokeWidth={1}
          opacity={earned ? 0.6 : 0.3}
        />
      </svg>

      {/* Label */}
      <span
        className={cn("chinese relative z-10 font-bold leading-none")}
        style={{
          fontSize: dim.fontSize,
          color: earned ? "#C8102E" : "#D1D5DB",
          opacity: earned ? 0.9 : 0.4,
          textShadow: earned ? "0 0 1px rgba(200,16,46,0.2)" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
}
