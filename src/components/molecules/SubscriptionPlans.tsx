"use client";

import { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import { Plan } from "@/types";
import ActionButton from "../atoms/ActionButton";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import toast from "react-simple-toasts";
import { getCookie } from "cookies-next";
import { postRequest } from "@/shared/Axios";
import { createUserSubscription } from "@/services/subscription";

interface SubscriptionPlansProps {
  plans: Plan[];
}

export default function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  // Process payment
  const handlePayment = async () => {
    if (!userData) {
      console.log({
        title: "User Not Found",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPlan) return;

    const { name, email } = userData;

    // Validate inputs
    if (!name || !email) {
      console.log({
        title: "Missing Information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Selected Plan:", selectedPlan);
    console.log("Customer Details:", userData);
    try {
      // const response = await fetch("/api/create-subscription", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     planId: selectedPlan.razorpayPlanId,
      //     customerEmail: email,
      //     customerName: name,
      //     userId: 15,
      //   }),
      // });

      const orderResponse = await createUserSubscription({
        formData: {
          razorpayPlanId: selectedPlan.razorpayPlanId,
          planId: selectedPlan.id,
        },
      })

      console.log("Order Response:", orderResponse);

      if (orderResponse?.error) {
        throw new Error(
          orderResponse?.error || "Server error while creating subscription."
        );
      }
      if (!orderResponse.success || !orderResponse.subscriptionId) {
        throw new Error(orderResponse.error || "Subscription creation failed.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
        subscription_id: orderResponse.subscriptionId,
        name: "e-auctiondekho",
        amount: selectedPlan.price,
        description: `${selectedPlan.name} Subscription`,
        handler: async (response: any) => {
          const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = response;

          // 1. Verify the payment
          const verificationResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_subscription_id,
              razorpay_payment_id,
              razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();
          if (!verificationData.success) {
            throw new Error(verificationData.error || "Verification failed.");
          }
          // const res = await fetch(`/api/razorpay/subscription/${razorpay_subscription_id}`);
          // const data = await res.json();

          // if (!res.ok) {
          //   throw new Error(data.error || "Failed to fetch subscription details");
          // }

          // const subscription = data.subscription;
          // console.log("Subscription Details:", subscription);
          // if (!subscription) {
          //   throw new Error("Subscription data not found");
          // }

          // const startDate = new Date(subscription.start_at * 1000).toISOString();
          // const endDate = new Date(subscription.current_end * 1000).toISOString();
          // const payload = {
          //   user: "15",
          //   plan: selectedPlan?.id,
          //   razorpaySubId: razorpay_subscription_id,
          //   transactionId: razorpay_payment_id,
          //   status: "active" as SubscriptionStatus, // or the correct one
          //   startDate,
          //   endDate,
          //   duration: 'month' as DurationTypes
          // }
          // // 3. Save in your DB
          // await addRazorpaySubscription(payload);

          console.log({
            title: "Payment Successful!",
            description: "Thank you for your subscription.",
          });
        },

        // prefill: { name, email },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      try {
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (err) {
        throw new Error("Failed to initialize Razorpay.");
      } finally {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      console.log({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    // Load Razorpay script if not already loaded
    loadRazorpayScript();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan?.id === plan.id}
            onSelect={() => setSelectedPlan(plan)}
          />
        ))}
      </div>

      {isSubscribed ? (
        <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-green-700 dark:text-green-300">
            You are currently subscribed to the {plans.find(p => p.id === selectedPlan?.id)?.name} plan
          </p>
        </div>
      ) : (
        <div className="text-center mt-8">
          <ActionButton
            onclick={handlePayment}
            customClass="w-full max-w-md bg-brand-color hover:bg-brand-color/90 text-muted"
            text={STRING_DATA.CONTINUE.toUpperCase()}
          //   isLoading={isPending}
          />
        </div>
      )}
    </div>
  );
}