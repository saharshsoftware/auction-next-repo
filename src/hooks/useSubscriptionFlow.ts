/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { UserProfileApiResponse } from "@/interfaces/UserProfileApi";
import { useSubscription } from "./useSubscription";
import { useRazorpayLoader } from "./useRazorpayLoader";
import { useSubscriptionPolling, useAutoPollPendingSubscription } from "./useSubscriptionPolling";
import { useRazorpayCheckout } from "./useRazorpayCheckout";
import { useCurrentPlanInfo } from "./useCurrentPlanInfo";
import { useSubscriptionPendingStatus } from "./useSubscriptionPendingStatus";
import { clearSubscriptionProcessing } from "@/utils/subscription-storage";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { URL_PARAMS } from "@/shared/Constants";
import { isInMobileApp } from "@/helpers/NativeHelper";
import toast from "react-simple-toasts";

interface UseSubscriptionFlowParams {
  readonly isAuthenticated: boolean;
  readonly queryClient: ReturnType<typeof useQueryClient>;
  readonly initialProfileData?: UserProfileApiResponse | null;
}

interface UseSubscriptionFlowReturn {
  readonly subscriptionData: ReturnType<typeof useSubscription>["data"];
  readonly isLoadingSubscription: boolean;
  readonly hasSubscriptionError: boolean;
  readonly isCheckoutReady: boolean;
  readonly loaderMessage: string;
  readonly isPending: boolean;
  readonly pendingMessage: string;
  readonly isActionsDisabled: boolean;
  readonly initiateCheckout: (plan: MembershipPlan) => void;
  readonly activePlanId: string | null;
  readonly checkoutMessage: string;
  readonly getCurrentPlanInfo: ReturnType<typeof useCurrentPlanInfo>;
  readonly handlePaymentSuccess: (subscriptionId: string, planType: string, razorpaySubscriptionId: string) => Promise<void>;
}

/**
 * Custom hook to manage subscription flow logic
 * Groups all subscription-related state and handlers
 */
export const useSubscriptionFlow = ({
  isAuthenticated,
  queryClient,
  initialProfileData = null,
}: UseSubscriptionFlowParams): UseSubscriptionFlowReturn => {
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    isError: hasSubscriptionError,
  } = useSubscription(isAuthenticated, initialProfileData);
  
  const { isReady: isCheckoutReady, message: loaderMessage } = useRazorpayLoader();
  const pollSubscriptionStatus = useSubscriptionPolling(queryClient);
  const { isPending, message: pendingMessage, isActionsDisabled } = useSubscriptionPendingStatus(
    subscriptionData,
    isLoadingSubscription
  );
  
  useAutoPollPendingSubscription(queryClient, subscriptionData, isLoadingSubscription);
  
  const handlePaymentSuccess = useCallback(async (subscriptionId: string, planType: string, razorpaySubscriptionId: string) => {
    const isActivated = await pollSubscriptionStatus({
      expectedSubscriptionId: subscriptionId,
      expectedSubscriptionType: planType,
      expectedRazorpaySubscriptionId: razorpaySubscriptionId,
    });
    if (isActivated) {
      // Clear localStorage flag when subscription is successfully activated
      clearSubscriptionProcessing();
      
      toast("Subscription activated successfully!", {
        duration: 4000,
        position: 'top-center',
        theme: 'success',
      });
      const successUrl = isInMobileApp()
        ? `${ROUTE_CONSTANTS.PAYMENT_SUCCESS}?${URL_PARAMS.SOURCE}=${URL_PARAMS.MOBILE_APP}`
        : ROUTE_CONSTANTS.PAYMENT_SUCCESS;
      window.location.href = successUrl;
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
  
  return {
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
    handlePaymentSuccess,
  };
};
