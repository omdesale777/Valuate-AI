import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const property = await Property.findById(params.id).select("-imageAnalysisRaw -__v").lean();
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    console.error("GET /api/properties/[id]:", err);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}