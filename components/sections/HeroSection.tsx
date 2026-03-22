"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/index";

const stats = [
  { value: 2400, suffix: "+", label: "Properties Valued" },
  { value: 1240, prefix: "₹", suffix: " Cr", label: "Total Portfolio Assessed" },
  { value: 98.2, suffix: "%", label: "Valuation Accuracy", decimal: true },
];

function AnimatedCounter({ target, prefix = "", suffix = "", decimal = false }: {
  target: number; prefix?: string; suffix?: string; decimal?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = 2000;
    const start = performance.now();

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      el.textContent = prefix + (decimal ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, prefix, suffix, decimal]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-600/6 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-purple-600/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm">
            <BarChart2 className="w-3.5 h-3.5" />
            Industrial Property Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight">
            The Future of
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tight gradient-text">
            Industrial Valuation
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed"
        >
          AI-powered property intelligence for India&apos;s industrial corridors.{" "}
          <span className="text-white font-medium">Instant.</span>{" "}
          <span className="text-emerald-400 font-medium">Verified.</span>{" "}
          <span className="text-blue-400 font-medium">Bankable.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            size="lg"
            onClick={() => document.getElementById("add-property")?.scrollIntoView({ behavior: "smooth" })}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Start Valuation
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("live-feed")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Live Results
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-8 pt-4"
        >
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center gap-1 ${i > 0 ? "border-l border-[var(--border-subtle)] pl-8" : ""}`}>
              <span className="text-2xl font-bold font-geist-mono text-white">
                <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} decimal={s.decimal} />
              </span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
      >
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-[var(--border-subtle)] flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-blue-400 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}