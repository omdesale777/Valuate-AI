"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, AlertTriangle, TrendingUp, Copy, Share2,
  RotateCcw, MapPin, Layers, Building2, Factory, Check,
} from "lucide-react";
import { Property } from "@/types";
import { formatINR, formatDate, getGradeColor, cn } from "@/lib/formatters";
import { GradeTag, StatusBadge, ProgressRing } from "@/components/ui/index";
import { Button } from "@/components/ui/index";
import { useToast } from "@/components/ui/Toast";

export default function ValuationResultCard({
  property,
  onReset,
}: {
  property: Property;
  onReset?: () => void;
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const v = property.valuation;
  if (!v) return null;

  const rangePercent =
    v.valuationRangeLow && v.valuationRangeHigh
      ? ((v.estimatedValueINR - v.valuationRangeLow) /
          (v.valuationRangeHigh - v.valuationRangeLow)) *
        100
      : 50;

  const handleCopy = () => {
    const text = `ValuateAI Report — ${property.surveyNumber}
City: ${property.city}${property.locality ? ", " + property.locality : ""}
Area: ${property.areaSqFt.toLocaleString()} sq ft
Estimated Value: ${formatINR(v.estimatedValueINR)}
Investment Grade: ${v.investmentGrade}
Monthly Rental: ${formatINR(v.monthlyRentalINR)}
Annual Yield: ${v.annualYieldPercent}%
Insights: ${v.aiInsights.join("; ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("Report copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass rounded-2xl overflow-hidden border border-[var(--border-subtle)]"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600/10 to-emerald-600/5 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-geist-mono text-sm text-blue-400">{property.surveyNumber}</span>
          <StatusBadge status={property.status} />
        </div>
        <div className="flex flex-col items-end">
          <GradeTag grade={v.investmentGrade} size="lg" />
          <span className="text-xs text-[var(--text-muted)] mt-1">Investment Grade</span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Main value */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Estimated Market Value
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold font-geist-mono text-emerald-400 mb-3"
          >
            {formatINR(v.estimatedValueINR)}
          </motion.p>

          {/* Range bar */}
          {v.valuationRangeLow > 0 && (
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="font-mono">{formatINR(v.valuationRangeLow)}</span>
              <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-emerald-400 shadow"
                  style={{ left: `${Math.min(Math.max(rangePercent, 5), 95)}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
              <span className="font-mono">{formatINR(v.valuationRangeHigh)}</span>
            </div>
          )}
        </div>

        {/* Rental + yield */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">Monthly Rental</p>
            <p className="text-lg font-bold font-geist-mono text-blue-400">{formatINR(v.monthlyRentalINR)}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">Annual Yield</p>
            <p className="text-lg font-bold font-geist-mono text-emerald-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />{v.annualYieldPercent}%
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">AI Confidence</span>
            <span className="text-sm font-mono text-[var(--text-primary)]">{v.confidenceScore}/100</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-tertiary)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${v.confidenceScore}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                v.confidenceScore >= 75 ? "bg-emerald-500" : v.confidenceScore >= 50 ? "bg-amber-500" : "bg-red-500"
              )}
            />
          </div>
        </div>

        {/* AI Insights */}
        {v.aiInsights.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <span>✦</span> AI Insights
            </p>
            <div className="flex flex-col gap-2">
              {v.aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.4 }}
                  className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {insight}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Risk flags */}
        {v.riskFlags.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Risk Flags
            </p>
            <div className="flex flex-col gap-2">
              {v.riskFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property summary */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { icon: <MapPin className="w-3.5 h-3.5" />, label: `${property.city}${property.locality ? ", " + property.locality : ""}` },
            { icon: <Layers className="w-3.5 h-3.5" />, label: `${property.areaSqFt.toLocaleString()} sq ft` },
            { icon: <Building2 className="w-3.5 h-3.5" />, label: property.buildingAge != null ? `${property.buildingAge} years old` : "Age unknown" },
            { icon: <Factory className="w-3.5 h-3.5" />, label: property.zoningType ?? "—" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="text-[var(--text-muted)]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <Button variant="ghost" size="sm" onClick={handleCopy} icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} className="flex-1">
            {copied ? "Copied!" : "Copy Report"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => { navigator.clipboard.writeText(window.location.href); addToast("Link copied", "info"); }}
            className="flex-1"
          >
            Share
          </Button>
          {onReset && (
            <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onReset} className="flex-1">
              New
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}