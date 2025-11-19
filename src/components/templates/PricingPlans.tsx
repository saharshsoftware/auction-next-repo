/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA, REACT_QUERY } from "@/shared/Constants";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useSubscriptionFlow } from "@/hooks/useSubscriptionFlow";
import { useImmediatePollingOnCheckout } from "@/hooks/useSubscriptionPolling";
import { Info } from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";
import { featureIcons, denormalizePlanName } from "@/shared/Utilies";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import useModal from "@/hooks/useModal";
import LoginModal from "../ modals/LoginModal";
import InfoModal from "../ modals/InfoModal";
import ContactSalesModal from "../ modals/ContactSalesModal";
import { PersonaPlanCard } from "./PersonaPlanCard";
import { SubscriptionPendingScreen } from "./SubscriptionPendingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileApiResponse } from "@/interfaces/UserProfileApi";
import { 
  isSubscriptionProcessing, 
  clearSubscriptionProcessing,
  subscribeToSubscriptionProcessing,
} from "@/utils/subscription-storage";

interface PricingPlansProps {
  readonly showLegend?: boolean;
  readonly showTooltips?: boolean;
  readonly showDescriptions?: boolean;
  readonly membershipPlans: MembershipPlan[];
  readonly initialSubscriptionStatus?: string | null;
  readonly hasServerSubscriptionSnapshot?: boolean;
  readonly initialUserProfile?: UserProfileApiResponse | null;
}

const PricingPlans: React.FC<PricingPlansProps> = ({
  showLegend = false,
  showTooltips = true,
  showDescriptions = false,
  membershipPlans,
  initialSubscriptionStatus = null,
  hasServerSubscriptionSnapshot = false,
  initialUserProfile = null,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showLocalStorageProcessing, setShowLocalStorageProcessing] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useIsAuthenticated();
  const router = useRouter();
  const { showModal, openModal, hideModal } = useModal();
  const { showModal: showInfoModal, openModal: openInfoModal, hideModal: hideInfoModal } = useModal();
  const { showModal: showContactSalesModal, openModal: openContactSalesModal, hideModal: hideContactSalesModal } = useModal();
  const { fullProfileData } = useUserProfile(isAuthenticated, initialUserProfile);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Start immediate polling if localStorage flag is set (right after checkout)
  useImmediatePollingOnCheckout(queryClient, isAuthenticated);

  // Sync localStorage processing flag with component state
  useEffect(() => {
    if (!isMounted || !isAuthenticated) return;

    const applyProcessingState = (isProcessing: boolean) => {
      setShowLocalStorageProcessing(isProcessing);
      if (isProcessing) {
        queryClient.invalidateQueries({ queryKey: [REACT_QUERY.USER_PROFILE] });
      }
    };

    applyProcessingState(isSubscriptionProcessing());

    const unsubscribe = subscribeToSubscriptionProcessing(applyProcessingState);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'subscriptionProcessing') {
        applyProcessingState(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, [isMounted, isAuthenticated, queryClient]);

  
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
    initialProfileData: initialUserProfile,
  });

  // Clear localStorage flag when subscription becomes active
  useEffect(() => {
    const subscriptionStatus = subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase();
    if (showLocalStorageProcessing && subscriptionStatus === "active") {
      clearSubscriptionProcessing();
      setShowLocalStorageProcessing(false);
    }
  }, [showLocalStorageProcessing, subscriptionData]);
  
  const subscriptionStatus = subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase();
  const hasActiveSubscription = isAuthenticated && subscriptionStatus === "active";
  const shouldShowLoading = isLoadingSubscription && !hasActiveSubscription;
  const displayMessage = checkoutMessage || loaderMessage;
  const shouldShowInitialPending = isAuthenticated && hasServerSubscriptionSnapshot && isLoadingSubscription;

  const getInfoModalMessage = () => {
    let message: string = 'Want to switch plans? You\'ll need to cancel your current one first. ';
    if (fullProfileData?.subscriptionDetails?.subscription?.status?.toLowerCase() === "trial") {
      return message;
    }
    return `${message} You can then choose a new plan when your billing period ends.`;
  };
  
  const handlePlanSelection = useCallback((plan: MembershipPlan) => {
    if (plan.label === STRING_DATA.BROKER_PLUS) {
      showContactSalesModal();
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
  }, [isActionsDisabled, initiateCheckout, isAuthenticated, getCurrentPlanInfo, router, showModal, showInfoModal, subscriptionData, showContactSalesModal]);
  
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
  
  if (shouldShowInitialPending) {
    return <SubscriptionPendingScreen pendingMessage={STRING_DATA.SUBSCRIPTION_PENDING_MESSAGE} />;
  }

  // Show localStorage-based processing screen
  if (showLocalStorageProcessing && isAuthenticated && !hasActiveSubscription) {
    return (
      <SubscriptionPendingScreen 
        pendingMessage="Your subscription is being activated. This may take up to 5 minutes." 
      />
    );
  }

  if (isAuthenticated && isPending && !shouldShowLoading) {
    return <SubscriptionPendingScreen pendingMessage={pendingMessage} />;
  }

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
          
          {isAuthenticated && subscriptionData?.subscriptionData && !shouldShowLoading && (
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
                const shouldHighlightPlan = isAuthenticated && isCurrentPlan;
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
                    isCurrentPlan={shouldHighlightPlan}
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
          message={getInfoModalMessage()}
        />
      )}
      {openContactSalesModal && (
        <ContactSalesModal
          openModal={openContactSalesModal}
          hideModal={hideContactSalesModal}
          initialPhoneNumber={fullProfileData?.username || ""}
          userData={fullProfileData as UserProfileApiResponse}
        />
      )}
    </section>
  );
};

export default PricingPlans;
