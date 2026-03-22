"use client";

import { useState, useCallback, useRef } from "react";
import useSWR from "swr";
import { Property, PaginatedResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Filters {
  city: string;
  zoningType: string;
  sort: string;
}

interface UseValuationFeedReturn {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  viewMode: "grid" | "table";
  setViewMode: (m: "grid" | "table") => void;
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  newCount: number;
  clearNewCount: () => void;
}

export function useValuationFeed(): UseValuationFeedReturn {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState<Filters>({ city: "all", zoningType: "all", sort: "newest" });
  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [newCount, setNewCount] = useState(0);
  const prevTotalRef = useRef<number>(0);

  const params = new URLSearchParams({
    page: String(page),
    limit: "12",
    city: filters.city,
    zoningType: filters.zoningType,
    sort: filters.sort,
  });

  const { data, isLoading, error } = useSWR<PaginatedResponse>(
    `/api/properties?${params}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (page === 1) {
          if (prevTotalRef.current > 0 && data.total > prevTotalRef.current) {
            setNewCount(data.total - prevTotalRef.current);
          }
          prevTotalRef.current = data.total;
          setAllProperties(data.properties);
        } else {
          setAllProperties((prev) => {
            const ids = new Set(prev.map((p) => p._id));
            const fresh = data.properties.filter((p) => !ids.has(p._id));
            return [...prev, ...fresh];
          });
        }
      },
    }
  );

  const updateFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
    setAllProperties([]);
    prevTotalRef.current = 0;
  }, []);

  const loadMore = useCallback(() => {
    if (data?.hasMore) setPage((p) => p + 1);
  }, [data]);

  const clearNewCount = useCallback(() => setNewCount(0), []);

  return {
    properties: allProperties,
    isLoading,
    error: error ? "Failed to load valuations" : null,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    loadMore,
    hasMore: data?.hasMore ?? false,
    total: data?.total ?? 0,
    newCount,
    clearNewCount,
  };
}