import React from "react";
import { OneTimeOptionData } from "@/interfaces/UserProfileApi";

interface OneTimePaymentDetailsProps {
  readonly oneTimeOptionData: OneTimeOptionData;
}

/**
 * Displays one-time payment option details including display name, duration, and pricing.
 */
const OneTimePaymentDetails: React.FC<OneTimePaymentDetailsProps> = ({ oneTimeOptionData }) => {
  const { displayName, duration, durationUnit, discountedPrice, price } = oneTimeOptionData;
  const hasDiscount = price > discountedPrice;

  return (
    <div className="bg-purple-50 rounded-lg p-3 space-y-1">
      <p className="text-sm font-medium text-purple-900">
        {displayName}
      </p>
      <p className="text-xs text-purple-700">
        Duration: {duration} {durationUnit}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-purple-900">
          ₹{discountedPrice?.toLocaleString()}
        </span>
        {hasDiscount && (
          <span className="text-xs text-purple-600 line-through">
            ₹{price?.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default OneTimePaymentDetails;

