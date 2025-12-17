"use client";
import React from "react";

export type PaymentType = "subscription" | "one-time";

interface PaymentTypeTabProps {
  readonly activeTab: PaymentType;
  readonly onTabChange: (tab: PaymentType) => void;
}

/**
 * Toggle-style tab component for switching between Subscription and One-time payment modes
 */
export const PaymentTypeTab: React.FC<PaymentTypeTabProps> = ({
  activeTab,
  onTabChange,
}) => {
  const isSubscriptionActive = activeTab === "subscription";
  return (
    <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onTabChange("subscription")}
        className={`
          px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
          ${isSubscriptionActive
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
          }
        `}
        aria-pressed={isSubscriptionActive}
      >
        Subscription
      </button>
      <button
        type="button"
        onClick={() => onTabChange("one-time")}
        className={`
          px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
          ${!isSubscriptionActive
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
          }
        `}
        aria-pressed={!isSubscriptionActive}
      >
        One time payment
      </button>
    </div>
  );
};

export default PaymentTypeTab;
