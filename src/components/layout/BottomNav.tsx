"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/learn", label: "学习", icon: "📖", activeIcon: "📖" },
  { href: "/history", label: "历史", icon: "🏯", activeIcon: "🏯" },
  { href: "/dashboard", label: "主页", icon: "🏠", activeIcon: "🏠" },
  { href: "/achievements", label: "成就", icon: "🏅", activeIcon: "🏅" },
  { href: "/profile", label: "我", icon: "👤", activeIcon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 gap-0.5 text-center transition-colors",
                isActive ? "text-brand-red" : "text-gray-400"
              )}
              style={{ color: isActive ? "#C8102E" : "#9CA3AF" }}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span
                className={cn(
                  "text-[10px] leading-none font-medium chinese",
                  isActive ? "font-bold" : ""
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
