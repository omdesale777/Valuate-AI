"use client";

import { XCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <XCircle className="w-16 h-16 text-red-400" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">{error.message}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white rounded-xl text-sm font-medium transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}