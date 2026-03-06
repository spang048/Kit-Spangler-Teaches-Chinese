"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/Toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="bg-gray-50 min-h-screen">
        <TopBar />
        {children}
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
