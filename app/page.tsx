"use client";

import { useState } from "react";
import { Coordinates } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuickCapture from "@/components/sections/QuickCapture";
import PropertyLookup from "@/components/sections/PropertyLookup";
import AddPropertyForm from "@/components/sections/AddPropertyForm";
import LiveValuationFeed from "@/components/sections/LiveValuationFeed";
import NeighborhoodAnalysis from "@/components/sections/NeighborhoodAnalysis";

export default function Home() {
  const [mode, setMode] = useState<"landing" | "dashboard">("landing");
  const [sharedCoordinates, setSharedCoordinates] = useState<Coordinates | undefined>();
  const [prefillSurveyNumber, setPrefillSurveyNumber] = useState("");

  const switchToDashboard = () => {
    setMode("dashboard");
    setTimeout(() => {
      document.getElementById("dashboard-top")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      <Navbar
        onDashboardClick={switchToDashboard}
        showDashboardLink={mode === "landing"}
      />

      {mode === "landing" ? (
        <QuickCapture onSwitchToManual={switchToDashboard} />
      ) : (
        <div id="dashboard-top" className="pt-16">
          <div className="border-b border-[var(--border-subtle)]" />

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
        </div>
      )}
    </main>
  );
}