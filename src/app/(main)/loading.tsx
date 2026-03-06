export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin"
          style={{ borderTopColor: "#C8102E" }}
        />
        <p className="chinese text-sm text-gray-400">加载中…</p>
      </div>
    </div>
  );
}
