export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { "User-Agent": "ValuateAI/1.0 (valuateai@tachyonbyte.com)" },
      }
    );
    if (!res.ok) throw new Error("Nominatim failed");
    const data = await res.json();
    const a = data.address ?? {};
    const parts = [
      a.suburb || a.neighbourhood || a.quarter,
      a.city_district || a.district,
      a.city || a.town || a.village,
      a.state,
    ].filter(Boolean);
    return parts.join(", ") || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
  } catch {
    return `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
  }
}