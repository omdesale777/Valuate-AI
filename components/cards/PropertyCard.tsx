"use client";

import { motion } from "framer-motion";
import { Building2, Layers } from "lucide-react";
import { Property } from "@/types";
import { formatINR, formatDate, getCityColor, cn } from "@/lib/formatters";
import { GlassCard, StatusBadge, GradeTag } from "@/components/ui/index";
import { Button } from "@/components/ui/index";

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <GlassCard hoverable className="p-5 flex flex-col gap-3 h-full group">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="font-geist-mono text-sm text-blue-400 font-medium">
            {property.surveyNumber}
          </span>
          <StatusBadge status={property.status} />
        </div>

        {/* City + zone */}
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border", getCityColor(property.city))}>
            {property.city}
          </span>
          {property.zoningType && (
            <span className="px-2 py-0.5 rounded-md text-xs text-[var(--text-muted)] bg-white/5">
              {property.zoningType}
            </span>
          )}
        </div>

        {/* Value */}
        {property.valuation?.estimatedValueINR ? (
          <div>
            <p className="text-2xl font-bold font-geist-mono text-emerald-400">
              {formatINR(property.valuation.estimatedValueINR)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">est. market value</p>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">Valuation pending...</p>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-1 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {property.areaSqFt.toLocaleString()} sq ft
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {property.buildingAge != null ? `${property.buildingAge}y old` : "Age N/A"}
          </span>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {property.valuation?.investmentGrade ? (
            <GradeTag grade={property.valuation.investmentGrade} size="sm" />
          ) : (
            <div />
          )}
          <span className="text-xs text-[var(--text-muted)]">{formatDate(property.createdAt)}</span>
        </div>

        {/* Hover CTA */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mt-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View Full Report →
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}