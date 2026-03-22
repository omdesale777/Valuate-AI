"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn, getGradeColor, getStatusColor } from "@/lib/formatters";

// ─── GlassCard ───────────────────────────────────────────────────────────────
export function GlassCard({
  children,
  className,
  onClick,
  hoverable = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-xl",
        hoverable &&
          "cursor-pointer hover:border-[var(--border-accent)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  icon,
  iconPosition = "left",
  className,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-600/25",
    outline:
      "border border-[var(--border-accent)] text-blue-400 hover:bg-blue-600/10",
    ghost:
      "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5",
    danger:
      "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const colors = getStatusColor(status);
  const labels: Record<string, string> = {
    verified: "Verified",
    pending: "Pending",
    flagged: "Flagged",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        colors
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "verified"
            ? "bg-emerald-400"
            : status === "flagged"
            ? "bg-red-400"
            : "bg-amber-400 animate-pulse"
        )}
      />
      {labels[status] ?? status}
    </span>
  );
}

// ─── GradeTag ─────────────────────────────────────────────────────────────────
export function GradeTag({
  grade,
  size = "md",
}: {
  grade: string;
  size?: "sm" | "md" | "lg";
}) {
  const colors = getGradeColor(grade);
  const sizes = { sm: "text-xs px-2 py-0.5", md: "text-sm px-2.5 py-1", lg: "text-base px-3 py-1.5" };
  return (
    <span className={cn("inline-flex items-center font-bold rounded-lg border", colors, sizes[size])}>
      {grade}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("shimmer rounded-lg bg-neutral-800/50", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex justify-between pt-1">
        <Skeleton className="h-5 w-10 rounded-lg" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// ─── ProgressRing ─────────────────────────────────────────────────────────────
export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 71 ? "#10b981" : value >= 41 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      {label && (
        <span className="text-xs text-[var(--text-muted)] text-center">{label}</span>
      )}
    </div>
  );
}