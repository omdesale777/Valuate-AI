"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Camera, X, ChevronLeft, ArrowRight, Upload } from "lucide-react";
import { Coordinates } from "@/types";
import { Button } from "@/components/ui/index";
import { FormField, TextInput } from "@/components/ui/FormComponents";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/formatters";

interface Props {
  onBack: () => void;
  onSubmit: (coordinates?: Coordinates, imageFile?: File) => void;
  isSubmitting: boolean;
}

export default function Step2SiteCapture({ onBack, onSubmit, isSubmitting }: Props) {
  const geo = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manualFileRef = useRef<HTMLInputElement>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewURL) URL.revokeObjectURL(previewURL);
    setCapturedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    setCapturedFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (manualFileRef.current) manualFileRef.current.value = "";
  };

  const handleAnalyzeSite = async () => {
    setAnalyzing(true);
    geo.requestLocation();
    fileInputRef.current?.click();
    setTimeout(() => setAnalyzing(false), 2000);
  };

  const getCoordinates = (): Coordinates | undefined => {
    if (geo.coordinates) return geo.coordinates;
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
    return undefined;
  };

  const canSubmit = (geo.permissionState === "granted" || (manualLat && manualLon));

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileCapture}
      />

      {/* Location Card */}
      <div className="glass rounded-xl p-5 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white">📍 Capture Location</h3>
        </div>

        <AnimatePresence mode="wait">
          {geo.permissionState === "idle" && (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-[var(--text-muted)]">
              Press <span className="text-blue-400 font-medium">ANALYZE SITE</span> below to capture GPS coordinates
            </motion.p>
          )}
          {geo.permissionState === "requesting" && (
            <motion.p key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-amber-400">
              ⏳ Requesting GPS access...
            </motion.p>
          )}
          {geo.permissionState === "granted" && geo.coordinates && (
            <motion.div key="granted" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">GPS Captured</span>
              </div>
              <p className="font-geist-mono text-sm text-white">
                {geo.coordinates.lat.toFixed(6)}°N, {geo.coordinates.lon.toFixed(6)}°E
              </p>
              {geo.address && <p className="text-xs text-[var(--text-muted)] mt-1">{geo.address}</p>}
              <button onClick={geo.reset} className="mt-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors">
                ↺ Retake location
              </button>
            </motion.div>
          )}
          {geo.permissionState === "denied" && (
            <motion.div key="denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-3">
              <p className="text-sm text-red-400">{geo.error}</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Latitude">
                  <TextInput value={manualLat} onChange={setManualLat} placeholder="19.9975" mono />
                </FormField>
                <FormField label="Longitude">
                  <TextInput value={manualLon} onChange={setManualLon} placeholder="73.7898" mono />
                </FormField>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Find coordinates at maps.google.com</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Card */}
      <div className="glass rounded-xl p-5 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white">📸 Site Photograph</h3>
        </div>

        {previewURL ? (
          <div className="relative rounded-lg overflow-hidden h-48">
            <img src={previewURL} alt="Site" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 backdrop-blur-sm py-2 text-center text-sm text-white font-medium">
              📸 Site Photo Captured ✓
            </div>
            <button onClick={clearPhoto} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="h-40 border-2 border-dashed border-[var(--border-subtle)] rounded-lg flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <Camera className="w-8 h-8 opacity-30" />
            <p className="text-sm">Photo will appear here</p>
            <p className="text-xs">JPEG, PNG — max 5MB</p>
          </div>
        )}

        {/* Manual upload fallback */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowManualUpload(!showManualUpload)}
            className="text-xs text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            Or upload a photo instead
          </button>
          {showManualUpload && (
            <input
              ref={manualFileRef}
              type="file"
              accept="image/*"
              onChange={handleFileCapture}
              className="mt-2 text-xs text-[var(--text-muted)] w-full"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} icon={<ChevronLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Button
            onClick={() => onSubmit(getCoordinates(), capturedFile ?? undefined)}
            isLoading={isSubmitting}
            disabled={!canSubmit && !capturedFile}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            size="lg"
          >
            Submit for Valuation
          </Button>
          <p className="text-xs text-[var(--text-muted)]">
            {!canSubmit && "GPS or manual coords needed"}
          </p>
        </div>
      </div>

      {/* Sticky ANALYZE SITE button */}
      <AnalyzeSiteButton onAnalyze={handleAnalyzeSite} isAnalyzing={analyzing} />
    </div>
  );
}

// ─── Analyze Site Button ──────────────────────────────────────────────────────
function AnalyzeSiteButton({ onAnalyze, isAnalyzing }: { onAnalyze: () => void; isAnalyzing: boolean }) {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="pointer-events-auto relative"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={cn(
            "relative flex items-center gap-3 px-10 py-4 rounded-full font-geist-mono font-bold text-white uppercase tracking-widest text-sm transition-all duration-200",
            "bg-gradient-to-r from-blue-600 to-emerald-600",
            "shadow-[0_8px_32px_rgba(59,130,246,0.4)]",
            "hover:scale-105 hover:shadow-[0_12px_40px_rgba(59,130,246,0.55)]",
            "active:scale-95 disabled:opacity-70"
          )}
        >
          {/* Camera + crosshair icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3.5" stroke="white" strokeWidth="1.5" />
            <path d="M7 3h6M10 3v2M10 15v2M3 10h2M15 10h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 5l1.5 1.5M15 5l-1.5 1.5M5 15l1.5-1.5M15 15l-1.5-1.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </svg>
          {isAnalyzing ? "Requesting Access..." : "Analyze Site"}
        </button>
      </motion.div>
    </div>
  );
}