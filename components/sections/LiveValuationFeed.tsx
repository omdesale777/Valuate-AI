"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Table2, X } from "lucide-react";
import { useValuationFeed } from "@/hooks/useValuationFeed";
import PropertyCard from "@/components/cards/PropertyCard";
import { SkeletonCard, GradeTag, StatusBadge, Button } from "@/components/ui/index";
import { formatINR, formatDate, getCityColor, cn } from "@/lib/formatters";

const CITY_FILTERS = ["all", "Nashik", "Mumbai", "Pune"];
const ZONE_FILTERS = ["all", "Industrial", "Commercial", "Mixed", "Warehousing"];
const SORT_FILTERS = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest Value" },
  { value: "grade", label: "Best Grade" },
];

export default function LiveValuationFeed() {
  const feed = useValuationFeed();
  const properties = feed.properties ?? [];

  return (
    <section id="live-feed" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium">
                Live Valuation Feed
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-geist-mono text-[var(--text-muted)]">SYNCING EVERY 30S</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Latest Property Valuations</h2>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-1">
            <button
              onClick={() => feed.setViewMode("grid")}
              className={cn("p-2 rounded-md transition-all", feed.viewMode === "grid" ? "bg-blue-600 text-white" : "text-[var(--text-muted)] hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => feed.setViewMode("table")}
              className={cn("p-2 rounded-md transition-all", feed.viewMode === "table" ? "bg-blue-600 text-white" : "text-[var(--text-muted)] hover:text-white")}
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1.5">
            {CITY_FILTERS.map((c) => (
              <button key={c}
                onClick={() => feed.updateFilter("city", c)}
                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-all border",
                  feed.filters.city === c
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
                )}>
                {c === "all" ? "All Cities" : c}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {ZONE_FILTERS.map((z) => (
              <button key={z}
                onClick={() => feed.updateFilter("zoningType", z)}
                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-all border",
                  feed.filters.zoningType === z
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
                )}>
                {z === "all" ? "All Zones" : z}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 ml-auto">
            {SORT_FILTERS.map((s) => (
              <button key={s.value}
                onClick={() => feed.updateFilter("sort", s.value)}
                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-all border",
                  feed.filters.sort === s.value
                    ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
                )}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* New items banner */}
        {feed.newCount > 0 && (
          <div className="flex items-center justify-between bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6">
            <span className="text-sm text-blue-300">✨ {feed.newCount} new valuation{feed.newCount > 1 ? "s" : ""} added</span>
            <button onClick={feed.clearNewCount}><X className="w-4 h-4 text-blue-400" /></button>
          </div>
        )}

        {/* Loading */}
        {feed.isLoading && properties.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {feed.error && (
          <div className="text-center py-12 text-red-400">{feed.error}</div>
        )}

        {/* Empty state */}
        {!feed.isLoading && !feed.error && properties.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="text-6xl opacity-20">🏗️</span>
            <p className="text-lg font-semibold text-[var(--text-secondary)]">No valuations yet</p>
            <Button onClick={() => document.getElementById("add-property")?.scrollIntoView({ behavior: "smooth" })}>
              Submit First Property
            </Button>
          </div>
        )}

        {/* Grid view */}
        {feed.viewMode === "grid" && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        )}

        {/* Table view */}
        {feed.viewMode === "table" && properties.length > 0 && (
          <>
            <div className="hidden md:block glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)]">
                    {["Survey No", "City", "Area", "Value", "Grade", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p, i) => (
                    <tr key={p._id} className={cn("border-b border-[var(--border-subtle)] hover:bg-blue-500/5 transition-colors", i % 2 === 0 ? "" : "bg-white/[0.015]")}>
                      <td className="px-4 py-3 font-geist-mono text-blue-400 text-xs">{p.surveyNumber}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-xs border", getCityColor(p.city))}>{p.city}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{p.areaSqFt.toLocaleString()} sqft</td>
                      <td className="px-4 py-3 font-geist-mono text-emerald-400 font-bold">
                        {p.valuation?.estimatedValueINR ? formatINR(p.valuation.estimatedValueINR) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {p.valuation?.investmentGrade ? <GradeTag grade={p.valuation.investmentGrade} size="sm" /> : "—"}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden grid grid-cols-1 gap-4">
              {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
          </>
        )}

        {/* Load more */}
        {properties.length > 0 && (
          <div className="flex flex-col items-center gap-3 mt-8">
            <p className="text-xs text-[var(--text-muted)]">
              Showing {properties.length} of {feed.total} properties
            </p>
            {feed.hasMore ? (
              <Button variant="outline" onClick={feed.loadMore} isLoading={feed.isLoading}>
                Load More
              </Button>
            ) : (
              <p className="text-xs text-emerald-400">✓ All properties loaded</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}