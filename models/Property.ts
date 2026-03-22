import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProperty extends Document {
  surveyNumber: string;
  propertyName?: string;
  description?: string;
  city: "Nashik" | "Mumbai" | "Pune";
  locality?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  reverseGeoAddress?: string;
  areaSqFt: number;
  buildingAge?: number;
  numberOfFloors?: number;
  constructionQuality?: number;
  zoningType?: string;
  ownershipType?: string;
  siteImageURL?: string;
  imageAnalysisRaw?: string;
  valuation?: {
    estimatedValueINR: number;
    valuationRangeLow: number;
    valuationRangeHigh: number;
    monthlyRentalINR: number;
    annualYieldPercent: number;
    investmentGrade: string;
    confidenceScore: number;
    aiInsights: string[];
    riskFlags: string[];
  };
  amenities?: {
    banks: { count: number; items: { name: string; distanceM: number }[] };
    hospitals: { count: number; items: { name: string; distanceM: number }[] };
    schools: { count: number; items: { name: string; distanceM: number }[] };
    transport: { count: number; items: { name: string; distanceM: number }[] };
    connectivityScore: number;
  };
  status: "pending" | "verified" | "flagged";
  submittedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AmenityItemSchema = new Schema(
  { name: String, distanceM: Number },
  { _id: false }
);

const AmenityCategorySchema = new Schema(
  { count: Number, items: [AmenityItemSchema] },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    surveyNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    propertyName: { type: String, trim: true },
    description: { type: String, maxlength: 500 },
    city: {
      type: String,
      enum: ["Nashik", "Mumbai", "Pune"],
      required: true,
    },
    locality: { type: String, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
    reverseGeoAddress: { type: String },
    areaSqFt: { type: Number, required: true, min: 1 },
    buildingAge: { type: Number, min: 0, max: 200 },
    numberOfFloors: { type: Number, min: 1, max: 100 },
    constructionQuality: { type: Number, min: 1, max: 5 },
    zoningType: {
      type: String,
      enum: ["Industrial", "Commercial", "Mixed", "Warehousing"],
    },
    ownershipType: {
      type: String,
      enum: ["Freehold", "Leasehold", "Government"],
    },
    siteImageURL: { type: String },
    imageAnalysisRaw: { type: String },
    valuation: {
      estimatedValueINR: Number,
      valuationRangeLow: Number,
      valuationRangeHigh: Number,
      monthlyRentalINR: Number,
      annualYieldPercent: Number,
      investmentGrade: {
        type: String,
        enum: ["A", "B+", "B", "C", "D"],
      },
      confidenceScore: { type: Number, min: 0, max: 100 },
      aiInsights: [String],
      riskFlags: [String],
    },
    amenities: {
      banks: AmenityCategorySchema,
      hospitals: AmenityCategorySchema,
      schools: AmenityCategorySchema,
      transport: AmenityCategorySchema,
      connectivityScore: Number,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "flagged"],
      default: "pending",
    },
    submittedBy: { type: String },
  },
  { timestamps: true }
);

// Indexes
PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({ surveyNumber: "text", propertyName: "text", locality: "text" });
PropertySchema.index({ city: 1, status: 1 });
PropertySchema.index({ createdAt: -1 });

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);

export default Property;