"use client";
import React, { useMemo, useCallback } from "react";
import MembershipPlanCard from "@/components/atoms/MembershipPlanCard";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";
import { useSubscription } from "@/hooks/useSubscription";
import { denormalizePlanName } from "@/shared/Utilies";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useRazorpayLoader } from "@/hooks/useRazorpayLoader";
import { useSubscriptionPolling } from "@/hooks/useSubscriptionPolling";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { useCurrentPlanInfo } from "@/hooks/useCurrentPlanInfo";
import { useSubscriptionPendingStatus } from "@/hooks/useSubscriptionPendingStatus";
import toast from "react-simple-toasts";

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
  
  const handlePaymentSuccess = useCallback(async (subscriptionId: string) => {
    const isActivated = await pollSubscriptionStatus(subscriptionId);
    
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
  
  const handlePlanSelection = useCallback((plan: MembershipPlan) => {
    if (isActionsDisabled) {
      return;
    }
    initiateCheckout(plan);
  }, [isActionsDisabled, initiateCheckout]);

  const planCards: ReadonlyArray<React.ReactNode> = useMemo(
    () =>
      membershipPlans.map((plan: MembershipPlan) => {
        const { isCurrentPlan } = getCurrentPlanInfo(plan);
        const isThisPlanProcessing = activePlanId === plan.id;
        const isAnyPlanProcessing = activePlanId !== null;
        
        return (
          <MembershipPlanCard
            key={plan.id}
            plan={plan}
            onSelectPlan={handlePlanSelection}
            isCheckoutReady={isCheckoutReady && !isActionsDisabled}
            isProcessing={isAnyPlanProcessing}
            isThisPlanProcessing={isThisPlanProcessing}
            allPlans={membershipPlans}
            isCurrentPlan={isCurrentPlan}
            isLoadingSubscription={isLoadingSubscription}
            isAuthenticated={isAuthenticated}
          />
        );
      }),
    [membershipPlans, activePlanId, handlePlanSelection, isCheckoutReady, isActionsDisabled, isLoadingSubscription, getCurrentPlanInfo, isAuthenticated],
  );

  return (
    <section className="common-section py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
          
          {/* Subscription Pending Warning */}
          {isPending && !isLoadingSubscription && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
              <span className="text-orange-800 font-medium">
                ⏳ {pendingMessage}
              </span>
            </div>
          )}
          
          {/* Current Subscription Status */}
          {subscriptionData?.subscriptionData && !isLoadingSubscription && !isPending && (
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{planCards}</div>
        )}
        {displayMessage ? (
          <p className="text-center text-sm text-gray-500">{displayMessage}</p>
        ) : null}
      </div>
    </section>
  );
};

export default PricingPlans;

