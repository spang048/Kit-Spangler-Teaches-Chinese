"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <p className="text-4xl">😕</p>
      <h2 className="font-bold text-gray-800">Something went wrong</h2>
      <p className="text-sm text-gray-500">{error.message ?? "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform"
        style={{ background: "#C8102E" }}
      >
        Try again
      </button>
    </div>
  );
}
