"use client";
import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import PlanDetailsCard from "@/components/ui/PlanDetailsCard";
import PaymentHistoryTable from "@/components/ui/PaymentHistoryTable";
import {
  PlanDetails,
  PaymentInfo,
  ProfileMembershipSectionProps,
  PaymentHistoryEntry,
} from "@/interfaces/Payment";
import { useSubscription } from "@/hooks/useSubscription";
import { CancelSubscriptionApiRequest, CancelSubscriptionApiResponse } from "@/interfaces/CancelSubscriptionApi";
import { postRequest } from "@/shared/Axios";
import { API_ENPOINTS } from "@/services/api";
import toast from "react-simple-toasts";

const DEFAULT_PLAN_DETAILS: PlanDetails = {
  name: "Broker Plus",
  status: "Active",
  renewalDate: "06 Nov 2025",
  planId: "BROKER-PLUS-2025",
  benefits: [
    "10 saved collections",
    "5 active alerts",
    "Unlimited saved searches",
    "WhatsApp and email notifications",
  ],
};

const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  method: "Visa ending •••• 4242",
  autoRenewal: true,
  lastPaymentDate: "06 Oct 2025",
  billingEmail: "billing@example.com",
  gstNumber: "29ABCDE1234F2Z5",
};

const DEFAULT_PAYMENT_HISTORY: readonly PaymentHistoryEntry[] = [
  {
    referenceId: "INV-1024",
    date: "06 Oct 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
  {
    referenceId: "INV-0987",
    date: "06 Sep 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
  {
    referenceId: "INV-0943",
    date: "06 Aug 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
];

/**
 * Displays the membership plan details, payment info, and payment history for the profile page.
 */
const ProfileMembershipSection: React.FC<ProfileMembershipSectionProps> = (props) => {
  const { planDetails: propPlanDetails, paymentInfo: propPaymentInfo, paymentHistory = DEFAULT_PAYMENT_HISTORY } = props;
  
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    isError: hasSubscriptionError,
    error: subscriptionError,
  } = useSubscription();

  /**
   * Cancels the user's subscription
   */
  const cancelSubscription = async (subscriptionId: string, cancelAtCycleEnd: boolean = false): Promise<void> => {
    try {
      const requestData: CancelSubscriptionApiRequest = {
        cancelAtCycleEnd,
      };

      const response = await postRequest({
        API: `${API_ENPOINTS.SUBSCRIPTIONS_CANCEL}/${subscriptionId}/cancel`,
        DATA: requestData,
      });

      const apiResponse: CancelSubscriptionApiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to cancel subscription");
      }

      // Show success message
      const message = cancelAtCycleEnd 
        ? "Subscription will be cancelled at the end of current cycle" 
        : "Subscription cancelled successfully";
        
      toast(message, {
        duration: 4000,
        position: 'top-center',
        theme: 'success',
      });

    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel subscription";
      
      toast(errorMessage, {
        duration: 4000,
        position: 'top-center',
        theme: 'failure',
      });
    }
  };

  /**
   * Handles cancel subscription button click with confirmation
   */
  const handleCancelSubscription = () => {
    const subscriptionId = subscriptionData?.subscriptionData?.subscription?.id;
    
    if (!subscriptionId) {
      toast("No active subscription found to cancel", {
        duration: 4000,
        position: 'top-center',
        theme: 'failure',
      });
      return;
    }

    // Show confirmation dialog
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription? This action cannot be undone."
    );

    if (confirmCancel) {
      cancelSubscription(subscriptionId, false); // Cancel immediately for now
    }
  };

  // Use API data if available, otherwise fall back to props or defaults
  const planDetails = subscriptionData?.planDetails || propPlanDetails || DEFAULT_PLAN_DETAILS;
  const paymentInfo = subscriptionData?.paymentInfo || propPaymentInfo || (planDetails.name === "Free" ? undefined : DEFAULT_PAYMENT_INFO);
  
  if (isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (hasSubscriptionError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">Failed to load subscription details</p>
        <p className="text-gray-500 text-sm">{subscriptionError?.message || "Please try again later"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PlanDetailsCard title={STRING_DATA.MEMBERSHIP_PLAN_DETAILS} statusLabel={planDetails.status}>
        <p className="text-sm text-gray-500 mb-4">{planDetails.planId}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{planDetails.name}</p>
            {planDetails.renewalDate && (
              <p className="text-sm text-gray-500">
                {STRING_DATA.MEMBERSHIP_PLAN_RENEWAL}: {planDetails.renewalDate}
              </p>
            )}
          </div>
          <ul className="grid gap-2 text-sm text-gray-600">
            {planDetails.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-color"></span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </PlanDetailsCard>
      
      {paymentInfo && (
        <PlanDetailsCard title={STRING_DATA.MEMBERSHIP_PAYMENT_INFO}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">{STRING_DATA.MEMBERSHIP_PAYMENT_METHOD}</p>
              <p className="text-sm text-gray-900">{paymentInfo.method}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">{STRING_DATA.MEMBERSHIP_PAYMENT_AUTORENEW}</p>
              <p className="text-sm text-gray-900">{paymentInfo.autoRenewal ? STRING_DATA.YES : STRING_DATA.NO}</p>
            </div>
            {paymentInfo.lastPaymentDate && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{STRING_DATA.MEMBERSHIP_PAYMENT_LAST}</p>
                <p className="text-sm text-gray-900">{paymentInfo.lastPaymentDate}</p>
              </div>
            )}
            {paymentInfo.billingEmail && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{STRING_DATA.MEMBERSHIP_PAYMENT_BILLING_EMAIL}</p>
                <p className="text-sm text-gray-900">{paymentInfo.billingEmail}</p>
              </div>
            )}
            {paymentInfo.gstNumber && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{STRING_DATA.MEMBERSHIP_PAYMENT_GST}</p>
                <p className="text-sm text-gray-900">{paymentInfo.gstNumber}</p>
              </div>
            )}
          </div>
        </PlanDetailsCard>
      )}

      {/* Cancel Subscription Section - Only show for paid subscriptions */}
      {subscriptionData?.subscriptionData?.subscription && (
        <PlanDetailsCard title="Subscription Management">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Cancel Subscription</h4>
                <p className="text-sm text-gray-600">
                  Cancel your current subscription. You&apos;ll lose access to premium features.
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={true} // Disabled for testing as requested
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Currently disabled for testing"
              >
                {STRING_DATA.CANCEL_SUBSCRIPTION}
              </button>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              ⚠️ Cancel subscription is currently disabled for testing purposes
            </div>
          </div>
        </PlanDetailsCard>
      )}
      
      {/* <PaymentHistoryTable entries={paymentHistory} /> */}
    </div>
  );
};

export default ProfileMembershipSection;

  