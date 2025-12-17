"use client";
import React, { useState } from "react";
import Link from "next/link";
import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import PlanDetailsCard from "@/components/ui/PlanDetailsCard";
import OneTimePaymentDetails from "@/components/ui/OneTimePaymentDetails";
import {
  ProfileMembershipSectionProps,
} from "@/interfaces/Payment";
import { useSubscription } from "@/hooks/useSubscription";
import { CancelSubscriptionApiRequest, CancelSubscriptionApiResponse } from "@/interfaces/CancelSubscriptionApi";
import { postRequest } from "@/shared/Axios";
import { API_ENPOINTS } from "@/services/api";
import toast from "react-simple-toasts";
import CancelSubscriptionConfirmationModal from "@/components/ modals/CancelSubscriptionConfirmationModal";

/**
 * Displays the membership plan details, payment info, and payment history for the profile page.
 */
const ProfileMembershipSection: React.FC<ProfileMembershipSectionProps> = (props) => {
  const { planDetails: propPlanDetails, paymentInfo: propPaymentInfo, refetchUserProfile } = props;
  // const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Get subscription data from profile API (via useSubscription hook)
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
    setIsCanceling(true);
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

      // Close modal
      setIsCancelModalOpen(false);

      // Refetch user profile data to update subscription status
      refetchUserProfile();

    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel subscription";

      toast(errorMessage, {
        duration: 4000,
        position: 'top-center',
        theme: 'failure',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  /**
   * Handles cancel subscription button click - opens confirmation modal
   */
  const handleCancelSubscriptionClick = () => {
    const subscriptionId = subscriptionData?.subscriptionData?.subscription?.id;

    if (!subscriptionId) {
      toast("No active subscription found to cancel", {
        duration: 4000,
        position: 'top-center',
        theme: 'failure',
      });
      return;
    }

    setIsCancelModalOpen(true);
  };

  /**
   * Handles confirmation from modal
   */
  const handleConfirmCancel = () => {
    const subscriptionId = subscriptionData?.subscriptionData?.subscription?.id;

    if (!subscriptionId) {
      toast("No active subscription found to cancel", {
        duration: 4000,
        position: 'top-center',
        theme: 'failure',
      });
      setIsCancelModalOpen(false);
      return;
    }

    cancelSubscription(subscriptionId.toString(), true);
  };

  // Use API data if available, otherwise fall back to props or defaults
  const planDetails = subscriptionData?.planDetails || propPlanDetails;
  const paymentInfo = subscriptionData?.paymentInfo || propPaymentInfo;

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
      <PlanDetailsCard title={STRING_DATA.MEMBERSHIP_PLAN_DETAILS} statusLabel={planDetails?.status}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Plan Type:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white`}>
                {planDetails?.name}
              </span>
              {subscriptionData?.subscriptionData?.subscription?.paymentType === "one_time" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  One-time
                </span>
              )}
            </div>
            {/* Show one-time option details if present */}
            {subscriptionData?.subscriptionData?.subscription?.oneTimeOptionData && (
              <OneTimePaymentDetails
                oneTimeOptionData={subscriptionData.subscriptionData.subscription.oneTimeOptionData}
              />
            )}
            {planDetails?.renewalDate && (
              <p className="text-sm-xs">
                {STRING_DATA.MEMBERSHIP_PLAN_RENEWAL}: {planDetails?.renewalDate}
              </p>
            )}
          </div>
          <ul className="grid gap-2 text-sm text-gray-600">
            {planDetails?.benefits?.map((benefit) => (
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
              <p className="text-sm font-medium text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_METHOD}</p>
              <p className="text-sm-xs">{paymentInfo.method}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_CURRENT_PERIOD_START}</p>
              <p className="text-sm-xs">{paymentInfo?.currentPeriodStart}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_CURRENT_PERIOD_END}</p>
              <p className="text-sm-xs">{paymentInfo?.currentPeriodEnd}</p>
            </div>
            {paymentInfo.billingEmail && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_BILLING_EMAIL}</p>
                <p className="text-sm-xs">{paymentInfo.billingEmail}</p>
              </div>
            )}
            {paymentInfo.gstNumber && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_GST}</p>
                <p className="text-sm-xs">{paymentInfo.gstNumber}</p>
              </div>
            )}
          </div>
        </PlanDetailsCard>
      )}

      {/* Upgrade Section - Only show for free tier users */}
      {!subscriptionData?.subscriptionData?.subscription && (
        <PlanDetailsCard title="Upgrade Your Membership">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Unlock Premium Features</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Upgrade to a premium plan to access advanced features like unlimited saved searches,
                  priority alerts, WhatsApp notifications, and more. Choose a plan that fits your needs
                  and take your auction experience to the next level.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Unlimited saved searches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Priority email and WhatsApp alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Enhanced collection management</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href={ROUTE_CONSTANTS.PRICING}
              className="w-fit px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
            >
              View Pricing
            </Link>
          </div>
        </PlanDetailsCard>
      )}

      {/* Cancel Subscription Section - Only show for paid subscriptions */}
      {subscriptionData?.subscriptionData?.subscription && subscriptionData?.subscriptionData?.subscription?.paymentType !== "one_time" && (() => {
        const subscription = subscriptionData.subscriptionData.subscription;
        const isCancelScheduled = (subscription as any).cancelAtCycleEnd === true;

        return (
          <PlanDetailsCard title="Subscription Management">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Cancel Subscription</h4>
                  <p className="text-sm text-gray-600">
                    {isCancelScheduled
                      ? "Your subscription is scheduled to cancel at the end of the current billing cycle."
                      : "Once you cancel the current subscription, it will be scheduled to cancel at the end of the current billing cycle"}
                  </p>
                </div>
                <button
                  onClick={handleCancelSubscriptionClick}
                  disabled={isCanceling || isCancelScheduled}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {STRING_DATA.CANCEL_SUBSCRIPTION}
                </button>
              </div>
            </div>
          </PlanDetailsCard>
        );
      })()}

      {/* Cancel Subscription Confirmation Modal */}
      <CancelSubscriptionConfirmationModal
        openModal={isCancelModalOpen}
        hideModal={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isLoading={isCanceling}
      />

      {/* <PaymentHistoryTable entries={paymentHistory} /> */}
    </div>
  );
};

export default ProfileMembershipSection;

