"use client";

import { motion } from "framer-motion";
import { Landmark, HeartPulse, GraduationCap, Train, MapPin } from "lucide-react";
import useSWR from "swr";
import { Coordinates, PropertyAmenities, AmenityCategory } from "@/types";
import { GlassCard, ProgressRing, SkeletonCard } from "@/components/ui/index";
import { cn } from "@/lib/formatters";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface AmenityCardProps {
  type: "banks" | "hospitals" | "schools" | "transport";
  data: AmenityCategory;
}

const AMENITY_CONFIG = {
  banks:     { icon: Landmark,      label: "Banks & ATMs",  color: "text-yellow-400",  border: "border-l-yellow-500",  radius: "1km"  },
  hospitals: { icon: HeartPulse,    label: "Healthcare",    color: "text-red-400",     border: "border-l-red-500",     radius: "2km"  },
  schools:   { icon: GraduationCap, label: "Education",     color: "text-blue-400",    border: "border-l-blue-500",    radius: "2km"  },
  transport: { icon: Train,         label: "Transport",     color: "text-purple-400",  border: "border-l-purple-500",  radius: "1.5km" },
};

function AmenityCard({ type, data }: AmenityCardProps) {
  const config = AMENITY_CONFIG[type];
  const Icon = config.icon;

  return (
    <GlassCard className={cn("p-5 border-l-4", config.border)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.color)} />
          <span className="font-medium text-sm text-white">{config.label}</span>
        </div>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", data.count > 0 ? `${config.color} bg-current/10 border-current/20` : "text-[var(--text-muted)] border-[var(--border-subtle)]")}>
          {data.count} found
        </span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3">Within {config.radius}</p>

      {data.items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {data.items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] truncate flex-1 mr-2">{item.name}</span>
              <span className="text-xs font-geist-mono text-[var(--text-muted)] shrink-0">
                {item.distanceM < 1000 ? `${item.distanceM}m` : `${(item.distanceM / 1000).toFixed(1)}km`}
              </span>
            </div>
          ))}
          {data.count > 3 && (
            <p className="text-xs text-[var(--text-muted)] mt-1">+{data.count - 3} more</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)] italic">None found within range</p>
      )}
    </GlassCard>
  );
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Excellent Connectivity", color: "text-emerald-400" };
  if (score >= 50) return { label: "Good Connectivity", color: "text-blue-400" };
  if (score >= 25) return { label: "Fair Connectivity", color: "text-amber-400" };
  return { label: "Limited Connectivity", color: "text-red-400" };
}

export default function NeighborhoodAnalysis({ coordinates }: { coordinates?: Coordinates }) {
  const { data, isLoading } = useSWR<PropertyAmenities>(
    coordinates ? `/api/amenities?lat=${coordinates.lat}&lon=${coordinates.lon}` : null,
    fetcher
  );

  return (
    <section id="neighborhood" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-medium">Neighborhood Intelligence</p>
          <h2 className="text-3xl font-bold text-white mb-2">Surroundings & Connectivity</h2>
          <p className="text-[var(--text-secondary)]">Nearby amenities within walking and driving distance.</p>
        </motion.div>

        {/* No coordinates state */}
        {!coordinates && (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <MapPin className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
            <p className="text-[var(--text-secondary)]">
              Neighborhood analysis will appear after your first property capture
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Data */}
        {data && (
          <div className="flex flex-col gap-8">
            {/* Connectivity score */}
            <div className="flex flex-col sm:flex-row items-center gap-6 glass rounded-2xl p-6 border border-[var(--border-subtle)]">
              <ProgressRing value={data.connectivityScore} size={100} label="Score" />
              <div>
                <p className="text-3xl font-bold font-geist-mono text-white">{data.connectivityScore}/100</p>
                <p className={cn("font-medium mt-1", getScoreLabel(data.connectivityScore).color)}>
                  {getScoreLabel(data.connectivityScore).label}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-2 max-w-xs">
                  Composite score based on density of banks, healthcare, education, and transport within reach.
                </p>
              </div>
              {coordinates && (
                <div className="sm:ml-auto text-right">
                  <p className="text-xs text-[var(--text-muted)]">Analyzing coordinates</p>
                  <p className="text-xs font-geist-mono text-blue-400">{coordinates.lat.toFixed(4)}°N, {coordinates.lon.toFixed(4)}°E</p>
                </div>
              )}
            </div>

            {/* Amenity grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AmenityCard type="banks" data={data.banks} />
              <AmenityCard type="hospitals" data={data.hospitals} />
              <AmenityCard type="schools" data={data.schools} />
              <AmenityCard type="transport" data={data.transport} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}