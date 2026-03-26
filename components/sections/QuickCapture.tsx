"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, MapPin, Zap, ArrowRight, X, ChevronDown,
  BrainCircuit, TrendingUp, Calculator, Navigation,
  CheckCircle2, Clock, Crosshair, BarChart3
} from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/index";
import { useToast } from "@/components/ui/Toast";
import { Coordinates, Property } from "@/types";
import ValuationResultCard from "@/components/cards/ValuationResultCard";

interface Props {
  onSwitchToManual: () => void;
}

type CaptureStep = "idle" | "capturing" | "form" | "submitting" | "result";

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Analysis",
    desc: "Advanced algorithms calculate present and future property values",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: TrendingUp,
    title: "Market Predictions",
    desc: "Growth projections based on market trends and location factors",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Calculator,
    title: "ROI Calculator",
    desc: "Instant return on investment calculations for informed decisions",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Navigation,
    title: "Location Intelligence",
    desc: "Industrial zones analysis with amenities factor integration",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

const STATS = [
  { value: "99.2%", label: "Accuracy Rate" },
  { value: "< 30s", label: "Analysis Time" },
  { value: "500m", label: "Amenities Radius" },
  { value: "5 Years", label: "Prediction Range" },
];

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

export default function QuickCapture({ onSwitchToManual }: Props) {
  const { addToast } = useToast();
  const geo = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<CaptureStep>("idle");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
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
    geo.requestLocation();
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!capturedFile) {
      addToast("Please capture a site photo first", "error");
      return;
    }

    setStep("submitting");
    setError(null);

    try {
      // Upload image
      let siteImageURL: string | undefined;
      const fd = new FormData();
      fd.append("file", capturedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        siteImageURL = url;
      }

      const coords: Coordinates | undefined = geo.coordinates ?? undefined;

      // Auto-detect city from reverse geocode address
      let detectedCity = "Nashik"; // default
      if (geo.address) {
        const addr = geo.address.toLowerCase();
        if (
          addr.includes("mumbai") ||
          addr.includes("thane") ||
          addr.includes("navi mumbai")
        ) {
          detectedCity = "Mumbai";
        } else if (
          addr.includes("pune") ||
          addr.includes("pimpri") ||
          addr.includes("pcmc")
        ) {
          detectedCity = "Pune";
        } else if (addr.includes("nashik")) {
          detectedCity = "Nashik";
        }
      }

      // Create property — no survey number or area needed
      const createRes = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: detectedCity,
          locality: geo.address || undefined,
          siteImageURL,
          coordinates: coords,
          zoningType: "Industrial",
          ownershipType: "Freehold",
          isRoughEstimate: true,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create property");
      }
      const created = await createRes.json();

      // Trigger rough valuation
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
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(null);
    setResult(null);
    setError(null);
    geo.reset();
  };

  const clearPhoto = () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    setCapturedFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">

        {/* ─── IDLE: Full landing page ─────────────────────────────── */}
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col"
          >
            {/* HERO */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden pt-16">
              {/* Background blobs */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/6 blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] animate-float-delayed" />
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6 sm:gap-8"
              >
                {/* Badge */}
                <motion.div variants={stagger.item}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI-Powered Property Intelligence Platform
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.div variants={stagger.item} className="flex flex-col gap-1 sm:gap-2">
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-[-0.03em]">
                    The Future
                  </h1>
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-[-0.03em]">
                    <span className="text-white">Of Industrial </span>
                    <span className="gradient-text">Valuation</span>
                  </h1>
                </motion.div>

                {/* Subheadline */}
                <motion.p
                  variants={stagger.item}
                  className="text-base sm:text-lg text-white/50 max-w-xl leading-relaxed"
                >
                  AI-Powered Property Valuation &amp; Future Prediction Platform with
                  real-time analysis, AI predictions, and ROI calculations.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  variants={stagger.item}
                  className="flex flex-wrap justify-center gap-2"
                >
                  {["Real-time Analysis", "AI Predictions", "ROI Calculator"].map((pill) => (
                    <span
                      key={pill}
                      className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm"
                    >
                      {pill}
                    </span>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={stagger.item}
                  className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                >
                  <button
                    onClick={handleCapture}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all duration-200"
                  >
                    Start Valuation
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onSwitchToManual}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-white/80 text-sm hover:bg-white/5 hover:border-white/25 active:scale-95 transition-all duration-200"
                  >
                    View Results
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div variants={stagger.item} className="flex flex-col items-center gap-2 mt-4">
                  <ChevronDown className="w-5 h-5 text-white/20 animate-bounce" />
                </motion.div>
              </motion.div>
            </section>

            {/* STATS BAR */}
            <section className="border-t border-b border-white/5 py-8 px-4">
              <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={`flex flex-col items-center gap-1 text-center ${
                      i > 0 ? "sm:border-l sm:border-white/5" : ""
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs text-white/35 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FEATURES */}
            <section className="py-16 sm:py-24 px-4">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    System Features
                  </h2>
                  <p className="text-white/40 max-w-lg mx-auto text-sm sm:text-base">
                    Experience the next generation of property valuation with our
                    comprehensive suite of intelligent features.
                  </p>
                </motion.div>

                <motion.div
                  variants={stagger.container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.title}
                        variants={stagger.item}
                        className={`flex flex-col gap-4 p-5 rounded-2xl border ${f.bg} backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300`}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                          <Icon className={`w-5 h-5 ${f.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm mb-1.5">{f.title}</p>
                          <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 sm:py-20 px-4 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    How It Works
                  </h2>
                  <p className="text-white/40 text-sm sm:text-base">
                    Three steps to a complete industrial property valuation
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      step: "01",
                      icon: Camera,
                      title: "Capture Site",
                      desc: "Open camera, click a photo of the property. GPS auto-captures your location.",
                    },
                    {
                      step: "02",
                      icon: BrainCircuit,
                      title: "AI Analyzes",
                      desc: "Gemini AI analyzes the photo, location, and market data for Maharashtra industrial zones.",
                    },
                    {
                      step: "03",
                      icon: BarChart3,
                      title: "Get Valuation",
                      desc: "Receive estimated market value, rental yield, investment grade, and risk flags instantly.",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col gap-4 relative"
                      >
                        {i < 2 && (
                          <div className="hidden sm:block absolute top-5 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px bg-gradient-to-r from-white/10 to-transparent" />
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-white/20 font-bold">
                            {item.step}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white/60" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm mb-1.5">{item.title}</p>
                          <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="py-16 sm:py-20 px-4 border-t border-white/5">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Free to use · No signup required · Instant results</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    Ready to value your property?
                  </h2>
                  <p className="text-white/40 text-sm max-w-md">
                    Point your camera at any industrial property in Nashik, Mumbai, or
                    Pune and get an AI valuation in under 30 seconds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleCapture}
                      className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Start Valuation
                    </button>
                    <button
                      onClick={onSwitchToManual}
                      className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-white/70 text-sm hover:bg-white/5 active:scale-95 transition-all"
                    >
                      Manual Entry
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ─── CAPTURING ───────────────────────────────────────────── */}
        {step === "capturing" && (
          <motion.div
            key="capturing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin"
                style={{ animationDirection: "reverse" }}
              />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Requesting Access...</p>
              <p className="text-white/40 text-sm mt-1">
                Allow camera and location when prompted
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              Cancel
            </Button>
          </motion.div>
        )}

        {/* ─── FORM: Photo only, no input fields ───────────────────── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <div className="w-full max-w-lg flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Site Capture</h2>
                <button
                  onClick={reset}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Location alert */}
              <div
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                  geo.permissionState === "granted"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  {geo.permissionState === "granted" && geo.coordinates ? (
                    <>
                      <span className="font-medium">📍 Location Captured</span>
                      <span className="text-xs opacity-75 font-mono">
                        {geo.address ||
                          `${geo.coordinates.lat.toFixed(4)}°N, ${geo.coordinates.lon.toFixed(4)}°E`}
                      </span>
                    </>
                  ) : geo.permissionState === "denied" ? (
                    <>
                      <span className="font-medium">⚠️ Location Access Denied</span>
                      <span className="text-xs opacity-75">
                        Valuation will be less accurate without GPS. Enable location in
                        browser settings and retry.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">📍 Enable Location First</span>
                      <span className="text-xs opacity-75">
                        Please allow location access when prompted for accurate valuation.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Photo area */}
              {previewURL ? (
                <div className="relative rounded-xl overflow-hidden h-56">
                  <img
                    src={previewURL}
                    alt="Site"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 backdrop-blur-sm py-2 text-center text-xs text-white font-medium">
                    📸 Site Photo Captured ✓
                  </div>
                  <button
                    onClick={clearPhoto}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 text-white/30 hover:border-white/20 hover:text-white/50 transition-all"
                >
                  <Camera className="w-10 h-10" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Tap to open camera</p>
                    <p className="text-xs mt-0.5">or upload a photo</p>
                  </div>
                </button>
              )}

              {/* Info note */}
              <div className="flex items-start gap-2 text-xs text-white/30">
                <Crosshair className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  No manual input needed. AI will estimate the property value from your
                  photo and GPS location. This is a rough estimate — use full form for
                  precise valuation.
                </span>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!capturedFile}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                {capturedFile ? "Generate Rough Valuation" : "Upload Photo First"}
              </button>

              {/* Switch to full form */}
              <button
                onClick={onSwitchToManual}
                className="text-xs text-center text-white/30 hover:text-white/60 transition-colors"
              >
                Want precise valuation? Switch to full form →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── SUBMITTING ──────────────────────────────────────────── */}
        {step === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-emerald-500/30 border-b-emerald-500 animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Analyzing Property...</p>
              <p className="text-white/40 text-sm mt-1">
                Gemini AI is computing the valuation
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── RESULT ──────────────────────────────────────────────── */}
        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <div className="w-full max-w-lg flex flex-col gap-4">
              {/* Rough estimate disclaimer */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Rough estimate based on site photo and GPS location. Switch to full form
                for precise valuation.
              </div>

              <ValuationResultCard property={result} onReset={reset} />

              <button
                onClick={onSwitchToManual}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-all"
              >
                View Full Dashboard →
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}