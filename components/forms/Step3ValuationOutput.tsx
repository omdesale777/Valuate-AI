"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, RotateCcw } from "lucide-react";
import { Property } from "@/types";
import { Button } from "@/components/ui/index";
import ValuationResultCard from "@/components/cards/ValuationResultCard";

const LOADING_MESSAGES = [
  "🔍 Analyzing construction quality from site photo...",
  "🗺️ Scanning nearby infrastructure and amenities...",
  "📊 Computing market comparables for the region...",
  "🧠 Generating AI valuation report...",
  "✨ Finalizing investment grade...",
];

interface Props {
  isSubmitting: boolean;
  submissionError: string | null;
  valuatedProperty: Property | null;
  onReset: () => void;
  onRetry: () => void;
}

export default function Step3ValuationOutput({
  isSubmitting,
  submissionError,
  valuatedProperty,
  onReset,
  onRetry,
}: Props) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-16">
        {/* Custom spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>

        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-[var(--text-secondary)]"
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Indeterminate progress bar */}
        <div className="w-64 h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
            style={{
              animation: "shimmer 1.5s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)]">This typically takes 15–30 seconds</p>
      </div>
    );
  }

  if (submissionError) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <XCircle className="w-14 h-14 text-red-400" />
        <div className="text-center">
          <p className="text-lg font-semibold text-white mb-2">Valuation Failed</p>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">{submissionError}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRetry} icon={<RotateCcw className="w-4 h-4" />}>Try Again</Button>
          <Button variant="outline" onClick={onReset}>Start Over</Button>
        </div>
      </div>
    );
  }

  if (valuatedProperty) {
    return <ValuationResultCard property={valuatedProperty} onReset={onReset} />;
  }

  return null;
}