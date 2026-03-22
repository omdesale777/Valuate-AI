export type InvestmentGrade = "A" | "B+" | "B" | "C" | "D";
export type PropertyStatus = "pending" | "verified" | "flagged";
export type CityName = "Nashik" | "Mumbai" | "Pune";
export type ZoningType = "Industrial" | "Commercial" | "Mixed" | "Warehousing";
export type OwnershipType = "Freehold" | "Leasehold" | "Government";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AmenityItem {
  name: string;
  distanceM: number;
}

export interface AmenityCategory {
  count: number;
  items: AmenityItem[];
}

export interface PropertyAmenities {
  banks: AmenityCategory;
  hospitals: AmenityCategory;
  schools: AmenityCategory;
  transport: AmenityCategory;
  connectivityScore: number;
}

export interface PropertyValuation {
  estimatedValueINR: number;
  valuationRangeLow: number;
  valuationRangeHigh: number;
  monthlyRentalINR: number;
  annualYieldPercent: number;
  investmentGrade: InvestmentGrade;
  confidenceScore: number;
  aiInsights: string[];
  riskFlags: string[];
}

export interface Property {
  _id: string;
  surveyNumber: string;
  propertyName?: string;
  description?: string;
  city: CityName;
  locality?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  reverseGeoAddress?: string;
  areaSqFt: number;
  buildingAge?: number;
  numberOfFloors?: number;
  constructionQuality?: number;
  zoningType?: ZoningType;
  ownershipType?: OwnershipType;
  siteImageURL?: string;
  valuation?: PropertyValuation;
  amenities?: PropertyAmenities;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  surveyNumber: string;
  propertyName: string;
  description: string;
  city: CityName | "";
  locality: string;
  areaSqFt: number | "";
  buildingAge: number;
  numberOfFloors: number;
  constructionQuality: number;
  zoningType: ZoningType | "";
  ownershipType: OwnershipType | "";
  coordinates?: Coordinates;
  siteImage?: File;
}

export interface PaginatedResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface LookupResponse {
  properties: Property[];
  message?: string;
}