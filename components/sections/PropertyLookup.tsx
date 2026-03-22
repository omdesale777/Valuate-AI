"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SearchX } from "lucide-react";
import { Property } from "@/types";
import { Button, GlassCard, StatusBadge, GradeTag, SkeletonCard } from "@/components/ui/index";
import { formatINR, getCityColor, cn } from "@/lib/formatters";

interface Props {
  onPrefillSurveyNumber?: (s: string) => void;
}

export default function PropertyLookup({ onPrefillSurveyNumber }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setHasSearched(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/properties/lookup?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.properties ?? []);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <section id="lookup" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-blue-400 mb-2 font-medium">Remote Lookup</p>
          <h2 className="text-3xl font-bold text-white mb-2">Find Any Registered Property</h2>
          <p className="text-[var(--text-secondary)]">Instantly retrieve valuation data for any registered property.</p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-2 flex items-center gap-3 ring-1 ring-blue-500/20">
            <Search className="w-5 h-5 text-[var(--text-muted)] ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Survey Number or Property ID (e.g. MH-NK-2024-0087)"
              className="flex-1 bg-transparent text-white outline-none text-sm font-geist-mono placeholder:text-[var(--text-muted)] placeholder:font-geist"
            />
            {isSearching && (
              <div className="w-4 h-4 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin mr-2" />
            )}
            <Button size="sm" onClick={() => {}}>Lookup</Button>
          </GlassCard>
        </motion.div>

        {/* Results */}
        <div className="mt-4">
          {isSearching && !hasSearched && (
            <div className="grid gap-3">
              <SkeletonCard /><SkeletonCard />
            </div>
          )}

          {hasSearched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 flex flex-col items-center gap-4"
            >
              <SearchX className="w-10 h-10 text-[var(--text-muted)]" />
              <p className="text-[var(--text-secondary)]">
                No property found for &quot;<span className="text-white font-mono">{query}</span>&quot;
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onPrefillSurveyNumber?.(query.toUpperCase());
                  document.getElementById("add-property")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ➕ Add this property
              </Button>
            </motion.div>
          )}

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {results.map((p) => (
                  <GlassCard key={p._id} hoverable className="p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-geist-mono text-sm text-blue-400 font-medium">{p.surveyNumber}</span>
                          <StatusBadge status={p.status} />
                          {p.valuation?.investmentGrade && <GradeTag grade={p.valuation.investmentGrade} size="sm" />}
                        </div>
                        <span className={cn("px-2 py-0.5 rounded text-xs border", getCityColor(p.city))}>{p.city}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold font-geist-mono text-emerald-400">
                            {p.valuation?.estimatedValueINR ? formatINR(p.valuation.estimatedValueINR) : "Pending"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{p.areaSqFt.toLocaleString()} sq ft • {p.zoningType}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                        >
                          {expandedId === p._id ? "Close" : "View Report"}
                        </Button>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedId === p._id && p.valuation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">Monthly Rental</p>
                                <p className="font-mono text-blue-400">{formatINR(p.valuation.monthlyRentalINR)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">Annual Yield</p>
                                <p className="font-mono text-emerald-400">{p.valuation.annualYieldPercent}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">Confidence</p>
                                <p className="font-mono text-white">{p.valuation.confidenceScore}/100</p>
                              </div>
                            </div>
                            {p.valuation.aiInsights.slice(0, 2).map((ins, i) => (
                              <p key={i} className="text-xs text-[var(--text-secondary)] mt-2">• {ins}</p>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}