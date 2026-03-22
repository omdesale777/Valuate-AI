import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (!amount || isNaN(amount)) return "₹0";
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatINRFull(amount: number): string {
  if (!amount || isNaN(amount)) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function sqFtToSqM(sqft: number): number {
  return Math.round(sqft * 0.0929 * 100) / 100;
}

export function sqMToSqFt(sqm: number): number {
  return Math.round(sqm * 10.764);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd MMM yyyy, hh:mm a");
  } catch {
    return dateStr;
  }
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    "B+": "text-blue-400 bg-blue-400/10 border-blue-400/30",
    B: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    C: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    D: "text-red-400 bg-red-400/10 border-red-400/30",
  };
  return map[grade] ?? "text-neutral-400 bg-neutral-400/10 border-neutral-400/30";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    verified: "text-emerald-400 bg-emerald-400/10",
    pending: "text-amber-400 bg-amber-400/10",
    flagged: "text-red-400 bg-red-400/10",
  };
  return map[status] ?? "text-neutral-400 bg-neutral-400/10";
}

export function getCityColor(city: string): string {
  const map: Record<string, string> = {
    Nashik: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Mumbai: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Pune: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return map[city] ?? "text-neutral-400 bg-neutral-400/10";
}