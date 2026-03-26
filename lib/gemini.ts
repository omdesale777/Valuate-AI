import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { PropertyValuation } from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error("❌ GEMINI_API_KEY is not defined in .env.local");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const FALLBACK_VALUATION: PropertyValuation = {
  estimatedValueINR: 0,
  valuationRangeLow: 0,
  valuationRangeHigh: 0,
  monthlyRentalINR: 0,
  annualYieldPercent: 0,
  investmentGrade: "C",
  confidenceScore: 0,
  aiInsights: ["Automated analysis unavailable. Please retry."],
  riskFlags: [],
};

interface PropertyData {
  surveyNumber?: string;
  city?: string;
  locality?: string;
  areaSqFt?: number;
  buildingAge?: number;
  numberOfFloors?: number;
  constructionQuality?: number;
  zoningType?: string;
  ownershipType?: string;
  isRoughEstimate?: boolean;
}

export async function analyzeProperty(
  propertyData: PropertyData,
  imageBase64?: string,
  imageMimeType?: string
): Promise<PropertyValuation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const isRough = propertyData.isRoughEstimate || !propertyData.areaSqFt;

    const prompt = isRough
      ? `You are a senior industrial property valuation expert in India with 20 years of experience in Maharashtra real estate (Nashik, Mumbai, Pune).

A site photo has been submitted with GPS location data. Generate a ROUGH valuation estimate based primarily on the photo and location.

AVAILABLE DATA:
- City: ${propertyData.city || "Maharashtra (exact city unknown)"}
- Locality: ${propertyData.locality || "Unknown"}
- Area: Not provided — estimate from photo if possible
- Zoning: Industrial (assumed)

IMPORTANT: This is a rough estimate. Be honest about uncertainty. Use wide valuation ranges.

MARKET CONTEXT (2024-25 Maharashtra industrial rates):
- Nashik MIDC: Rs 800-2500/sqft
- Pune industrial corridors: Rs 1500-4500/sqft
- Mumbai suburban industrial: Rs 3000-8000/sqft

TASKS:
1. Visually estimate the property size from the photo
2. Assess construction quality from visual cues
3. Generate rough market value estimate in INR
4. Provide wide valuation range (high uncertainty)
5. Assign investment grade based on visual assessment
6. Set confidence score LOW (20-50) since data is limited
7. List 3-5 insights based purely on visual analysis
8. Note any visible risk factors

Respond ONLY with valid JSON, no markdown:
{
  "estimatedValueINR": number,
  "valuationRangeLow": number,
  "valuationRangeHigh": number,
  "monthlyRentalINR": number,
  "annualYieldPercent": number,
  "investmentGrade": "A" or "B+" or "B" or "C" or "D",
  "confidenceScore": number,
  "aiInsights": ["string"],
  "riskFlags": ["string"]
}`
      : `You are a senior industrial property valuation expert in India with 20 years of experience in Maharashtra real estate markets (Nashik, Mumbai, Pune industrial corridors).

Analyze the following property and generate a precise market valuation.

PROPERTY DATA:
- Survey Number: ${propertyData.surveyNumber || "Not provided"}
- City: ${propertyData.city || "Maharashtra"}${propertyData.locality ? ", " + propertyData.locality : ""}
- Total Area: ${propertyData.areaSqFt} sq ft (${Math.round((propertyData.areaSqFt || 0) * 0.0929)} sq m)
- Building Age: ${propertyData.buildingAge ?? "Unknown"} years
- Floors: ${propertyData.numberOfFloors ?? 1}
- Self-Rated Quality: ${propertyData.constructionQuality ?? "Not rated"}/5
- Zoning: ${propertyData.zoningType ?? "Industrial"}
- Ownership: ${propertyData.ownershipType ?? "Freehold"}

MARKET CONTEXT (2024-25 Maharashtra industrial rates):
- Nashik MIDC: Rs 800-2500/sqft
- Pune industrial corridors: Rs 1500-4500/sqft
- Mumbai suburban industrial: Rs 3000-8000/sqft

Respond ONLY with valid JSON, no markdown:
{
  "estimatedValueINR": number,
  "valuationRangeLow": number,
  "valuationRangeHigh": number,
  "monthlyRentalINR": number,
  "annualYieldPercent": number,
  "investmentGrade": "A" or "B+" or "B" or "C" or "D",
  "confidenceScore": number,
  "aiInsights": ["string"],
  "riskFlags": ["string"]
}`;

    const parts: (string | Part)[] = [prompt];

    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType as "image/jpeg" | "image/png" | "image/webp",
        },
      });
    }

    const result = await model.generateContent(parts);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as PropertyValuation;

    if (typeof parsed.estimatedValueINR !== "number" || typeof parsed.investmentGrade !== "string") {
      throw new Error("Invalid Gemini response structure");
    }

    return parsed;
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return FALLBACK_VALUATION;
  }
}