import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faInbox } from "@fortawesome/free-solid-svg-icons";
import { AlertCard } from "./AlertCard";

import { SectionHeader } from "./SectionHeader";
import ActionButton from "./ActionButton";

interface Alert {
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
  alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <>
        <SectionHeader
          title="Your Property"
          highlightedText="Alerts"
          description="Stay ahead of the market with personalized property alerts! Set up alerts for your preferred locations and property types, and never miss out on the perfect investment opportunity."
        />

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faInbox} className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Alerts Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first property alert to stay updated on new listings.
          </p>
        </div>
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
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </>
  );
}
