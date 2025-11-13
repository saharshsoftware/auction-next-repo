"use client";
import { UserSubscriptionDetails } from "@/interfaces/UserProfileApi";
import { PlanDetails, PaymentInfo } from "@/interfaces/Payment";
import { STRING_DATA } from "@/shared/Constants";
import { useUserProfile } from "@/hooks/useUserProfile";
import { denormalizePlanName, formatDateForDisplay } from "@/shared/Utilies";

/**
 * Maps user subscription data to PlanDetails interface
 */
const mapSubscriptionToPlanDetails = (
  subscriptionDetails: UserSubscriptionDetails
): PlanDetails => {
  const { subscription, tier, limits } = subscriptionDetails;

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
    
    if (limits.notificationsAlerts) {
      benefits.push("Mobile app notifications");
    }

    return {
      name: denormalizePlanName(subscription.subscriptionType),
      status: subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1),
      renewalDate: formatDateForDisplay(subscription.endDate),
      planId: subscription.razorpaySubscriptionId,
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
      name: denormalizePlanName(tier),
      status: "Active",
      renewalDate: STRING_DATA.EMPTY,
      planId: `${tier.toUpperCase()}-PLAN`,
      benefits,
    };
  }
};

/**
 * Maps user subscription data to PaymentInfo interface
 */
const mapSubscriptionToPaymentInfo = (
  subscriptionDetails: UserSubscriptionDetails
): PaymentInfo | undefined => {
  const { subscription, razorpaySubscription } = subscriptionDetails;

  if (!subscription) {
    return undefined; // No payment info for free tier
  }

  return {
    method: razorpaySubscription?.payment_method || "Not specified",
    autoRenewal: true, // Assume auto-renewal for active subscriptions
    lastPaymentDate: formatDateForDisplay(subscription.currentPeriodStart),
    billingEmail: STRING_DATA.EMPTY, // Not available in current data structure
    gstNumber: undefined, // Not available in current data structure
  };
};

/**
 * Custom hook to get user subscription data from profile
 */
export const useSubscription = (enabled = true) => {
  const { fullProfileData, isLoading, error } = useUserProfile(enabled);

  // Transform the data to match the expected return format
  const transformedData = fullProfileData?.subscriptionDetails ? {
    planDetails: mapSubscriptionToPlanDetails(fullProfileData.subscriptionDetails),
    paymentInfo: mapSubscriptionToPaymentInfo(fullProfileData.subscriptionDetails),
    subscriptionData: {
      subscription: fullProfileData.subscriptionDetails.subscription ? {
        id: fullProfileData.subscriptionDetails.subscription.id, // Use internal subscription ID, not Razorpay ID
        status: fullProfileData.subscriptionDetails.subscription.status,
        planId: fullProfileData.subscriptionDetails.razorpaySubscription?.plan_id || '',
        planName: fullProfileData.subscriptionDetails.subscription.subscriptionType,
        startDate: fullProfileData.subscriptionDetails.subscription.startDate,
        endDate: fullProfileData.subscriptionDetails.subscription.endDate,
        renewalDate: fullProfileData.subscriptionDetails.subscription.endDate,
        autoRenewal: true,
        paymentMethod: fullProfileData.subscriptionDetails.razorpaySubscription?.payment_method,
        lastPaymentDate: fullProfileData.subscriptionDetails.subscription.currentPeriodStart,
        billingEmail: '',
        gstNumber: undefined,
        amount: 0,
        currency: 'INR',
      } : null,
      tier: fullProfileData.subscriptionDetails.tier,
      limits: fullProfileData.subscriptionDetails.limits,
    },
  } : null;

  return {
    data: transformedData,
    isLoading,
    isError: !!error,
    error,
    refetch: () => Promise.resolve({ data: transformedData }),
  };
};
