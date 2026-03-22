"use client";

import React, { useState } from "react";
import { Star, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { cn, sqFtToSqM, sqMToSqFt } from "@/lib/formatters";

// ─── FormField ────────────────────────────────────────────────────────────────
export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────
export function TextInput({
  value,
  onChange,
  placeholder,
  error,
  mono,
  className,
  onBlur,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  mono?: boolean;
  className?: string;
  onBlur?: () => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={cn(
        "w-full bg-[var(--bg-tertiary)] border rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all",
        error ? "border-red-500/50" : "border-[var(--border-subtle)]",
        mono && "font-geist-mono",
        className
      )}
    />
  );
}

// ─── SelectInput ─────────────────────────────────────────────────────────────
export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full bg-[var(--bg-tertiary)] border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer",
        error ? "border-red-500/50 text-[var(--text-primary)]" : "border-[var(--border-subtle)]",
        !value ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#1a1a1a]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── TextareaInput ───────────────────────────────────────────────────────────
export function TextareaInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
      />
      {maxLength && (
        <span className="absolute bottom-2 right-3 text-xs text-[var(--text-muted)]">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export function StarRating({
  value,
  onChange,
  label,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  label?: string;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => !readonly && onChange?.(i)}
            onMouseEnter={() => !readonly && setHovered(i)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={cn(
              "transition-all duration-150",
              !readonly && "cursor-pointer hover:scale-110 active:scale-95"
            )}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                i <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-neutral-600"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-xs text-[var(--text-secondary)]">
          {ratingLabels[active] || "Not rated"}
        </span>
      </div>
    </div>
  );
}

// ─── NumberStepper ────────────────────────────────────────────────────────────
export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-geist-mono font-bold text-white text-sm">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── UnitToggle ───────────────────────────────────────────────────────────────
export function UnitToggle({
  valueSqFt,
  onChange,
  label,
  error,
}: {
  valueSqFt: number | "";
  onChange: (sqFt: number) => void;
  label?: string;
  error?: string;
}) {
  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");
  const displayed =
    valueSqFt === ""
      ? ""
      : unit === "sqft"
      ? String(valueSqFt)
      : String(sqFtToSqM(Number(valueSqFt)));

  const handleChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return;
    onChange(unit === "sqft" ? num : sqMToSqFt(num));
  };

  const toggleUnit = () => {
    setUnit((u) => (u === "sqft" ? "sqm" : "sqft"));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          {label}
        </span>
      )}
      <div
        className={cn(
          "flex items-center bg-[var(--bg-tertiary)] border rounded-lg overflow-hidden",
          error ? "border-red-500/50" : "border-[var(--border-subtle)]"
        )}
      >
        <input
          type="number"
          value={displayed}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="0"
          min={1}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-[var(--text-muted)]"
        />
        <button
          type="button"
          onClick={toggleUnit}
          className="px-3 py-2.5 text-xs font-mono font-bold border-l border-[var(--border-subtle)] text-blue-400 hover:bg-blue-500/10 transition-colors whitespace-nowrap"
        >
          {unit === "sqft" ? "SQ FT" : "SQ M"}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── TagSelector ─────────────────────────────────────────────────────────────
export function TagSelector({
  options,
  value,
  onChange,
  label,
  multi = true,
  error,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  label?: string;
  multi?: boolean;
  error?: string;
}) {
  const selected = multi ? (value as string[]) : [value as string];

  const toggle = (opt: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    } else {
      onChange(opt === value ? "" : opt);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150",
              selected.includes(opt)
                ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                : "bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-white"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}