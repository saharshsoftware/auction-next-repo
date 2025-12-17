import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA, NATIVE_APP_MESSAGE_TYPES, URL_PARAMS } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { createOneTimeOrder, getOneTimeCheckoutConfig } from "@/services/subscription";
import { logInfo, logError, formatShowedPlanPrices } from "@/shared/Utilies";
import toast from "react-simple-toasts";
import { setSubscriptionProcessing } from "@/utils/subscription-storage";
import { isInMobileApp, sendToApp } from "@/helpers/NativeHelper";

interface OneTimeRazorpayOptions {
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly order_id: string;
  readonly amount: number;
  readonly currency: string;
  readonly handler: (response: RazorpaySuccessResponse) => void;
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

interface UseOneTimePaymentCheckoutParams {
  readonly isCheckoutReady: boolean;
  readonly filteredPlans: readonly MembershipPlan[];
}

interface UseOneTimePaymentCheckoutReturn {
  readonly initiateOneTimeCheckout: (plan: MembershipPlan, optionIndex: number) => Promise<void>;
  readonly activePlanId: string | null;
  readonly checkoutMessage: string;
}

/**
 * Custom hook to handle one-time payment checkout flow
 */
export const useOneTimePaymentCheckout = ({
  isCheckoutReady,
  filteredPlans
}: UseOneTimePaymentCheckoutParams): UseOneTimePaymentCheckoutReturn => {
  const router = useRouter();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string>(STRING_DATA.EMPTY);

  const initiateOneTimeCheckout = useCallback(
    async (plan: MembershipPlan, optionIndex: number) => {
      if (!isCheckoutReady || typeof window === "undefined" || !window.Razorpay) {
        setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_LOADING);
        logInfo("Checkout attempted before Razorpay was ready", { planId: plan.id });
        return;
      }

      setCheckoutMessage(STRING_DATA.EMPTY);
      setActivePlanId(plan.id);

      try {
        logInfo("Creating one-time payment order", {
          planId: plan.id,
          apiPlanId: plan.apiId,
          optionIndex,
        });

        const orderResponse = await createOneTimeOrder(plan.apiId, optionIndex);

        if (!orderResponse.success) {
          throw new Error("Order creation failed");
        }

        const { data: orderData } = orderResponse;
        const { orderId } = orderData;

        logInfo("Order created, fetching checkout configuration", {
          planId: plan.id,
          orderId,
        });

        const showedPlan = formatShowedPlanPrices(filteredPlans);
        const notes = showedPlan ? { showedPlan } : undefined;

        const checkoutResponse = await getOneTimeCheckoutConfig(orderId, notes);

        if (!checkoutResponse.success) {
          throw new Error("Checkout configuration failed");
        }

        const { data: checkoutConfig } = checkoutResponse;

        logInfo("Opening Razorpay checkout for one-time payment", {
          planId: plan.id,
          orderId,
        });

        const options: OneTimeRazorpayOptions = {
          key: checkoutConfig.key,
          name: checkoutConfig.name,
          description: checkoutConfig.description,
          order_id: checkoutConfig.order_id,
          amount: checkoutConfig.amount,
          currency: checkoutConfig.currency,
          prefill: checkoutConfig.prefill,
          handler: async (response: RazorpaySuccessResponse) => {
            logInfo("Razorpay one-time payment completed", {
              planId: plan.id,
              orderId,
              paymentId: response.razorpay_payment_id,
            });

            toast("Payment successful! Your plan is being activated...", {
              duration: 4000,
              position: "top-center",
              theme: "success",
            });

            // Set localStorage flag to track processing state
            setSubscriptionProcessing(true);

            // Redirect to payment success page
            const successUrl = isInMobileApp()
              ? `${ROUTE_CONSTANTS.PAYMENT_SUCCESS}?${URL_PARAMS.SOURCE}=${URL_PARAMS.MOBILE_APP}`
              : ROUTE_CONSTANTS.PAYMENT_SUCCESS;
            
            router.push(successUrl);
          },
          theme: {
            color: checkoutConfig.theme.color,
          },
          modal: {
            ondismiss: () => {
              logInfo("Razorpay checkout closed by user", {
                planId: plan.id,
                orderId,
              });
              setActivePlanId(null);
              toast("Payment cancelled. You can try again anytime.", {
                duration: 3000,
                position: "top-center",
                theme: "warning",
              });

              if (isInMobileApp()) {
                sendToApp(NATIVE_APP_MESSAGE_TYPES.PAYMENT_CANCELLED, {
                  message: "Payment cancelled",
                });
              }
            },
          },
        };

        try {
          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
          razorpayInstance.on("payment.failed", () => {
            setActivePlanId(null);
            logError("Razorpay one-time payment failed", {
              planId: plan.id,
              orderId,
            });

            toast("Payment failed. Please try again.", {
              duration: 4000,
              position: "top-center",
              theme: "failure",
            });

            if (isInMobileApp()) {
              sendToApp(NATIVE_APP_MESSAGE_TYPES.PAYMENT_FAILED, {
                message: "Payment failed",
              });
            }
          });
        } catch (error) {
          logError("Failed to open Razorpay checkout", error);
          if (isInMobileApp()) {
            sendToApp(NATIVE_APP_MESSAGE_TYPES.PAYMENT_FAILED, {
              message: "Payment failed",
            });
          }
          setActivePlanId(null);
          setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
        }
      } catch (error: unknown) {
        logError("Failed to initialize one-time payment checkout", error);
        if (isInMobileApp()) {
          sendToApp(NATIVE_APP_MESSAGE_TYPES.PAYMENT_FAILED, {
            message: "Payment failed",
          });
        }
        setActivePlanId(null);
        const errorMessage = error instanceof Error ? error.message : "Failed to initialize checkout. Please try again.";
        setCheckoutMessage(errorMessage);
        toast(errorMessage, {
          duration: 4000,
          position: "top-center",
          theme: "failure",
        });
      }
    },
    [isCheckoutReady, router, filteredPlans]
  );

  return {
    initiateOneTimeCheckout,
    activePlanId,
    checkoutMessage,
  };
};

