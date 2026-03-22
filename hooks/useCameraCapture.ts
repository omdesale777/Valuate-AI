"use client";

import { useState, useRef, useCallback } from "react";

interface UseCameraCaptureReturn {
  capturedFile: File | null;
  previewURL: string | null;
  error: string | null;
  triggerCapture: () => void;
  clearCapture: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function useCameraCapture(): UseCameraCaptureReturn {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearCapture = useCallback(() => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    setCapturedFile(null);
    setPreviewURL(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewURL]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB allowed.");
      return;
    }
    setError(null);
    if (previewURL) URL.revokeObjectURL(previewURL);
    const url = URL.createObjectURL(file);
    setCapturedFile(file);
    setPreviewURL(url);
  }, [previewURL]);

  // We expose the onChange handler so the hidden input can be rendered wherever needed
  return {
    capturedFile,
    previewURL,
    error,
    triggerCapture,
    clearCapture,
    fileInputRef: Object.assign(fileInputRef, { onChange: handleFileChange }) as React.RefObject<HTMLInputElement>,
  };
}