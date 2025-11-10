"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MembershipPlanCard from "@/components/atoms/MembershipPlanCard";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";
import { useSubscription } from "@/hooks/useSubscription";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import toast from "react-simple-toasts";
import { CheckoutApiRequest, CheckoutApiResponse } from "@/interfaces/CheckoutApi";
import { CreateSubscriptionApiRequest, CreateSubscriptionApiResponse } from "@/interfaces/CreateSubscriptionApi";
import { postRequest } from "@/shared/Axios";
import { API_ENPOINTS } from "@/services/api";
import { normalizePlanName, denormalizePlanName } from "@/shared/Utilies";

interface RazorpayOptions {
  readonly key: string;
  readonly amount: number;
  readonly currency: string;
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

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";
const RAZORPAY_CURRENCY = "INR";
const RAZORPAY_THEME_COLOR = "#5356FF";
const CHECKOUT_NOT_READY_MESSAGE = STRING_DATA.PAYMENT_GATEWAY_LOADING;
const FALLBACK_RAZORPAY_KEY_ID = "rzp_test_iRkMr4JvUsPDnx";
const LOG_SCOPE = "[PricingPlans]";

const logInfo = (message: string, extra?: unknown) => {
  if (extra !== undefined) {
    console.info(`${LOG_SCOPE} ${message}`, extra);
    return;
  }
  console.info(`${LOG_SCOPE} ${message}`);
};

const logError = (message: string, extra?: unknown) => {
  if (extra !== undefined) {
    console.error(`${LOG_SCOPE} ${message}`, extra);
    return;
  }
  console.error(`${LOG_SCOPE} ${message}`);
};

/**
 * Displays the pricing plans page with membership information.
 */
const PricingPlans: React.FC = () => {
  const router = useRouter();
  const [isCheckoutReady, setIsCheckoutReady] = useState<boolean>(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>(CHECKOUT_NOT_READY_MESSAGE);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  
  const {
    data: membershipPlans = [],
    isLoading: isLoadingPlans,
    isError: hasPlansError,
    error: plansError
  } = useMembershipPlans();

  // Get subscription data from profile API (via useSubscription hook)
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    isError: hasSubscriptionError,
  } = useSubscription();

  useEffect(() => {
    if (typeof window === "undefined") {
      logInfo("Skipping Razorpay script load on server render");
      return;
    }
    if (window.Razorpay) {
      setIsCheckoutReady(true);
      setCheckoutMessage(STRING_DATA.EMPTY);
      logInfo("Razorpay already available on window");
      return;
    }
    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      const handleLoad = () => {
        setIsCheckoutReady(true);
        setCheckoutMessage(STRING_DATA.EMPTY);
        logInfo("Razorpay script finished loading (existing element)");
      };
      const handleError = () => {
        setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
        logError("Razorpay script failed to load (existing element)");
      };
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.id = RAZORPAY_SCRIPT_ID;
    script.async = true;
    script.onload = () => {
      setIsCheckoutReady(true);
      setCheckoutMessage(STRING_DATA.EMPTY);
      logInfo("Razorpay script successfully loaded");
    };
    script.onerror = () => {
      setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
      logError("Razorpay script failed to load");
    };
    document.body.appendChild(script);
    logInfo("Razorpay script injected", { src: RAZORPAY_SCRIPT_SRC });
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  /**
   * Creates a subscription for the selected plan
   */
  const createSubscription = async (plan: MembershipPlan): Promise<CreateSubscriptionApiResponse> => {
    const requestData: CreateSubscriptionApiRequest = {
      planId: plan.razorpayPlanId,
      planType: plan.planType,
    };

    const response = await postRequest({
      API: API_ENPOINTS.SUBSCRIPTIONS_CREATE,
      DATA: requestData,
    });

    return response.data as CreateSubscriptionApiResponse;
  };

  /**
   * Calls the checkout API to get Razorpay configuration for a subscription
   */
  const getCheckoutConfig = async (subscriptionId: string): Promise<CheckoutApiResponse> => {
    const requestData: CheckoutApiRequest = {
      subscriptionId,
    };

    const response = await postRequest({
      API: API_ENPOINTS.SUBSCRIPTIONS_CHECKOUT,
      DATA: requestData,
    });

    return response.data as CheckoutApiResponse;
  };

  const initiateRazorpayCheckout = useCallback(
    async (plan: MembershipPlan) => {
      if (plan.amountInPaise === 0) {
        logInfo("Free plan selected. Redirecting to signup", { planId: plan.id });
        router.push(ROUTE_CONSTANTS.REGISTER);
        return;
      }
      
      if (!isCheckoutReady || typeof window === "undefined" || !window.Razorpay) {
        setCheckoutMessage(CHECKOUT_NOT_READY_MESSAGE);
        logInfo("Checkout attempted before Razorpay was ready", { planId: plan.id });
        return;
      }

      setCheckoutMessage(STRING_DATA.EMPTY);
      setActivePlanId(plan.id);
      
      try {
        logInfo("Creating subscription", { planId: plan.id, razorpayPlanId: plan.razorpayPlanId, planType: plan.planType });
        
        // Step 1: Create subscription
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
        
        // Step 2: Get checkout configuration using the subscription ID
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
          key: checkoutConfig.key,
          amount: plan.amountInPaise,
          currency: RAZORPAY_CURRENCY,
          name: checkoutConfig.name,
          description: checkoutConfig.description,
          notes: {
            planId: plan.id,
            createdSubscriptionId: subscriptionId,
            razorpaySubscriptionId: checkoutConfig.subscription_id,
          },
          prefill: {
            name: checkoutConfig.prefill.name,
            email: checkoutConfig.prefill.email,
            contact: checkoutConfig.prefill.contact,
          },
          handler: () => {
            setActivePlanId(null);
            logInfo("Razorpay payment completed", { 
              planId: plan.id, 
              createdSubscriptionId: subscriptionId,
              razorpaySubscriptionId: checkoutConfig.subscription_id 
            });
            
            // Show success message
            toast("Payment successful! Your subscription is being activated...", {
              duration: 4000,
              position: 'top-center',
              theme: 'success',
            });
          },
          theme: {
            color: checkoutConfig.theme.color,
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
            
            // Show error message
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
        
      } catch (error) {
        logError("Failed to initialize subscription checkout", error);
        setActivePlanId(null);
        
        // Determine error message based on the type of error
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        let userMessage = "Failed to initialize checkout. Please try again.";
        
        if (errorMessage.includes("Subscription creation failed")) {
          userMessage = "Failed to create subscription. Please try again.";
        } else if (errorMessage.includes("Checkout configuration failed")) {
          userMessage = "Failed to configure payment. Please try again.";
        }
        
        setCheckoutMessage(userMessage);
        toast(userMessage, {
          duration: 4000,
          position: 'top-center',
          theme: 'failure',
        });
      }
    },
    [isCheckoutReady, router],
  );

  // Helper function to determine if a plan is the user's current plan
  const getCurrentPlanInfo = (plan: MembershipPlan) => {
    if (!subscriptionData?.subscriptionData) {
      return { isCurrentPlan: false, currentTier: null };
    }

    const { subscription, tier } = subscriptionData?.subscriptionData;
    
    if (subscription) {
      // User has a paid subscription - match by plan name or ID with normalized comparison
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
      // User is on free tier - match free plan
      const normalizedPlanLabel = normalizePlanName(plan?.label || '');
      const normalizedPlanId = normalizePlanName(plan?.id || '');
      const normalizedTier = normalizePlanName(tier || '');
      
      const isCurrentPlan = plan?.amountInPaise === 0 || 
                           normalizedPlanLabel === normalizedTier || 
                           normalizedPlanId === normalizedTier;
      return { isCurrentPlan, currentTier: tier || "" };
    }
  };

  const planCards: ReadonlyArray<React.ReactNode> = useMemo(
    () =>
      membershipPlans.map((plan: MembershipPlan) => {
        const { isCurrentPlan } = getCurrentPlanInfo(plan);
        
        return (
          <MembershipPlanCard
            key={plan.id}
            plan={plan}
            onSelectPlan={initiateRazorpayCheckout}
            isCheckoutReady={isCheckoutReady}
            isProcessing={activePlanId === plan.id}
            allPlans={membershipPlans}
            isCurrentPlan={isCurrentPlan}
            isLoadingSubscription={isLoadingSubscription}
          />
        );
      }),
    [membershipPlans, activePlanId, initiateRazorpayCheckout, isCheckoutReady, subscriptionData, isLoadingSubscription],
  );

  return (
    <section className="common-section py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
          
          {/* Current Subscription Status */}
          {subscriptionData?.subscriptionData && !isLoadingSubscription && (
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
        {checkoutMessage ? (
          <p className="text-center text-sm text-gray-500">{checkoutMessage}</p>
        ) : null}
      </div>
    </section>
  );
};

export default PricingPlans;

