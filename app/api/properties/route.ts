import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

const SELECT_FIELDS =
  "surveyNumber propertyName city locality areaSqFt zoningType status valuation.estimatedValueINR valuation.investmentGrade valuation.confidenceScore createdAt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const city = searchParams.get("city");
    const zoningType = searchParams.get("zoningType");
    const sort = searchParams.get("sort") ?? "newest";

    const filter: Record<string, unknown> = {};
    if (city && city !== "all") filter.city = city;
    if (zoningType && zoningType !== "all") filter.zoningType = zoningType;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    highest: { "valuation.estimatedValueINR": -1 },
    grade: { "valuation.investmentGrade": 1 },
  };
    const sortObj = sortMap[sort] ?? { createdAt: -1 };

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .select(SELECT_FIELDS)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("GET /api/properties:", err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.surveyNumber) return NextResponse.json({ error: "Survey number is required" }, { status: 400 });
    if (!body.city) return NextResponse.json({ error: "City is required" }, { status: 400 });
    if (!body.areaSqFt || body.areaSqFt <= 0) return NextResponse.json({ error: "Valid area is required" }, { status: 400 });

    const exists = await Property.findOne({ surveyNumber: body.surveyNumber.toUpperCase() });
    if (exists) return NextResponse.json({ error: "Survey number already registered" }, { status: 409 });

    const property = await Property.create({
      ...body,
      surveyNumber: body.surveyNumber.toUpperCase(),
      location: body.coordinates
        ? { type: "Point", coordinates: [body.coordinates.lon, body.coordinates.lat] }
        : undefined,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error("POST /api/properties:", err);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}