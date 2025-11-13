"use client";
import React, { useMemo, useCallback } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";
import { useSubscription } from "@/hooks/useSubscription";
import { denormalizePlanName } from "@/shared/Utilies";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useRazorpayLoader } from "@/hooks/useRazorpayLoader";
import { useSubscriptionPolling, useAutoPollPendingSubscription } from "@/hooks/useSubscriptionPolling";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { useCurrentPlanInfo } from "@/hooks/useCurrentPlanInfo";
import { useSubscriptionPendingStatus } from "@/hooks/useSubscriptionPendingStatus";
import toast from "react-simple-toasts";
import { Check, X } from "lucide-react";
import {
  Folder,
  BellRing,
  Search,
  MessagesSquare
} from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  [STRING_DATA.MEMBERSHIP_COLLECTIONS]: Folder,
  [STRING_DATA.MEMBERSHIP_ALERTS]: BellRing,
  [STRING_DATA.MEMBERSHIP_SAVED_SEARCHES]: Search,
  [STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS]: MessagesSquare,
  [STRING_DATA.MEMBERSHIP_EMAIL_ALERTS]: MessagesSquare,
  "WhatsApp & Email Alerts": MessagesSquare,
};

// Note: The following simple components are defined here for now.
// In future, consider moving them to src/components/atoms for reuse and clarity.

interface SimplifiedPlanCardProps {
  plan: MembershipPlan;
  onSelectPlan: (plan: MembershipPlan) => void;
  isCheckoutReady: boolean;
  isProcessing: boolean;
  isThisPlanProcessing: boolean;
  isCurrentPlan: boolean;
  isLoadingSubscription: boolean;
  isAuthenticated: boolean;
}

/**
 * A simplified card to display essential plan information.
 */
const SimplifiedPlanCard: React.FC<SimplifiedPlanCardProps> = ({
  plan,
  onSelectPlan,
  isCheckoutReady,
  isProcessing,
  isThisPlanProcessing,
  isCurrentPlan,
  isLoadingSubscription,
  isAuthenticated,
}) => {
  const isButtonDisabled = !isAuthenticated || !isCheckoutReady || isProcessing || isCurrentPlan || isLoadingSubscription;
  const featureEntries = useMemo(() => mapMembershipPlanLimits(plan), [plan]);
  const displayedFeatures = useMemo(() => featureEntries.slice(0, 4), [featureEntries]);

  const getButtonText = (): string => {
    if (isCurrentPlan) {
      return "Current Plan";
    }
    if (isThisPlanProcessing) {
      return "Processing...";
    }
    if (isLoadingSubscription || isProcessing) {
      return "Please wait";
    }
    if (!isAuthenticated) {
      return "Login to Subscribe";
    }
    return plan.ctaLabel;
  };

  const renderFeatureValue = (value: string, isBooleanFeature: boolean): React.ReactNode => {
    if (!isBooleanFeature) {
      return <span className="font-semibold text-gray-800">{value}</span>;
    }
    return value === "✅" ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl border p-6 shadow-lg transition-transform hover:scale-105
        ${isCurrentPlan ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}
        ${plan.isPopular ? "border-2 border-blue-500" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 right-4 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
          {STRING_DATA.MEMBERSHIP_POPULAR_BADGE}
        </div>
      )}
      {plan.badgeLabel && !plan.isPopular && (
        <div className="absolute -top-3 right-4 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-300">
          {plan.badgeLabel}
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800">{plan.label}</h3>
        <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.priceText}</span>
          <span className="text-sm font-medium text-gray-500">/ {plan.priceSubtext}</span>
        </div>
        <ul className="mt-6 flex flex-col gap-4">
          {displayedFeatures.map((feature) => {
            const Icon = featureIcons[feature.label] || Check;
            return (
              <li key={feature.label} className="flex items-start">
                <Icon className="h-6 w-6 flex-shrink-0 text-gray-600 mt-0.5" />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm text-gray-700 font-semibold">{feature.label}:</span>
                    <span className="flex-shrink-0 text-sm text-gray-700 font-medium">
                      {renderFeatureValue(feature.value, feature.isBooleanFeature)}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {featureEntries.length > displayedFeatures.length && (
          <p className="mt-3 text-xs text-gray-500">{STRING_DATA.MEMBERSHIP_MORE_FEATURES}</p>
        )}
      </div>
      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isButtonDisabled}
        className={`mt-6 w-full rounded-lg px-4 py-2.5 text-center font-semibold text-white shadow-sm transition
          ${isCurrentPlan
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
          }
          ${isButtonDisabled && !isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

/**
 * A table for detailed feature comparison across all plans.
 */
type PlanFeature = ReturnType<typeof mapMembershipPlanLimits>[number];

const FeatureComparisonTable: React.FC<{ plans: ReadonlyArray<MembershipPlan> }> = ({ plans }) => {
  const featureLookup = useMemo<Record<string, ReadonlyArray<PlanFeature>>>(() => {
    return plans.reduce<Record<string, ReadonlyArray<PlanFeature>>>((accumulator, plan) => {
      accumulator[plan.id] = mapMembershipPlanLimits(plan);
      return accumulator;
    }, {});
  }, [plans]);

  const allFeatureNames = useMemo(() => {
    const featureSet = new Set<string>();
    Object.values(featureLookup).forEach((features) => {
      features.forEach((feature) => {
        featureSet.add(feature.label);
      });
    });
    return Array.from(featureSet);
  }, [featureLookup]);

  const renderComparisonValue = (feature: PlanFeature | undefined): React.ReactNode => {
    if (!feature) {
      return <X className="h-5 w-5 text-red-500 mx-auto" />;
    }
    if (!feature.isBooleanFeature) {
      return <span className="font-semibold text-gray-800">{feature.value}</span>;
    }
    return feature.value === "✅" ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-red-500 mx-auto" />
    );
  };

  return (
    <div className="mt-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{STRING_DATA.MEMBERSHIP_COMPARE_HEADING}</h2>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {STRING_DATA.MEMBERSHIP_FEATURES_HEADER}
            </th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                {plan.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {allFeatureNames.map((featureName) => {
            const firstPlanFeature = Object.values(featureLookup)[0]?.find((entry) => entry.label === featureName);
            return (
              <tr key={featureName} className="group">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <span>{featureName}</span>
                    {firstPlanFeature?.description && (
                      <span className="relative flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02c.192-.043.351-.26.298-.45l-1.46-5.842a.75.75 0 00-.71-.513H12c-.414 0-.672.41-.491.752zM12 21a9 9 0 100-18 9 9 0 000 18z"
                          />
                        </svg>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 rounded-md bg-gray-800 px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          {firstPlanFeature.description}
                        </span>
                      </span>
                    )}
                  </div>
                </td>
                {plans.map((plan) => {
                  const feature = featureLookup[plan.id]?.find((entry) => entry.label === featureName);
                  return (
                    <td key={`${plan.id}-${featureName}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {renderComparisonValue(feature)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Displays the pricing plans page with membership information.
 */

const PricingPlans: React.FC = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useIsAuthenticated();
  
  const {
    data: membershipPlans = [],
    isLoading: isLoadingPlans,
    isError: hasPlansError,
    error: plansError
  } = useMembershipPlans();

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    isError: hasSubscriptionError,
  } = useSubscription(isAuthenticated);

  const { isReady: isCheckoutReady, message: loaderMessage } = useRazorpayLoader();
  const pollSubscriptionStatus = useSubscriptionPolling(queryClient);
  
  const { isPending, message: pendingMessage, isActionsDisabled } = useSubscriptionPendingStatus(
    subscriptionData,
    isLoadingSubscription
  );

  // Auto-poll when subscription status is pending on page load
  useAutoPollPendingSubscription(queryClient, subscriptionData, isLoadingSubscription);
  
  const handlePaymentSuccess = useCallback(async (subscriptionId: string, planType: string) => {
    const isActivated = await pollSubscriptionStatus({
      expectedSubscriptionId: subscriptionId,
      expectedSubscriptionType: planType,
    });
    
    if (isActivated) {
      toast("Subscription activated successfully!", {
        duration: 4000,
        position: 'top-center',
        theme: 'success',
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast("Subscription is being processed. Please refresh the page in a few moments.", {
        duration: 5000,
        position: 'top-center',
        theme: 'success',
      });
    }
  }, [pollSubscriptionStatus]);

  const { 
    initiateCheckout, 
    activePlanId,
    checkoutMessage 
  } = useRazorpayCheckout({
    isCheckoutReady: isCheckoutReady && !isActionsDisabled,
    onPaymentSuccess: handlePaymentSuccess,
  });

  const displayMessage = checkoutMessage || loaderMessage;

  const getCurrentPlanInfo = useCurrentPlanInfo(subscriptionData);
  
  // Don't show loading if we have active subscription data
  const hasActiveSubscription = subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase() === "active";
  const shouldShowLoading = isLoadingSubscription && !hasActiveSubscription;
  
  const handlePlanSelection = useCallback((plan: MembershipPlan) => {
    if (isActionsDisabled) {
      return;
    }
    initiateCheckout(plan);
  }, [isActionsDisabled, initiateCheckout]);

  return (
    <section className="common-section py-10 bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
          
          {/* Subscription Pending Warning */}
          {isPending && !shouldShowLoading && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
              <span className="text-orange-800 font-medium">
                ⏳ {pendingMessage}
              </span>
            </div>
          )}
          
          {/* Current Subscription Status */}
          {subscriptionData?.subscriptionData && !shouldShowLoading && !isPending && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm">
              <span className="text-blue-700">
                Current plan: <strong>
                  {denormalizePlanName(subscriptionData.subscriptionData.subscription?.planName || subscriptionData.subscriptionData.tier || '')}
                </strong>
              </span>
            </div>
          )}
          
          {/* Subscription Error Warning */}
          {hasSubscriptionError && !isLoadingPlans && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm">
              <span className="text-yellow-700">
                ⚠️ Unable to load subscription status. Plan selection may be limited.
              </span>
            </div>
          )}
        </header>
        {isLoadingPlans ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading membership plans...</p>
            </div>
          </div>
        ) : hasPlansError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">Failed to load membership plans</p>
            <p className="text-gray-500 text-sm">{plansError?.message || "Please try again later"}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
              {membershipPlans.map((plan: MembershipPlan) => {
                const { isCurrentPlan } = getCurrentPlanInfo(plan);
                const isThisPlanProcessing = activePlanId === plan.id;
                const isAnyPlanProcessing = activePlanId !== null;

                return (
                  <SimplifiedPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelectPlan={handlePlanSelection}
                    isCheckoutReady={isCheckoutReady && !isActionsDisabled}
                    isProcessing={isAnyPlanProcessing}
                    isThisPlanProcessing={isThisPlanProcessing}
                    isCurrentPlan={isCurrentPlan}
                    isLoadingSubscription={shouldShowLoading}
                    isAuthenticated={isAuthenticated}
                  />
                );
              })}
            </div>
            <FeatureComparisonTable plans={membershipPlans} />
          </>
        )}
        {displayMessage ? (
          <p className="text-center text-sm text-gray-500">{displayMessage}</p>
        ) : null}
      </div>
    </section>
  );
};

export default PricingPlans;

