"use client";

import { ArrowRight } from "lucide-react";
import { PropertyFormData } from "@/types";
import { Button } from "@/components/ui/index";
import {
  FormField, TextInput, TextareaInput, SelectInput,
  UnitToggle, NumberStepper, StarRating, TagSelector,
} from "@/components/ui/FormComponents";

const CITY_OPTIONS = [
  { value: "Nashik", label: "🏭 Nashik" },
  { value: "Mumbai", label: "🌆 Mumbai" },
  { value: "Pune", label: "🏙️ Pune" },
];

const ZONING_OPTIONS = ["Industrial", "Commercial", "Mixed", "Warehousing"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Government"];

interface Props {
  formData: PropertyFormData;
  formErrors: Record<string, string | undefined>;
  onUpdate: (field: keyof PropertyFormData, value: unknown) => void;
  onNext: () => void;
}

export default function Step1PropertyDetails({ formData, formErrors, onUpdate, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Survey Number */}
      <FormField label="Survey Number" required error={formErrors.surveyNumber}>
        <TextInput
          value={formData.surveyNumber}
          onChange={(v) => onUpdate("surveyNumber", v.toUpperCase())}
          placeholder="e.g. MH-NK-2024-0087"
          mono
          error={formErrors.surveyNumber}
        />
      </FormField>

      {/* Property Name */}
      <FormField label="Property Name / Description" hint="Optional — helps identify the property">
        <TextareaInput
          value={formData.propertyName}
          onChange={(v) => onUpdate("propertyName", v)}
          placeholder="e.g. Satpur MIDC Warehouse Unit B"
          maxLength={200}
        />
      </FormField>

      {/* City + Locality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="City" required error={formErrors.city}>
          <SelectInput
            value={formData.city}
            onChange={(v) => onUpdate("city", v)}
            options={CITY_OPTIONS}
            placeholder="Select city..."
            error={formErrors.city}
          />
        </FormField>
        <FormField label="Locality / Area Name" hint="MIDC, industrial zone, etc.">
          <TextInput
            value={formData.locality}
            onChange={(v) => onUpdate("locality", v)}
            placeholder="e.g. Satpur MIDC"
          />
        </FormField>
      </div>

      {/* Area + Floors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UnitToggle
          valueSqFt={formData.areaSqFt}
          onChange={(v) => onUpdate("areaSqFt", v)}
          label="Total Area"
          error={formErrors.areaSqFt}
        />
        <NumberStepper
          value={formData.numberOfFloors}
          onChange={(v) => onUpdate("numberOfFloors", v)}
          min={1}
          max={20}
          label="Number of Floors"
        />
      </div>

      {/* Building Age */}
      <FormField label="Building Age (Years)">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-geist-mono text-sm text-blue-400 font-bold">
              {formData.buildingAge === 0 ? "New construction" : `${formData.buildingAge} years`}
            </span>
            {formData.buildingAge > 40 && (
              <span className="text-xs text-amber-400">⚠️ Older building</span>
            )}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={formData.buildingAge}
            onChange={(e) => onUpdate("buildingAge", parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>New</span><span>50 years</span><span>100+ years</span>
          </div>
        </div>
      </FormField>

      {/* Construction Quality + Zoning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StarRating
          value={formData.constructionQuality}
          onChange={(v) => onUpdate("constructionQuality", v)}
          label="Construction Quality"
        />
        <TagSelector
          options={ZONING_OPTIONS}
          value={formData.zoningType}
          onChange={(v) => onUpdate("zoningType", v as string)}
          label="Zoning Type"
          multi={false}
        />
      </div>

      {/* Ownership */}
      <TagSelector
        options={OWNERSHIP_OPTIONS}
        value={formData.ownershipType}
        onChange={(v) => onUpdate("ownershipType", v as string)}
        label="Ownership Type"
        multi={false}
      />

      {/* Next button */}
      <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
        <Button
          onClick={onNext}
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Continue to Site Capture
        </Button>
      </div>
    </div>
  );
}