"use client";
import { AlertCard } from "./AlertCard";

import { SectionHeader } from "./SectionHeader";  
import InstructionAlertSection from "@/components/molecules/InstructionAlertSection";

export interface AlertSectionData {
  id: string;
  name: string;
  assetCategory: string;
  bankName: string;
  location: string;
  maxPrice: number;
  minPrice: number;
  type: string;
  assetType: string;
  matchCount?: number;
}

interface AlertsSectionProps {
  alerts: AlertSectionData[];
  isAuthenticated?: boolean;
  hideSignupButton?: boolean;
}


export function AlertsSection({
  alerts,
  isAuthenticated = false,
  hideSignupButton = false,
}: AlertsSectionProps) {



  if (alerts.length === 0) {
    return (
      <>
        <InstructionAlertSection hideSignupButton={hideSignupButton} isAuthenticated={isAuthenticated} />
      </>
    );
  }

  const gridCols =
    alerts.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionHeader
        title="Your Property"
        highlightedText="Alerts"
        description="Stay ahead of the market with personalized property alerts! Set up alerts for your preferred locations and property types, and never miss out on the perfect investment opportunity."
      />

      <div
        className={`grid grid-cols-1 ${gridCols} gap-6 mb-8 ${
          alerts.length === 1 ? "max-w-md mx-auto" : ""
        }`}
      >
        {alerts.map((alert) => (
          <AlertCard key={alert.id} data={alert} />
        ))}
      </div>
    </>
  );
}
