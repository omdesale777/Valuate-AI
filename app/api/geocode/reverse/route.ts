import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/nominatim";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const address = await reverseGeocode(lat, lon);
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ address: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E` });
  }
}