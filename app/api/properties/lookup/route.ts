import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req: NextRequest) {
  try {
    const q = new URL(req.url).searchParams.get("q")?.trim();
    if (!q) return NextResponse.json({ error: "Query required" }, { status: 400 });

    await connectDB();

    const properties = await Property.find({
      $or: [
        { surveyNumber: q.toUpperCase() },
        { surveyNumber: { $regex: q, $options: "i" } },
        { propertyName: { $regex: q, $options: "i" } },
        { locality: { $regex: q, $options: "i" } },
      ],
    })
      .select("-imageAnalysisRaw -__v")
      .limit(5)
      .lean();

    return NextResponse.json({
      properties,
      message: properties.length === 0 ? "No properties found" : undefined,
    });
  } catch (err) {
    console.error("GET /api/properties/lookup:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}