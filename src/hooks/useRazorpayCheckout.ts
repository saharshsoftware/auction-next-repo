import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA, REACT_QUERY } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { createSubscription, getCheckoutConfig } from "@/services/subscription";
import { logInfo, logError } from "@/shared/Utilies";
import toast from "react-simple-toasts";

interface RazorpayOptions {
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly handler: (response: RazorpaySuccessResponse) => void;
  readonly notes?: Record<string, string>;
  readonly redirect?: boolean;
  readonly callback_url?: string;
  readonly prefill?: {
    readonly name?: string;
    readonly email?: string;
    readonly contact?: string;
  };
  readonly theme?: {
    readonly color?: string;
  };
  readonly modal?: {
    readonly ondismiss: () => void;
  };
}

interface RazorpaySuccessResponse {
  readonly razorpay_payment_id: string;
  readonly razorpay_order_id?: string;
  readonly razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: any) => RazorpayInstance;
  }
}

interface UseRazorpayCheckoutParams {
  readonly isCheckoutReady: boolean;
  readonly onPaymentSuccess: (subscriptionId: string, planType: string) => Promise<void>;
}

/**
 * Custom hook to handle Razorpay checkout flow
 */
export const useRazorpayCheckout = ({
  isCheckoutReady,
  onPaymentSuccess
}: UseRazorpayCheckoutParams) => {
  const router = useRouter();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string>(STRING_DATA.EMPTY);

  const initiateCheckout = useCallback(
    async (plan: MembershipPlan) => {
      if (plan.amountInPaise === 0) {
        logInfo("Free plan selected. Redirecting to signup", { planId: plan.id });
        router.push(ROUTE_CONSTANTS.REGISTER);
        return;
      }

      if (!isCheckoutReady || typeof window === "undefined" || !window.Razorpay) {
        setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_LOADING);
        logInfo("Checkout attempted before Razorpay was ready", { planId: plan.id });
        return;
      }

      setCheckoutMessage(STRING_DATA.EMPTY);
      setActivePlanId(plan.id);

      try {
        logInfo("Creating subscription", {
          planId: plan.id,
          razorpayPlanId: plan.razorpayPlanId,
          planType: plan.planType
        });

        const subscriptionResponse = await createSubscription(plan);

        if (!subscriptionResponse.success) {
          throw new Error("Subscription creation failed");
        }

        const { data: subscriptionData } = subscriptionResponse;
        const { subscriptionId } = subscriptionData;

        logInfo("Subscription created, fetching checkout configuration", {
          planId: plan.id,
          subscriptionId,
          customerId: subscriptionData.customerId
        });

        const checkoutResponse = await getCheckoutConfig(subscriptionId);

        if (!checkoutResponse.success) {
          throw new Error("Checkout configuration failed");
        }

        const { data: checkoutConfig } = checkoutResponse;

        logInfo("Opening Razorpay checkout with API config", {
          planId: plan.id,
          createdSubscriptionId: subscriptionId,
          razorpaySubscriptionId: checkoutConfig.subscription_id
        });

        const options: RazorpayOptions = {
          ...checkoutConfig,
          handler: async () => {
            logInfo("Razorpay payment completed", {
              planId: plan.id,
              createdSubscriptionId: subscriptionId,
              razorpaySubscriptionId: checkoutConfig.subscription_id
            });

            toast("Payment successful! Your subscription is being activated...", {
              duration: 4000,
              position: 'top-center',
              theme: 'success',
            });

            try {
              await onPaymentSuccess(subscriptionId, plan.planType);
            } catch (error) {
              setActivePlanId(null);
              logError("Error in payment success handler", error);
              toast("Payment successful! Please refresh the page to see your updated subscription.", {
                duration: 5000,
                position: 'top-center',
                theme: 'success',
              });
            }
          },
          theme: {
            color: checkoutConfig.theme.color,
          },
          modal: {
            ondismiss: () => {
              logInfo("Razorpay checkout closed by user", {
                planId: plan.id,
                subscriptionId,
              });
              setActivePlanId(null);
              toast("Payment cancelled. You can try again anytime.", {
                duration: 3000,
                position: "top-center",
                theme: "warning",
              });
            },
          },
        };

        try {
          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
          razorpayInstance.on("payment.failed", () => {
            setActivePlanId(null);
            logError("Razorpay payment failed", {
              planId: plan.id,
              createdSubscriptionId: subscriptionId,
              razorpaySubscriptionId: checkoutConfig.subscription_id
            });

            toast("Payment failed. Please try again.", {
              duration: 4000,
              position: 'top-center',
              theme: 'failure',
            });
          });
        } catch (error) {
          logError("Failed to open Razorpay checkout", error);
          setActivePlanId(null);
          setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
        }

      } catch (error: any) {
        logError("Failed to initialize subscription checkout", error);
        setActivePlanId(null);
        const errorMessage = error?.message || "Failed to initialize checkout. Please try again.";
        setCheckoutMessage(errorMessage);
        toast(errorMessage, {
          duration: 4000,
          position: 'top-center',
          theme: 'failure',
        });
      }
    },
    [isCheckoutReady, router, onPaymentSuccess],
  );

  return {
    initiateCheckout,
    activePlanId,
    checkoutMessage,
  };
};

