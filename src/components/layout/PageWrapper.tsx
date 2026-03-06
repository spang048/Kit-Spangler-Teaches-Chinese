import { cn } from "@/lib/utils/cn";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageWrapper({ children, className, noPadding = false }: PageWrapperProps) {
  return (
    <main
      className={cn(
        "max-w-lg mx-auto w-full min-h-screen",
        !noPadding && "px-4 py-6",
        // Leave room for bottom nav (64px) and top bar (56px)
        "pb-24",
        className
      )}
    >
      {children}
    </main>
  );
}
