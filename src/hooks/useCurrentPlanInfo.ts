import { useCallback } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { normalizePlanName } from "@/shared/Utilies";

interface SubscriptionData {
  readonly subscription?: {
    readonly planName?: string;
    readonly planId?: string;
  } | null;
  readonly tier?: string;
}

interface CurrentPlanInfo {
  readonly isCurrentPlan: boolean;
  readonly currentTier: string | null;
}

/**
 * Custom hook to determine if a plan is the user's current plan
 */
export const useCurrentPlanInfo = (subscriptionData: { subscriptionData?: SubscriptionData } | null | undefined) => {
  return useCallback((plan: MembershipPlan): CurrentPlanInfo => {
    if (!subscriptionData?.subscriptionData) {
      return { isCurrentPlan: false, currentTier: null };
    }

    const { subscription, tier } = subscriptionData.subscriptionData;

    if (subscription) {
      const normalizedPlanLabel = normalizePlanName(plan?.label || '');
      const normalizedPlanId = normalizePlanName(plan?.id || '');
      const normalizedSubscriptionPlanName = normalizePlanName(subscription?.planName || '');
      const normalizedSubscriptionPlanId = normalizePlanName(subscription?.planId || '');

      const isCurrentPlan = normalizedPlanLabel === normalizedSubscriptionPlanName ||
        normalizedPlanId === normalizedSubscriptionPlanName ||
        normalizedPlanLabel === normalizedSubscriptionPlanId ||
        normalizedPlanId === normalizedSubscriptionPlanId;
      return { isCurrentPlan, currentTier: subscription?.planName || "" };
    } else {
      const normalizedPlanLabel = normalizePlanName(plan?.label || '');
      const normalizedPlanId = normalizePlanName(plan?.id || '');
      const normalizedTier = normalizePlanName(tier || '');

      const isCurrentPlan = plan?.amountInPaise === 0 ||
        normalizedPlanLabel === normalizedTier ||
        normalizedPlanId === normalizedTier;
      return { isCurrentPlan, currentTier: tier || "" };
    }
  }, [subscriptionData]);
};

