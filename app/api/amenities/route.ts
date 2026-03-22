import { NextRequest, NextResponse } from "next/server";
import { fetchAmenities } from "@/lib/overpass";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const data = await fetchAmenities(lat, lon);
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/amenities:", err);
    return NextResponse.json({
      banks: { count: 0, items: [] },
      hospitals: { count: 0, items: [] },
      schools: { count: 0, items: [] },
      transport: { count: 0, items: [] },
      connectivityScore: 0,
    });
  }
}