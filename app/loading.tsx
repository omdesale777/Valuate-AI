export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-white font-bold text-lg">ValuateAI</span>
        <span className="text-xs text-[var(--text-muted)] font-geist-mono">Loading platform...</span>
      </div>
    </div>
  );
}