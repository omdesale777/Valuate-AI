import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { analyzeProperty } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId required" }, { status: 400 });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (property.siteImageURL) {
      try {
        const imgRes = await fetch(property.siteImageURL);
        const buffer = await imgRes.arrayBuffer();
        imageBase64 = Buffer.from(buffer).toString("base64");
        const ext = property.siteImageURL.split(".").pop()?.toLowerCase() ?? "jpeg";
        imageMimeType =
          ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      } catch {
        // proceed without image
      }
    }

    // Detect rough estimate mode
    const isRoughEstimate = property.areaSqFt <= 1;

    const valuation = await analyzeProperty(
      {
        surveyNumber: property.surveyNumber,
        city: property.city,
        locality: property.locality,
        areaSqFt: isRoughEstimate ? undefined : property.areaSqFt,
        buildingAge: property.buildingAge,
        numberOfFloors: property.numberOfFloors,
        constructionQuality: property.constructionQuality,
        zoningType: property.zoningType,
        ownershipType: property.ownershipType,
        isRoughEstimate,
      },
      imageBase64,
      imageMimeType
    );

    property.valuation = valuation;
    property.status = valuation.estimatedValueINR > 0 ? "verified" : "pending";
    await property.save();

    return NextResponse.json({ ...property.toObject(), isRoughEstimate });
  } catch (err) {
    console.error("POST /api/valuation/analyze:", err);
    return NextResponse.json({ error: "Valuation failed" }, { status: 500 });
  }
}