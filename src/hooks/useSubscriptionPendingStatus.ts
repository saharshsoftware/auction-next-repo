import { useMemo } from "react";
import { STRING_DATA } from "@/shared/Constants";

interface SubscriptionData {
  readonly subscription?: {
    readonly status?: string;
  } | null;
}

interface SubscriptionPendingStatus {
  readonly isPending: boolean;
  readonly message: string;
  readonly isActionsDisabled: boolean;
}

/**
 * Custom hook to check if subscription status is pending and handle related UI state
 */
export const useSubscriptionPendingStatus = (
  subscriptionData: { subscriptionData?: SubscriptionData } | null | undefined,
  isLoading: boolean
): SubscriptionPendingStatus => {
  return useMemo(() => {
    if (isLoading || !subscriptionData?.subscriptionData) {
      return {
        isPending: false,
        message: "",
        isActionsDisabled: false,
      };
    }

    const subscriptionStatus = subscriptionData.subscriptionData.subscription?.status?.toLowerCase();
    const isPending = subscriptionStatus === "pending";

    return {
      isPending,
      message: isPending ? STRING_DATA.SUBSCRIPTION_PENDING_MESSAGE : "",
      isActionsDisabled: isPending,
    };
  }, [subscriptionData, isLoading]);
};

