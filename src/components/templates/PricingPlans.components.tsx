"use client";
import React from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { Check, X } from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";
import { isFeatureUnavailable, featureIcons } from "@/shared/Utilies";
import { InfoTooltip } from "@/components/atoms/InfoTooltip";
import ActionButton from "@/components/atoms/ActionButton";
import { getActionButtonClasses } from "./PricingPlans.helpers";

// ============================================================================
// Badge Component
// ============================================================================

interface BadgeProps {
  readonly label: string;
  readonly isPopular?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ label, isPopular = false }) => {
  if (isPopular) {
    return (
      <div className="absolute -top-2.5 right-4 rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
        Popular
      </div>
    );
  }

  return (
    <div className="absolute -top-2.5 right-4 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-300">
      {label}
    </div>
  );
};

// ============================================================================
// PriceDisplay Component
// ============================================================================

interface PriceDisplayProps {
  readonly plan: MembershipPlan;
  readonly isBrokerPlus: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ plan, isBrokerPlus }) => {
  if (isBrokerPlus) {
    return (
      <div className="mb-3 flex items-baseline gap-2 pb-5 border-b border-gray-200">
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">Custom</span>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-baseline gap-2 pb-5 border-b border-gray-200">
      <span className="text-3xl font-extrabold tracking-tight text-gray-900">{plan.priceText}</span>
      <span className="text-sm font-medium text-gray-500">/ {plan.priceSubtext}</span>
    </div>
  );
};

// ============================================================================
// FeatureValue Component
// ============================================================================

interface FeatureValueProps {
  readonly value: string;
  readonly isBooleanFeature: boolean;
  readonly isUnavailable: boolean;
  readonly isUnlimited: boolean;
  readonly isNumeric: boolean;
}

export const FeatureValue: React.FC<FeatureValueProps> = ({
  value,
  isBooleanFeature,
  isUnavailable,
  isUnlimited,
  isNumeric,
}) => {
  if (isBooleanFeature) {
    return value === "✅" ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    );
  }

  if (isUnavailable) {
    return (
      <span className="text-xs text-gray-400 font-medium">
        {value}
      </span>
    );
  }

  if (isUnlimited) {
    return (
      <span className="inline-flex items-center px-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 mb-1">
        {value}
      </span>
    );
  }

  if (isNumeric) {
    return (
      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md text-xs font-bold text-gray-900">
        {value}
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-gray-700">
      {value}
    </span>
  );
};

// ============================================================================
// FeatureItem Component
// ============================================================================

interface FeatureItemProps {
  readonly feature: ReturnType<typeof mapMembershipPlanLimits>[number];
  readonly showTooltips: boolean;
  readonly showDescriptions: boolean;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ feature, showTooltips, showDescriptions }) => {
  const Icon = featureIcons[feature.label] || Check;
  const isUnavailable = isFeatureUnavailable(feature.value);
  const isUnlimited = feature.value === STRING_DATA.UNLIMITED;
  const isNumeric = !feature.isBooleanFeature && !isUnavailable && !isUnlimited;

  return (
    <li className={`flex items-start ${isUnavailable ? "opacity-60" : ""}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isUnavailable ? "text-gray-400" : "text-green-500"}`} />
      <div className="ml-2.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isUnavailable ? "text-gray-500" : "text-gray-700"}`}>
              {feature.label}:
            </span>
            {showTooltips && feature.description && (
              <InfoTooltip
                content={feature.description}
                position="top"
                iconClassName="h-3.5 w-3.5"
              />
            )}
          </div>
          <FeatureValue
            value={feature.value}
            isBooleanFeature={feature.isBooleanFeature}
            isUnavailable={isUnavailable}
            isUnlimited={isUnlimited}
            isNumeric={isNumeric}
          />
        </div>
        {showDescriptions && feature.description && (
          <p className={`text-xs leading-snug ${isUnavailable ? "text-gray-400" : "text-gray-600"}`}>
            {feature.description}
          </p>
        )}
      </div>
    </li>
  );
};

// ============================================================================
// PlanActionButton Component
// ============================================================================

interface PlanActionButtonProps {
  readonly plan: MembershipPlan;
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly isBrokerPlus: boolean;
  readonly isCurrentPlan: boolean;
  readonly buttonText: string;
}

export const PlanActionButton: React.FC<PlanActionButtonProps> = ({
  onClick,
  disabled,
  isBrokerPlus,
  isCurrentPlan,
  buttonText,
}) => {
  const buttonClasses = getActionButtonClasses(isCurrentPlan, isBrokerPlus, disabled);
  const isButtonDisabled = disabled && !isBrokerPlus;
  
  return (
    <ActionButton
      text={buttonText}
      onclick={onClick}
      disabled={isButtonDisabled}
      customClass={`w-full !max-w-full ${buttonClasses}`}
      isActionButton={false}
    />
  );
};

