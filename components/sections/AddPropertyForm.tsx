"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, Camera, Sparkles, Check } from "lucide-react";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { Coordinates } from "@/types";
import Step1PropertyDetails from "@/components/forms/Step1PropertyDetails";
import Step2SiteCapture from "@/components/forms/Step2SiteCapture";
import Step3ValuationOutput from "@/components/forms/Step3ValuationOutput";

const STEPS = [
  { id: 1, label: "Property Details", icon: Building2 },
  { id: 2, label: "Site Capture", icon: Camera },
  { id: 3, label: "AI Valuation", icon: Sparkles },
];

interface Props {
  prefillSurveyNumber?: string;
  onValuationComplete?: (coords?: Coordinates) => void;
}

export default function AddPropertyForm({ prefillSurveyNumber, onValuationComplete }: Props) {
  const form = usePropertyForm();

  // Prefill survey number if provided from lookup
  if (prefillSurveyNumber && !form.formData.surveyNumber) {
    form.updateField("surveyNumber", prefillSurveyNumber);
  }

  const handleSubmit = async (coords?: Coordinates, imageFile?: File) => {
    await form.submitProperty(coords, imageFile);
    onValuationComplete?.(coords);
  };

  return (
    <section id="add-property" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2 font-medium">
            New Valuation
          </p>
          <h2 className="text-3xl font-bold text-white mb-3">Add New Property</h2>
          <p className="text-[var(--text-secondary)]">
            Complete the form below to generate an AI-powered industrial property valuation.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isComplete = form.currentStep > step.id;
            const isActive = form.currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isComplete
                      ? "bg-blue-600 border-blue-600"
                      : isActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-[var(--border-subtle)] bg-transparent"
                  }`}>
                    {isComplete ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-[var(--text-muted)]"}`} />
                    )}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <span className={`text-xs whitespace-nowrap hidden sm:block ${isActive ? "text-white font-medium" : "text-[var(--text-muted)]"}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 transition-all duration-500 ${form.currentStep > step.id ? "bg-blue-600" : "bg-[var(--border-subtle)]"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl border-l-4 border-l-blue-500 border border-[var(--border-subtle)] p-6 md:p-8">
          <AnimatePresence mode="wait">
            {form.currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Step1PropertyDetails
                  formData={form.formData}
                  formErrors={form.formErrors}
                  onUpdate={form.updateField}
                  onNext={form.nextStep}
                />
              </motion.div>
            )}
            {form.currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Step2SiteCapture
                  onBack={form.prevStep}
                  onSubmit={handleSubmit}
                  isSubmitting={form.isSubmitting}
                />
              </motion.div>
            )}
            {form.currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Step3ValuationOutput
                  isSubmitting={form.isSubmitting}
                  submissionError={form.submissionError}
                  valuatedProperty={form.valuatedProperty}
                  onReset={form.resetForm}
                  onRetry={() => form.prevStep()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}