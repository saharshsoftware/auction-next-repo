"use client";
import React, { useMemo } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { personaData } from "@/shared/Utilies";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";
import { getButtonText, getPlanCardClasses } from "./PricingPlans.helpers";
import { Badge, PriceDisplay, FeatureItem, PlanActionButton, OneTimePriceDisplay } from "./PricingPlans.components";
import { PaymentType } from "../atoms/PaymentTypeTab";

interface PersonaPlanCardProps {
  readonly plan: MembershipPlan;
  readonly onSelectPlan: (plan: MembershipPlan, selectedOptionIndex?: number) => void;
  readonly isCheckoutReady: boolean;
  readonly isProcessing: boolean;
  readonly isThisPlanProcessing: boolean;
  readonly isCurrentPlan: boolean;
  readonly isAuthenticated: boolean;
  readonly showTooltips?: boolean;
  readonly showDescriptions?: boolean;
  readonly isMounted?: boolean;
  readonly paymentType?: PaymentType;
  readonly selectedOptionIndex?: number;
  readonly onOptionChange?: (index: number) => void;
}

export const PersonaPlanCard: React.FC<PersonaPlanCardProps> = ({
  plan,
  onSelectPlan,
  isCheckoutReady,
  isProcessing,
  isThisPlanProcessing,
  isCurrentPlan,
  isAuthenticated,
  showTooltips = false,
  showDescriptions = false,
  isMounted = false,
  paymentType = "subscription",
  selectedOptionIndex = 0,
  onOptionChange,
}) => {
  const isBrokerPlus = plan.label === "Broker Plus";
  const isOneTimePayment = paymentType === "one-time";
  const isButtonDisabled = !isCheckoutReady || isProcessing || isCurrentPlan;
  const persona = personaData[plan.label] || {};
  const featureEntries = useMemo(() => mapMembershipPlanLimits(plan), [plan]);
  const buttonText = getButtonText(
    plan,
    isBrokerPlus,
    isCurrentPlan,
    isThisPlanProcessing,
    isMounted,
    isAuthenticated
  );
  const handleSelectPlan = () => {
    onSelectPlan(plan, isOneTimePayment ? selectedOptionIndex : undefined);
  };

  return (
    <div className={getPlanCardClasses(plan, isCurrentPlan)}>
      {plan.isPopular && <Badge label="Popular" isPopular />}
      {plan.badgeLabel && !plan.isPopular && <Badge label={plan.badgeLabel} />}

      <div className="flex-1 flex flex-col">
        <h3 className="mb-2 text-2xl font-bold text-gray-900 leading-tight">
          {persona.persona || plan.label}
        </h3>

        {isOneTimePayment ? (
          <OneTimePriceDisplay
            plan={plan}
            selectedOptionIndex={selectedOptionIndex}
            onOptionChange={onOptionChange}
          />
        ) : (
          <PriceDisplay plan={plan} isBrokerPlus={isBrokerPlus} />
        )}

        {plan.description && (
          <p className="mt-3 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {plan.description}
          </p>
        )}

        <ul className="mt-5 space-y-4">
          {featureEntries.map(feature => (
            <FeatureItem
              key={feature.label}
              feature={feature}
              showTooltips={showTooltips}
              showDescriptions={showDescriptions}
            />
          ))}
        </ul>
      </div>

      <PlanActionButton
        plan={plan}
        onClick={handleSelectPlan}
        disabled={isButtonDisabled}
        isBrokerPlus={isBrokerPlus}
        isCurrentPlan={isCurrentPlan}
        buttonText={buttonText}
      />
    </div>
  );
};

