"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MembershipPlanCard from "@/components/atoms/MembershipPlanCard";
import { MEMBERSHIP_PLANS } from "@/shared/MembershipPlans";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

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
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
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

  const initiateRazorpayCheckout = useCallback(
    (plan: MembershipPlan) => {
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
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? FALLBACK_RAZORPAY_KEY_ID;
      if (!keyId) {
        setCheckoutMessage(STRING_DATA.PAYMENT_CONFIGURATION_MISSING);
        logError("Missing Razorpay key configuration", { planId: plan.id });
        return;
      }
      setCheckoutMessage(STRING_DATA.EMPTY);
      setActivePlanId(plan.id);
      logInfo("Opening Razorpay checkout", { planId: plan.id, amount: plan.amountInPaise });
      const options: RazorpayOptions = {
        key: keyId,
        amount: plan.amountInPaise,
        currency: RAZORPAY_CURRENCY,
        name: STRING_DATA.MEMBERSHIP_PLANS,
        description: plan.description,
        callback_url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}`,
        redirect: true,
        notes: {
          planId: plan.id,
        },
        handler: () => {
          setActivePlanId(null);
          logInfo("Razorpay payment completed", { planId: plan.id });
        },
        theme: {
          color: RAZORPAY_THEME_COLOR,
        },
      };
      try {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        razorpayInstance.on("payment.failed", () => {
          setActivePlanId(null);
          logError("Razorpay payment failed", { planId: plan.id });
        });
      } catch (error) {
        logError("Failed to open Razorpay checkout", error);
        setActivePlanId(null);
        setCheckoutMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
      }
    },
    [isCheckoutReady, router],
  );

  const planCards: ReadonlyArray<React.ReactNode> = useMemo(
    () =>
      MEMBERSHIP_PLANS.map((plan: MembershipPlan) => (
        <MembershipPlanCard
          key={plan.id}
          plan={plan}
          onSelectPlan={initiateRazorpayCheckout}
          isCheckoutReady={isCheckoutReady}
          isProcessing={activePlanId === plan.id}
        />
      )),
    [activePlanId, initiateRazorpayCheckout, isCheckoutReady],
  );

  return (
    <section className="common-section py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{planCards}</div>
        {checkoutMessage ? (
          <p className="text-center text-sm text-gray-500">{checkoutMessage}</p>
        ) : null}
      </div>
    </section>
  );
};

export default PricingPlans;

