"use client";

import { useState, useCallback } from "react";
import { Coordinates } from "@/types";

type PermissionState = "idle" | "requesting" | "granted" | "denied";

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  address: string | null;
  error: string | null;
  isLoading: boolean;
  permissionState: PermissionState;
  requestLocation: () => Promise<void>;
  reset: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>("idle");

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setPermissionState("denied");
      return;
    }

    setIsLoading(true);
    setPermissionState("requesting");
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const coords: Coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      setCoordinates(coords);
      setPermissionState("granted");

      // Reverse geocode
      try {
        const res = await fetch(`/api/geocode/reverse?lat=${coords.lat}&lon=${coords.lon}`);
        const data = await res.json();
        setAddress(data.address);
      } catch {
        setAddress(`${coords.lat.toFixed(4)}°N, ${coords.lon.toFixed(4)}°E`);
      }
    } catch (err) {
      setPermissionState("denied");
      const geoErr = err as GeolocationPositionError;
      const messages: Record<number, string> = {
        1: "Location access denied. Please enter coordinates manually.",
        2: "Location unavailable. Check your GPS settings.",
        3: "Location request timed out. Try again or enter manually.",
      };
      setError(messages[geoErr.code] ?? "Location access failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCoordinates(null);
    setAddress(null);
    setError(null);
    setIsLoading(false);
    setPermissionState("idle");
  }, []);

  return { coordinates, address, error, isLoading, permissionState, requestLocation, reset };
}