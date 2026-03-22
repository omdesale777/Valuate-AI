"use client";

import { useState } from "react";
import { Coordinates } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PropertyLookup from "@/components/sections/PropertyLookup";
import AddPropertyForm from "@/components/sections/AddPropertyForm";
import LiveValuationFeed from "@/components/sections/LiveValuationFeed";
import NeighborhoodAnalysis from "@/components/sections/NeighborhoodAnalysis";

export default function Home() {
  const [sharedCoordinates, setSharedCoordinates] = useState<Coordinates | undefined>();
  const [prefillSurveyNumber, setPrefillSurveyNumber] = useState<string>("");

  return (
    <main className="min-h-screen">
      <Navbar />

      <HeroSection />

      <div className="border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px" />
        </div>
      </div>

      <PropertyLookup
        onPrefillSurveyNumber={(s) => {
          setPrefillSurveyNumber(s);
          setTimeout(() => {
            document.getElementById("add-property")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
      />

      <div className="border-t border-[var(--border-subtle)]" />

      <AddPropertyForm
        prefillSurveyNumber={prefillSurveyNumber}
        onValuationComplete={(coords) => {
          if (coords) setSharedCoordinates(coords);
        }}
      />

      <div className="border-t border-[var(--border-subtle)]" />

      <LiveValuationFeed />

      <div className="border-t border-[var(--border-subtle)]" />

      <NeighborhoodAnalysis coordinates={sharedCoordinates} />

      <Footer />
    </main>
  );
}