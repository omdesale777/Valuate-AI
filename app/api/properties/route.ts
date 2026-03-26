export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    // Auto-generate survey number if not provided (rough estimate mode)
    if (!body.surveyNumber) {
      const cityCode = (body.city as string).substring(0, 2).toUpperCase();
      body.surveyNumber = `MH-${cityCode}-QUICK-${Date.now()}`;
    }

    // Default area to 0 if not provided (rough estimate)
    if (!body.areaSqFt || body.areaSqFt <= 0) {
      body.areaSqFt = 1;
      body.isRoughEstimate = true;
    }

    const exists = await Property.findOne({
      surveyNumber: body.surveyNumber.toUpperCase(),
    });
    if (exists) {
      return NextResponse.json(
        { error: "Survey number already registered" },
        { status: 409 }
      );
    }

    const property = await Property.create({
      ...body,
      surveyNumber: body.surveyNumber.toUpperCase(),
      location: body.coordinates
        ? {
            type: "Point",
            coordinates: [body.coordinates.lon, body.coordinates.lat],
          }
        : undefined,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error("POST /api/properties:", err);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}