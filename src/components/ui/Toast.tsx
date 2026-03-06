"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ToastMessage {
  id: string;
  message: string;
  type: "xp" | "streak" | "achievement" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage["type"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const iconMap: Record<ToastMessage["type"], string> = {
    xp: "⭐",
    streak: "🔥",
    achievement: "印",
    info: "ℹ️",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        toast.type === "xp" && "bg-yellow-500",
        toast.type === "streak" && "bg-orange-500",
        toast.type === "achievement" && "bg-red-600",
        toast.type === "info" && "bg-gray-700"
      )}
    >
      <span>{iconMap[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}
