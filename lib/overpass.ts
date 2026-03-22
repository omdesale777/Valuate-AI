import { PropertyAmenities, AmenityCategory } from "@/types";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function buildQuery(lat: number, lon: number, radiusM: number, filters: string[]): string {
  const filterStr = filters
    .map((f) => `node[${f}](around:${radiusM},${lat},${lon});`)
    .join("\n");
  return `[out:json][timeout:15];\n(${filterStr});\nout body;`;
}

async function fetchCategory(
  lat: number,
  lon: number,
  radiusM: number,
  filters: string[],
  signal: AbortSignal
): Promise<AmenityCategory> {
  const query = buildQuery(lat, lon, radiusM, filters);
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal,
    });
    if (!res.ok) throw new Error("Overpass fetch failed");
    const data = await res.json();
    const elements: { lat: number; lon: number; tags: Record<string, string> }[] =
      data.elements ?? [];
    const items = elements
      .map((e) => ({
        name: e.tags?.name || e.tags?.["name:en"] || "Unnamed",
        distanceM: calculateDistance(lat, lon, e.lat, e.lon),
      }))
      .sort((a, b) => a.distanceM - b.distanceM)
      .slice(0, 5);
    return { count: elements.length, items };
  } catch {
    return { count: 0, items: [] };
  }
}

export function computeConnectivityScore(amenities: PropertyAmenities): number {
  const banks = Math.min(amenities.banks.count, 4) * 5;
  const hospitals = Math.min(amenities.hospitals.count, 3) * 10;
  const schools = Math.min(amenities.schools.count, 4) * 5;
  const transport = Math.min(amenities.transport.count, 3) * 10;
  return Math.min(banks + hospitals + schools + transport, 100);
}

export async function fetchAmenities(lat: number, lon: number): Promise<PropertyAmenities> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const [banks, hospitals, schools, transport] = await Promise.all([
      fetchCategory(lat, lon, 1000, ['"amenity"="bank"', '"amenity"="atm"'], controller.signal),
      fetchCategory(lat, lon, 2000, ['"amenity"="hospital"', '"amenity"="clinic"', '"amenity"="pharmacy"'], controller.signal),
      fetchCategory(lat, lon, 2000, ['"amenity"="school"', '"amenity"="college"', '"amenity"="university"'], controller.signal),
      fetchCategory(lat, lon, 1500, ['"highway"="bus_stop"', '"railway"="station"', '"railway"="halt"'], controller.signal),
    ]);

    const result: PropertyAmenities = { banks, hospitals, schools, transport, connectivityScore: 0 };
    result.connectivityScore = computeConnectivityScore(result);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}