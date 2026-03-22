export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="14" width="5" height="12" rx="1" fill="#3b82f6" />
                <rect x="9" y="8" width="5" height="18" rx="1" fill="#3b82f6" opacity="0.8" />
                <rect x="16" y="4" width="5" height="22" rx="1" fill="#3b82f6" opacity="0.6" />
                <path d="M2 18 L7 12 L13 15 L20 6 L26 10" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-white">ValuateAI</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              AI-powered property intelligence for India's industrial corridors.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              © 2025 ValuateAI by TachyonByte Technologies
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Platform</p>
              {["Dashboard", "Valuations", "Insights", "API Docs"].map((l) => (
                <a key={l} href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Company</p>
              {["About", "Careers", "Privacy Policy", "Terms of Service"].map((l) => (
                <a key={l} href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Tech + disclaimer */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Powered By</p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "MongoDB", "Gemini AI", "OpenStreetMap"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
              Valuations are AI-generated estimates. Not financial advice.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-[var(--text-muted)]">Built with ♥ in India 🇮🇳</span>
          <span className="text-xs text-[var(--text-muted)]">v1.0.0 — Industrial Intelligence Platform</span>
        </div>
      </div>
    </footer>
  );
}