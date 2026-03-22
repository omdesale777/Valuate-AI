"use client";

import { useState, useCallback } from "react";
import { PropertyFormData, Coordinates, Property } from "@/types";

const defaultFormData: PropertyFormData = {
  surveyNumber: "",
  propertyName: "",
  description: "",
  city: "",
  locality: "",
  areaSqFt: "",
  buildingAge: 0,
  numberOfFloors: 1,
  constructionQuality: 3,
  zoningType: "",
  ownershipType: "",
};

interface FormErrors {
  surveyNumber?: string;
  city?: string;
  areaSqFt?: string;
}

interface UsePropertyFormReturn {
  currentStep: 1 | 2 | 3;
  formData: PropertyFormData;
  isSubmitting: boolean;
  submissionError: string | null;
  valuatedProperty: Property | null;
  formErrors: FormErrors;
  updateField: (field: keyof PropertyFormData, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateStep1: () => boolean;
  submitProperty: (coordinates?: Coordinates, imageFile?: File) => Promise<void>;
  resetForm: () => void;
}

export function usePropertyForm(): UsePropertyFormReturn {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<PropertyFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [valuatedProperty, setValuatedProperty] = useState<Property | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const updateField = useCallback((field: keyof PropertyFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validateStep1 = useCallback((): boolean => {
    const errors: FormErrors = {};
    if (!formData.surveyNumber.trim()) {
      errors.surveyNumber = "Survey number is required";
    } else if (!/^[A-Z0-9\-]+$/i.test(formData.surveyNumber)) {
      errors.surveyNumber = "Only letters, numbers, and hyphens allowed";
    }
    if (!formData.city) errors.city = "City is required";
    if (!formData.areaSqFt || Number(formData.areaSqFt) <= 0) {
      errors.areaSqFt = "Valid area in sq ft is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3);
  }, [currentStep, validateStep1]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3);
  }, []);

  const submitProperty = useCallback(
    async (coordinates?: Coordinates, imageFile?: File) => {
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        // 1. Upload image if provided
        let siteImageURL: string | undefined;
        if (imageFile) {
          const fd = new FormData();
          fd.append("file", imageFile);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
          if (!uploadRes.ok) throw new Error("Image upload failed");
          const { url } = await uploadRes.json();
          siteImageURL = url;
        }

        // 2. Create property record
        const createRes = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            areaSqFt: Number(formData.areaSqFt),
            siteImageURL,
            coordinates,
          }),
        });
        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.error || "Failed to create property");
        }
        const created = await createRes.json();

        // 3. Trigger Gemini valuation
        const valuationRes = await fetch("/api/valuation/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: created._id }),
        });
        if (!valuationRes.ok) throw new Error("Valuation analysis failed");
        const valuated = await valuationRes.json();

        setValuatedProperty(valuated);
        setCurrentStep(3);
      } catch (err) {
        setSubmissionError(err instanceof Error ? err.message : "Submission failed");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setIsSubmitting(false);
    setSubmissionError(null);
    setValuatedProperty(null);
    setFormErrors({});
  }, []);

  return {
    currentStep,
    formData,
    isSubmitting,
    submissionError,
    valuatedProperty,
    formErrors,
    updateField,
    nextStep,
    prevStep,
    validateStep1,
    submitProperty,
    resetForm,
  };
}