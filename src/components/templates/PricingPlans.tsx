/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useSubscriptionFlow } from "@/hooks/useSubscriptionFlow";
import { Info } from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";
import { featureIcons, denormalizePlanName } from "@/shared/Utilies";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import useModal from "@/hooks/useModal";
import LoginModal from "../ modals/LoginModal";
import InfoModal from "../ modals/InfoModal";
import { PersonaPlanCard } from "./PersonaPlanCard";

interface PricingPlansProps {
  readonly showLegend?: boolean;
  readonly showTooltips?: boolean;
  readonly showDescriptions?: boolean;
  readonly membershipPlans: MembershipPlan[];
}

const PricingPlans: React.FC<PricingPlansProps> = ({
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
  const { showModal: showInfoModal, openModal: openInfoModal, hideModal: hideInfoModal } = useModal();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const {
    subscriptionData,
    isLoadingSubscription,
    hasSubscriptionError,
    isCheckoutReady,
    loaderMessage,
    isPending,
    pendingMessage,
    isActionsDisabled,
    initiateCheckout,
    activePlanId,
    checkoutMessage,
    getCurrentPlanInfo,
  } = useSubscriptionFlow({
    isAuthenticated,
    queryClient,
  });
  
  const hasActiveSubscription = subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase() === "active";
  const shouldShowLoading = isLoadingSubscription && !hasActiveSubscription;
  const displayMessage = checkoutMessage || loaderMessage;
  
  const handlePlanSelection = useCallback((plan: MembershipPlan) => {
    if (plan.label === STRING_DATA.BROKER_PLUS) {
      router.push(ROUTE_CONSTANTS.PARTNER);
      return;
    }
    
    if (isActionsDisabled) return;
    
    if (!isAuthenticated) {
      showModal();
      return;
    }
    
    const currentTier = subscriptionData?.subscriptionData?.tier?.toLowerCase();
    const isFreePlan = currentTier === STRING_DATA.FREE?.toLowerCase();
    
    if (isFreePlan) {
      initiateCheckout(plan);
      return;
    }
    
    const { isCurrentPlan } = getCurrentPlanInfo(plan);
    if (!isCurrentPlan) {
      showInfoModal();
      return;
    }
  }, [isActionsDisabled, initiateCheckout, isAuthenticated, getCurrentPlanInfo, router, showModal, showInfoModal, subscriptionData]);
  
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
    <section className="px-4 lg:px-16 py-10 bg-gray-50">
      <div className="mx-auto flex w-full flex-col gap-8 px-1">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {STRING_DATA.MEMBERSHIP_PLANS}
          </h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">
            {STRING_DATA.MEMBERSHIP_DESCRIPTION}
          </p>
          
          {isPending && !shouldShowLoading && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
              <span className="text-orange-800 font-medium">
                ⏳ {pendingMessage}
              </span>
            </div>
          )}
          
          {subscriptionData?.subscriptionData && !shouldShowLoading && !isPending && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm">
              <span className="text-blue-700">
                Current plan: <strong>
                  {denormalizePlanName(subscriptionData.subscriptionData.subscription?.planName || subscriptionData.subscriptionData.tier || '')}
                </strong>
              </span>
            </div>
          )}
          
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
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
      {openInfoModal && (
        <InfoModal
          openModal={openInfoModal}
          hideModal={hideInfoModal}
          message="Want to switch plans? You'll need to cancel your current one first. You can then choose a new plan when your billing period ends."
        />
      )}
    </section>
  );
};

export default PricingPlans;
