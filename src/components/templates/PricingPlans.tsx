/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useSubscription } from "@/hooks/useSubscription";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useRazorpayLoader } from "@/hooks/useRazorpayLoader";
import { useSubscriptionPolling, useAutoPollPendingSubscription } from "@/hooks/useSubscriptionPolling";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { useCurrentPlanInfo } from "@/hooks/useCurrentPlanInfo";
import { useSubscriptionPendingStatus } from "@/hooks/useSubscriptionPendingStatus";
import toast from "react-simple-toasts";
import {
  Check,
  X,
  Info
} from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";
import { isFeatureUnavailable, personaData, featureIcons, denormalizePlanName } from "@/shared/Utilies";
import { InfoTooltip } from "@/components/atoms/InfoTooltip";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import useModal from "@/hooks/useModal";
import LoginModal from "../ modals/LoginModal";

interface PersonaPlanCardProps {
  plan: MembershipPlan;
  onSelectPlan: (plan: MembershipPlan) => void;
  isCheckoutReady: boolean;
  isProcessing: boolean;
  isThisPlanProcessing: boolean;
  isCurrentPlan: boolean;
  isAuthenticated: boolean;
  showTooltips?: boolean;
  showDescriptions?: boolean;
  isMounted?: boolean;
}

const PersonaPlanCard: React.FC<PersonaPlanCardProps> = ({
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
}) => {
  const isButtonDisabled =  !isCheckoutReady || isProcessing || isCurrentPlan;
  const persona = personaData[plan.label] || {};
  const featureEntries = useMemo(() => mapMembershipPlanLimits(plan), [plan]);

  const getButtonText = (): string => {
    if (isCurrentPlan) {
      return "Your Current Plan";
    }
    if (isThisPlanProcessing) {
      return "Processing...";
    }
    // During SSR or before mount, use plan.ctaLabel to avoid hydration mismatch
    if (!isMounted) {
      return plan.ctaLabel;
    }
    if (!isAuthenticated) {
      return "Signup to Subscribe";
    }
    return plan.ctaLabel;
  };

  return (
    <div
      className={`relative flex flex-col h-full rounded-xl border p-6 shadow-md transition-all duration-300
        ${plan.isPopular ? "border-2 border-blue-500 scale-105" : "border-gray-200 bg-white"}
        ${isCurrentPlan ? "bg-green-50 border-green-400" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-2.5 right-4 rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
          Popular
        </div>
      )}
      {plan.badgeLabel && !plan.isPopular && (
        <div className="absolute -top-2.5 right-4 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-300">
          {plan.badgeLabel}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Plan Title */}
        <h3 className="mb-2 text-2xl font-bold text-gray-900 leading-tight">{persona.persona || plan.label}</h3>

        {/* Price Section */}
        <div className="mb-3 flex items-baseline gap-2 pb-5 border-b border-gray-200">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">{plan.priceText}</span>
          <span className="text-sm font-medium text-gray-500">/ {plan.priceSubtext}</span>
        </div>

        {/* Audience and Description */}
        {persona.audience && (
          <p className="mt-2 text-xs font-semibold text-gray-800 leading-snug">{persona.audience}</p>
        )}
        {persona.description && (
          <p className="mt-3 text-xs text-gray-600 leading-relaxed">
            {persona.description}
          </p>
        )}

        {/* Features Section */}
        <ul className="mt-5 space-y-4">
          {featureEntries.map(feature => {
            const Icon = featureIcons[feature.label] || Check;
            const isUnavailable = isFeatureUnavailable(feature.value);
            const isUnlimited = feature.value === STRING_DATA.UNLIMITED;
            const isNumeric = !feature.isBooleanFeature && !isUnavailable && !isUnlimited;

            const renderValue = () => {
              if (feature.isBooleanFeature) {
                return feature.value === "✅" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                );
              }

              if (isUnavailable) {
                return (
                  <span className="text-xs text-gray-400 font-medium">
                    {feature.value}
                  </span>
                );
              }

              if (isUnlimited) {
                return (
                  <span className="inline-flex items-center px-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 mb-1">
                    {feature.value}
                  </span>
                );
              }

              if (isNumeric) {
                return (
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md text-xs font-bold text-gray-900">
                    {feature.value}
                  </span>
                );
              }

              return (
                <span className="text-xs font-medium text-gray-700">
                  {feature.value}
                </span>
              );
            };

            return (
              <li key={feature.label} className={`flex items-start ${isUnavailable ? "opacity-60" : ""}`}>
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
                    {renderValue()}
                  </div>
                  {showDescriptions && feature.description && (
                    <p className={`text-xs leading-snug ${isUnavailable ? "text-gray-400" : "text-gray-600"}`}>
                      {feature.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isButtonDisabled}
        className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200
          ${isCurrentPlan ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}
          ${isButtonDisabled && !isCurrentPlan ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};


interface PricingPlansV3Props {
  showLegend?: boolean;
  showTooltips?: boolean;
  showDescriptions?: boolean;
  membershipPlans: MembershipPlan[];
}

const PricingPlansV3: React.FC<PricingPlansV3Props> = ({
  showLegend = false,
  showTooltips = true,
  showDescriptions = false,
  membershipPlans,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useIsAuthenticated();
  const router = useRouter();
  const { showModal, openModal, hideModal } = useModal();

  // Prevent hydration mismatch by only using client-side state after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      setTimeout(() => window.location.reload(), 1000);
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

  const getCurrentPlanInfo = useCurrentPlanInfo(subscriptionData);
  const hasActiveSubscription = subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase() === "active";
  const shouldShowLoading = isLoadingSubscription && !hasActiveSubscription;
  const displayMessage = checkoutMessage || loaderMessage;

  const handlePlanSelection = useCallback((plan: MembershipPlan) => {
    if (isActionsDisabled) return;

    if (!isAuthenticated) {
      showModal();
      return;
    }

    // If user have not plan then go with checkout
    if (subscriptionData?.subscriptionData?.tier === STRING_DATA.FREE?.toLowerCase()) {
      initiateCheckout(plan);
      return;
    }

    // User is authenticated but on a paid plan - need to cancel subscription first
    toast(`To switch to the ${plan.label} plan, please cancel your current subscription from your profile settings.`, {
      theme: "info",
      position: "top-center",
    });
    router.push(ROUTE_CONSTANTS.PROFILE + "#membership");

  }, [isActionsDisabled, initiateCheckout, isAuthenticated, getCurrentPlanInfo, router, showModal]);

  const allFeatureDescriptions = useMemo(() => {
    if (!membershipPlans.length) return [];
    const firstPlan = membershipPlans[0];
    const features = mapMembershipPlanLimits(firstPlan);
    const uniqueFeatures = new Map<string, string>();
    features.forEach(feature => {
      if (feature.description && !uniqueFeatures.has(feature.label)) {
        uniqueFeatures.set(feature.label, feature.description);
      }
    });
    return Array.from(uniqueFeatures.entries()).map(([label, description]) => ({
      label,
      description,
    }));
  }, [membershipPlans]);

  return (
    <section className="common-section py-10 bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-1">
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
          {hasSubscriptionError && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm">
              <span className="text-yellow-700">
                ⚠️ Unable to load subscription status. Plan selection may be limited.
              </span>
            </div>
          )}
        </header>

        {membershipPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No membership plans available</p>
            <p className="text-gray-500 text-sm">Please try again later</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
              {membershipPlans.map((plan: MembershipPlan) => {
                const { isCurrentPlan } = getCurrentPlanInfo(plan);
                const isThisPlanProcessing = activePlanId === plan.id;
                const isAnyPlanProcessing = activePlanId !== null;
                return (
                  <PersonaPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelectPlan={handlePlanSelection}
                    isCheckoutReady={isCheckoutReady && !isActionsDisabled}
                    isProcessing={isAnyPlanProcessing}
                    isThisPlanProcessing={isThisPlanProcessing}
                    isCurrentPlan={isCurrentPlan}
                    isAuthenticated={isAuthenticated}
                    showTooltips={showTooltips}
                    showDescriptions={showDescriptions}
                    isMounted={isMounted}
                  />
                );
              })}
            </div>
            {showLegend && allFeatureDescriptions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Feature Definitions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allFeatureDescriptions.map((feature) => {
                      const Icon = featureIcons[feature.label] || Info;
                      return (
                        <div key={feature.label} className="flex items-start gap-2">
                          <Icon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-0.5">
                              {feature.label}:
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {displayMessage ? (
          <p className="text-center text-sm text-gray-500">{displayMessage}</p>
        ) : null}
      </div>
      {openModal && (
        <LoginModal openModal={openModal} hideModal={hideModal} />
      )}
    </section>
  );
};

export default PricingPlansV3;
