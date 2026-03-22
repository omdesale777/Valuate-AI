"use client";

import { useState, useEffect } from "react";
import { Menu, X, Wallet, Zap } from "lucide-react";
import { cn } from "@/lib/formatters";

const navLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Valuations", href: "#live-feed" },
  { label: "Insights", href: "#neighborhood" },
  { label: "Brokers", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 transition-all duration-300",
          scrolled
            ? "bg-[#111111]/90 backdrop-blur-xl border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 mr-8">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="14" width="5" height="12" rx="1" fill="#3b82f6" />
            <rect x="9" y="8" width="5" height="18" rx="1" fill="#3b82f6" opacity="0.8" />
            <rect x="16" y="4" width="5" height="22" rx="1" fill="#3b82f6" opacity="0.6" />
            <path d="M2 18 L7 12 L13 15 L20 6 L26 10" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-base tracking-tight">ValuateAI</span>
            <span className="text-[9px] text-[var(--text-muted)] tracking-wider">by TachyonByte</span>
          </div>
        </a>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-6 flex-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-geist-mono text-emerald-400 font-bold tracking-wider">LIVE</span>
          </div>

          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-accent)] transition-all">
            <Wallet className="w-3.5 h-3.5" />
            <span>Connect</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[var(--text-secondary)] hover:text-white transition-colors ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16 bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg text-[var(--text-secondary)] hover:text-white py-2 border-b border-[var(--border-subtle)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-4">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-mono">Live data feed active</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}