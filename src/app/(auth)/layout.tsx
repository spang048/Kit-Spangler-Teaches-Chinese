export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #C8102E 0%, #8B0C1F 100%)" }}
    >
      {/* App title */}
      <div className="text-center mb-8">
        <h1 className="chinese text-4xl font-bold text-white mb-1">司凯德教中文</h1>
        <p className="text-red-200 text-sm">Kit Spangler Teaches Chinese</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {children}
      </div>

      {/* Decorative seal */}
      <div className="mt-8 opacity-20">
        <div
          className="chinese text-white text-5xl font-bold border-4 border-white rounded-lg px-3 py-1"
          style={{ transform: "rotate(-8deg)" }}
        >
          视角180
        </div>
      </div>
    </div>
  );
}
