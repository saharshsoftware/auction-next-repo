"use client";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { ApiSubscriptionResponse, ApiSubscriptionData } from "@/interfaces/SubscriptionApi";
import { PlanDetails, PaymentInfo } from "@/interfaces/Payment";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { getRequest } from "@/shared/Axios";

/**
 * Maps API subscription data to PlanDetails interface
 */
const mapSubscriptionToPlanDetails = (
  subscriptionData: ApiSubscriptionData
): PlanDetails => {
  const { subscription, tier, limits } = subscriptionData;

  if (subscription) {
    // User has an active subscription
    const benefits: string[] = [];
    
    // Add benefits based on limits
    if (limits.collectionsMax > 0) {
      benefits.push(`${limits.collectionsMax} saved collections`);
    }
    
    if (limits.alertsMax > 0) {
      benefits.push(`${limits.alertsMax} active alerts`);
    }
    
    if (limits.savedSearchesMax === null || limits.savedSearchesMax === Number.POSITIVE_INFINITY) {
      benefits.push("Unlimited saved searches");
    } else if (limits.savedSearchesMax > 0) {
      benefits.push(`${limits.savedSearchesMax} saved searches`);
    }
    
    if (limits.emailAlerts && limits.whatsappAlerts) {
      benefits.push("WhatsApp and email notifications");
    } else if (limits.emailAlerts) {
      benefits.push("Email notifications");
    } else if (limits.whatsappAlerts) {
      benefits.push("WhatsApp notifications");
    }

    return {
      name: subscription.planName,
      status: subscription.status,
      renewalDate: subscription.renewalDate || subscription.endDate,
      planId: subscription.planId,
      benefits,
    };
  } else {
    // User is on free tier
    const benefits: string[] = [];
    
    if (limits.collectionsMax > 0) {
      benefits.push(`${limits.collectionsMax} saved collections`);
    }
    
    if (limits.alertsMax > 0) {
      benefits.push(`${limits.alertsMax} active alerts`);
    }
    
    benefits.push("Basic features");

    return {
      name: tier.charAt(0).toUpperCase() + tier.slice(1), // Capitalize first letter
      status: "Active",
      renewalDate: STRING_DATA.EMPTY,
      planId: `${tier.toUpperCase()}-PLAN`,
      benefits,
    };
  }
};

/**
 * Maps API subscription data to PaymentInfo interface
 */
const mapSubscriptionToPaymentInfo = (
  subscriptionData: ApiSubscriptionData
): PaymentInfo | undefined => {
  const { subscription } = subscriptionData;

  if (!subscription) {
    return undefined; // No payment info for free tier
  }

  return {
    method: subscription.paymentMethod || "Not specified",
    autoRenewal: subscription.autoRenewal,
    lastPaymentDate: subscription.lastPaymentDate || STRING_DATA.EMPTY,
    billingEmail: subscription.billingEmail || STRING_DATA.EMPTY,
    gstNumber: subscription.gstNumber,
  };
};

/**
 * Fetches user subscription data from the API
 */
const fetchSubscriptionData = async (): Promise<{
  planDetails: PlanDetails;
  paymentInfo?: PaymentInfo;
  subscriptionData: ApiSubscriptionData;
}> => {
  const response = await getRequest({
    API: API_ENPOINTS.SUBSCRIPTIONS_ME,
  });

  const apiResponse: ApiSubscriptionResponse = response.data;
  
  if (!apiResponse.success) {
    throw new Error("Failed to fetch subscription data");
  }

  const { data: subscriptionData } = apiResponse;
  
  return {
    planDetails: mapSubscriptionToPlanDetails(subscriptionData),
    paymentInfo: mapSubscriptionToPaymentInfo(subscriptionData),
    subscriptionData,
  };
};

/**
 * Custom hook to fetch and manage user subscription data
 */
export const useSubscription = (enabled = true) => {
  return useQuery({
    queryKey: [REACT_QUERY.USER_SUBSCRIPTION],
    queryFn: fetchSubscriptionData,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
