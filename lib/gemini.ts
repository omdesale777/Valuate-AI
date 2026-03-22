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
  surveyNumber: string;
  city: string;
  locality?: string;
  areaSqFt: number;
  buildingAge?: number;
  numberOfFloors?: number;
  constructionQuality?: number;
  zoningType?: string;
  ownershipType?: string;
}

export async function analyzeProperty(
  propertyData: PropertyData,
  imageBase64?: string,
  imageMimeType?: string
): Promise<PropertyValuation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `You are a senior industrial property valuation expert in India with 20 years of experience in Maharashtra real estate markets (Nashik, Mumbai, Pune industrial corridors).

Analyze the following property and generate a precise market valuation.

PROPERTY DATA:
- Survey Number: ${propertyData.surveyNumber}
- City: ${propertyData.city}${propertyData.locality ? ", " + propertyData.locality : ""}
- Total Area: ${propertyData.areaSqFt} sq ft (${Math.round(propertyData.areaSqFt * 0.0929)} sq m)
- Building Age: ${propertyData.buildingAge ?? "Unknown"} years
- Floors: ${propertyData.numberOfFloors ?? 1}
- Self-Rated Quality: ${propertyData.constructionQuality ?? "Not rated"}/5
- Zoning: ${propertyData.zoningType ?? "Industrial"}
- Ownership: ${propertyData.ownershipType ?? "Freehold"}

MARKET CONTEXT (2024-25 Maharashtra industrial rates):
- Nashik MIDC: ₹800–2,500/sqft
- Pune industrial corridors: ₹1,500–4,500/sqft
- Mumbai suburban industrial: ₹3,000–8,000/sqft

TASKS:
1. Estimate current market value in INR. Be precise and realistic.
2. Provide a valuation range (low/high).
3. Estimate monthly rental value.
4. Calculate annual rental yield as percentage.
5. Assign investment grade: A (excellent ROI, prime location), B+ (good), B (fair), C (below average), D (distressed).
6. Confidence score 0-100 based on data completeness.
7. List 4-6 specific, actionable insights about this property.
8. List any risk flags (or empty array if none).

Respond ONLY with valid JSON, no markdown, no explanation:
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

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as PropertyValuation;

    // Validate required fields
    if (
      typeof parsed.estimatedValueINR !== "number" ||
      typeof parsed.investmentGrade !== "string"
    ) {
      throw new Error("Invalid Gemini response structure");
    }

    return parsed;
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return FALLBACK_VALUATION;
  }
}