"use client";
import React, { useMemo, useCallback } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";
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
  Folder,
  BellRing,
  Search,
  MessagesSquare,
  Users
} from "lucide-react";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";

const personaData: { [key: string]: any } = {
    'Free': {
        persona: "For Beginners",
        audience: "Perfect for individuals just starting to explore the world of property auctions.",
        icon: Users
    },
    'Broker': {
        persona: "For Individual Professionals",
        audience: "Designed for solo brokers and agents who need more power and alerts.",
        icon: Users
    },
    'Broker Plus': {
        persona: "For Power Users & Teams",
        audience: "The ultimate package for agencies and serious investors needing premium features.",
        icon: Users
    }
};

const featureIcons: { [key: string]: any } = {
    'Collections': Folder,
    'Alerts': BellRing,
    'Saved searches': Search,
    'WhatsApp & Email Alerts': MessagesSquare,
    'Email Alerts': MessagesSquare,
    'WhatsApp Alerts': MessagesSquare,
};


const PersonaPlanCard: React.FC<{
  plan: MembershipPlan;
  onSelectPlan: (plan: MembershipPlan) => void;
  isCheckoutReady: boolean;
  isProcessing: boolean;
  isThisPlanProcessing: boolean;
  isCurrentPlan: boolean;
  isAuthenticated: boolean;
}> = ({
  plan,
  onSelectPlan,
  isCheckoutReady,
  isProcessing,
  isThisPlanProcessing,
  isCurrentPlan,
  isAuthenticated,
}) => {
  const isButtonDisabled = !isAuthenticated || !isCheckoutReady || isProcessing || isCurrentPlan;
  const persona = personaData[plan.label] || {};
  const featureEntries = useMemo(() => mapMembershipPlanLimits(plan), [plan]);
  
  const getButtonText = (): string => {
    if (isCurrentPlan) {
      return "Your Current Plan";
    }
    if (isThisPlanProcessing) {
      return "Processing...";
    }
    if (!isAuthenticated) {
      return "Login to Subscribe";
    }
    return plan.ctaLabel;
  };

  return (
    <div
      className={`relative flex flex-col h-full rounded-xl border p-5 shadow-md transition-all duration-300
        ${plan.isPopular ? "border-2 border-blue-500 scale-105" : "border-gray-200 bg-white"}
        ${isCurrentPlan ? "bg-green-50 border-green-400" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-2.5 right-3 rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
          Popular
        </div>
      )}
      {plan.badgeLabel && !plan.isPopular && (
        <div className="absolute -top-2.5 right-3 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-300">
          {plan.badgeLabel}
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-blue-600">{persona.persona || plan.label}</h3>
        <p className="mt-1 text-xs text-gray-500">{persona.audience}</p>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">{plan.priceText}</span>
          <span className="text-xs font-medium text-gray-500">/ {plan.priceSubtext}</span>
        </div>

        <ul className="mt-6 space-y-4">
          {featureEntries.map(feature => {
            const Icon = featureIcons[feature.label] || Check;
            return (
              <li key={feature.label} className="flex items-start">
                <Icon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                <div className="ml-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs text-gray-700 font-semibold">{feature.label}:</span>
                    <span className="text-xs text-gray-700 font-medium">{feature.value}</span>
                  </div>
                  {feature.description && (
                    <p className="text-xs text-gray-500 leading-snug">
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
        className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition
          ${isCurrentPlan ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          ${isButtonDisabled && !isCurrentPlan ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};


const PricingPlansV3: React.FC = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useIsAuthenticated();

    const {
        data: membershipPlans = [],
        isLoading: isLoadingPlans,
    } = useMembershipPlans();

    const {
        data: subscriptionData,
        isLoading: isLoadingSubscription,
    } = useSubscription(isAuthenticated);

    const { isReady: isCheckoutReady, message: loaderMessage } = useRazorpayLoader();
    const pollSubscriptionStatus = useSubscriptionPolling(queryClient);
    const { isActionsDisabled } = useSubscriptionPendingStatus(subscriptionData, isLoadingSubscription);

    useAutoPollPendingSubscription(queryClient, subscriptionData, isLoadingSubscription);

    const handlePaymentSuccess = useCallback(async (subscriptionId: string, planType: string) => {
        const isActivated = await pollSubscriptionStatus({
            expectedSubscriptionId: subscriptionId,
            expectedSubscriptionType: planType,
        });
        if (isActivated) {
            toast("Subscription activated successfully!", { theme: 'success' });
            setTimeout(() => window.location.reload(), 1000);
        } else {
            toast("Subscription processing. Please refresh soon.", { theme: 'info' });
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
    const shouldShowLoading = isLoadingSubscription && !(subscriptionData?.subscriptionData?.subscription?.status?.toLowerCase() === "active");

    const handlePlanSelection = useCallback((plan: MembershipPlan) => {
        if (isActionsDisabled) return;
        initiateCheckout(plan);
    }, [isActionsDisabled, initiateCheckout]);

    return (
        <section className="common-section py-10 bg-gray-50">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
                <header className="flex flex-col items-center gap-3 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
                    <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
                </header>

                {isLoadingPlans ? (
                    <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div></div>
                ) : (
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
                                />
                            );
                        })}
                    </div>
                )}
                 {checkoutMessage && <p className="text-center text-sm text-gray-500">{checkoutMessage}</p>}
            </div>
        </section>
    );
};

export default PricingPlansV3;
