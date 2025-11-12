"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { MembershipPlanCardProps } from "@/interfaces/Payment";
import { STRING_DATA } from "@/shared/Constants";
import { getIncrementalFeatures } from "@/shared/MembershipUtils";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter } from "next/navigation";

/**
 * Renders a responsive membership plan card.
 */
const MembershipPlanCard: React.FC<MembershipPlanCardProps> = (props) => {
  const { plan, onSelectPlan, isCheckoutReady, isProcessing = false, isThisPlanProcessing = false, allPlans, isCurrentPlan = false, isLoadingSubscription = false, isAuthenticated = false } = props;
  const router = useRouter();
  const limitEntries = getIncrementalFeatures(plan, allPlans);

  const isButtonDisabled = (!isCheckoutReady) || isCurrentPlan || isLoadingSubscription || isProcessing;

  const getPreviousPlanLabel = (previousPlanId?: string): string => {
    if (!previousPlanId || !allPlans) {
      return STRING_DATA.EMPTY;
    }
    const previousPlan = allPlans.find((p) => p.id === previousPlanId);
    return previousPlan?.label ?? STRING_DATA.EMPTY;
  };

  const previousPlanLabel = getPreviousPlanLabel(plan.previousPlanId);

  // Determine button text based on current plan status
  const getButtonText = (): string => {
    if (isLoadingSubscription) {
      return "Loading...";
    }
    if (isCurrentPlan) {
      return "Current Plan";
    }
    return plan.ctaLabel;
  };

  // Determine card styling based on current plan status
  const getCardClassName = (): string => {
    const baseClasses = "flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow transition-all duration-300";

    if (isCurrentPlan) {
      return `${baseClasses} border-green-300 shadow-lg ring-1 ring-green-200`;
    }

    if (plan.isPopular) {
      return `${baseClasses} border-brand-color shadow-lg`;
    }

    return `${baseClasses} border-gray-200`;
  };

  const handleSelectPlan = () => {
    if (isButtonDisabled) {
      return;
    }
    if (!isAuthenticated) {
      router.push(ROUTE_CONSTANTS.LOGIN);
      return;
    }
    onSelectPlan(plan);
  };

  const getMessage = (): string => {
    if (isCurrentPlan) {
      return "You're currently on this plan";
    }
    if (isLoadingSubscription) {
      return "Loading subscription...";
    }
    if (isProcessing && isThisPlanProcessing) {
      return "Processing this subscription...";
    }
    if (isProcessing && !isThisPlanProcessing) {
      return "Processing another subscription...";
    }
    else {
      return STRING_DATA.PAYMENT_LOADING_MESSAGE;
    }
  };

  return (
    <div className={getCardClassName()}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{plan.label}</h3>
          {isCurrentPlan && (
            <span className="rounded-full border border-green-500 bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-700">
              Current Plan
            </span>
          )}
          {plan.badgeLabel && !isCurrentPlan && (
            <span className="rounded-full border border-brand-color bg-brand-color/5 px-2 py-1 text-xs font-semibold text-brand-color">
              {plan.badgeLabel}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{plan.priceText}</span>
        <span className="text-sm text-gray-500">/ {plan.priceSubtext}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-gray-900">
          {previousPlanLabel ? `Includes everything in ${previousPlanLabel}, plus:` : "Includes:"}
        </h4>
        <ul className="flex flex-col gap-2">
          {limitEntries.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5">•</span>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span>{item.label}</span>
                <span className={`font-semibold ${item.isBooleanFeature ? '' : 'text-gray-900'}`}>
                  {item.value}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <ActionButton
          text={getButtonText()}
          customClass="w-full justify-center"
          onclick={handleSelectPlan}
          disabled={isButtonDisabled}
          isLoading={isThisPlanProcessing}
        />
        {isButtonDisabled && (
          <p className="mt-2 text-center text-xs text-gray-500">
            {getMessage()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MembershipPlanCard;

