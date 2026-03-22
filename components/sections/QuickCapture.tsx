"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Zap, ArrowRight, X, ChevronDown } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button, GlassCard } from "@/components/ui/index";
import { FormField, TextInput, SelectInput } from "@/components/ui/FormComponents";
import { useToast } from "@/components/ui/Toast";
import { Coordinates, Property } from "@/types";
import ValuationResultCard from "@/components/cards/ValuationResultCard";

interface Props {
  onSwitchToManual: () => void;
}

type CaptureStep = "idle" | "capturing" | "form" | "submitting" | "result";

const CITY_OPTIONS = [
  { value: "Nashik", label: "🏭 Nashik" },
  { value: "Mumbai", label: "🌆 Mumbai" },
  { value: "Pune", label: "🏙️ Pune" },
];

export default function QuickCapture({ onSwitchToManual }: Props) {
  const { addToast } = useToast();
  const geo = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<CaptureStep>("idle");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [surveyNumber, setSurveyNumber] = useState("");
  const [city, setCity] = useState("");
  const [areaSqFt, setAreaSqFt] = useState("");
  const [result, setResult] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewURL) URL.revokeObjectURL(previewURL);
    setCapturedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setStep("form");
  };

  const handleCapture = async () => {
    setStep("capturing");
    setError(null);
    // Request location
    geo.requestLocation();
    // Trigger camera
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!surveyNumber || !city || !areaSqFt) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    setStep("submitting");
    setError(null);

    try {
      // Upload image
      let siteImageURL: string | undefined;
      if (capturedFile) {
        const fd = new FormData();
        fd.append("file", capturedFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          siteImageURL = url;
        }
      }

      // Create property
      const coords: Coordinates | undefined = geo.coordinates ?? undefined;
      const createRes = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyNumber: surveyNumber.toUpperCase(),
          city,
          areaSqFt: Number(areaSqFt),
          siteImageURL,
          coordinates: coords,
          zoningType: "Industrial",
          ownershipType: "Freehold",
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create property");
      }
      const created = await createRes.json();

      // Trigger valuation
      const valRes = await fetch("/api/valuation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: created._id }),
      });
      if (!valRes.ok) throw new Error("Valuation failed");
      const valuated = await valRes.json();
      setResult(valuated);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
      addToast("Submission failed. Try again.", "error");
    }
  };

  const reset = () => {
    setStep("idle");
    setCapturedFile(null);
    setPreviewURL(null);
    setSurveyNumber("");
    setCity("");
    setAreaSqFt("");
    setResult(null);
    setError(null);
    geo.reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-600/6 blur-3xl animate-float-delayed" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">

          {/* IDLE — Landing choice */}
          {step === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Badge */}
              <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm">
                🏭 Industrial Property Intelligence
              </span>

              {/* Headline */}
              <div>
                <h1 className="text-4xl sm:text-6xl font-bold text-white leading-none tracking-tight mb-3">
                  The Future of<br />
                  <span className="gradient-text">Industrial Valuation</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto">
                  AI-powered property intelligence for India&apos;s industrial corridors.
                </p>
              </div>

              {/* Two mode cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* Quick capture */}
                <GlassCard
                  hoverable
                  onClick={handleCapture}
                  className="p-6 flex flex-col items-center gap-4 cursor-pointer border-blue-500/20 hover:border-blue-500/50 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Camera className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Capture Site Now</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Open camera + auto GPS. Instant AI valuation.
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/20">
                    Recommended
                  </span>
                </GlassCard>

                {/* Manual entry */}
                <GlassCard
                  hoverable
                  onClick={onSwitchToManual}
                  className="p-6 flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors">
                    <ArrowRight className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Manual Entry</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Remote lookup or detailed property form.
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/20">
                    Full Details
                  </span>
                </GlassCard>
              </div>

              {/* Scroll hint */}
              <button
                onClick={onSwitchToManual}
                className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <span className="text-xs">Or scroll to explore</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>
          )}

          {/* CAPTURING */}
          {step === "capturing" && (
            <motion.div
              key="capturing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 text-center py-12"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin" style={{ animationDirection: "reverse" }} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Requesting Access...</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">Allow camera and location when prompted</p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>Cancel</Button>
            </motion.div>
          )}

          {/* FORM — after capture */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Quick Details</h2>
                <button onClick={reset} className="text-[var(--text-muted)] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo preview */}
              {previewURL && (
                <div className="relative rounded-xl overflow-hidden h-40">
                  <img src={previewURL} alt="Site" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 backdrop-blur-sm py-1.5 text-center text-xs text-white font-medium">
                    📸 Site Photo Captured ✓
                  </div>
                </div>
              )}

              {/* Location */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${geo.permissionState === "granted" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
                <MapPin className="w-4 h-4 shrink-0" />
                {geo.permissionState === "granted" && geo.coordinates
                  ? <span className="font-mono text-xs">{geo.address || `${geo.coordinates.lat.toFixed(4)}°N, ${geo.coordinates.lon.toFixed(4)}°E`}</span>
                  : <span className="text-xs">Location not captured — valuation will use city-level data</span>
                }
              </div>

              {/* 3 required fields only */}
              <FormField label="Survey Number" required>
                <TextInput
                  value={surveyNumber}
                  onChange={(v) => setSurveyNumber(v.toUpperCase())}
                  placeholder="e.g. MH-NK-2024-0087"
                  mono
                />
              </FormField>

              <FormField label="City" required>
                <SelectInput
                  value={city}
                  onChange={setCity}
                  options={CITY_OPTIONS}
                  placeholder="Select city..."
                />
              </FormField>

              <FormField label="Total Area (sq ft)" required>
                <TextInput
                  value={areaSqFt}
                  onChange={setAreaSqFt}
                  placeholder="e.g. 5000"
                  type="number"
                />
              </FormField>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full"
                icon={<Zap className="w-4 h-4" />}
              >
                Generate AI Valuation
              </Button>

              <button
                onClick={onSwitchToManual}
                className="text-xs text-center text-[var(--text-muted)] hover:text-white transition-colors"
              >
                Need to add more details? Switch to full form →
              </button>
            </motion.div>
          )}

          {/* SUBMITTING */}
          {step === "submitting" && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 text-center py-12"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Analyzing Property...</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">Gemini AI is computing the valuation</p>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <ValuationResultCard property={result} onReset={reset} />
              <Button variant="outline" onClick={onSwitchToManual} className="w-full">
                View Full Dashboard →
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}