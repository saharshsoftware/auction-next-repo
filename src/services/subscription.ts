import { getRequest, postRequest } from "@/shared/Axios";
import axios from "axios";
import { API_ENPOINTS } from "./api";
import { UserSubscriptionDetails } from "@/interfaces/UserProfileApi";
import { CreateSubscriptionApiRequest, CreateSubscriptionApiResponse } from "@/interfaces/CreateSubscriptionApi";
import { getPlanTypeForBackend } from "@/shared/Utilies";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { CheckoutApiRequest, CheckoutApiResponse } from "@/interfaces/CheckoutApi";
import {
  CreateOneTimeOrderRequest,
  CreateOneTimeOrderResponse,
  OneTimeCheckoutRequest,
  OneTimeCheckoutResponse,
} from "@/interfaces/OneTimePaymentApi";

export const getSubscription = async (): Promise<UserSubscriptionDetails> => {
  const response = await getRequest({ API: API_ENPOINTS.SUBSCRIPTIONS_ME });
  return response.data as UserSubscriptionDetails;
};

/**
 * Creates a subscription for the selected plan
 */
export const createSubscription = async (plan: MembershipPlan): Promise<CreateSubscriptionApiResponse> => {
  const requestData: CreateSubscriptionApiRequest = {
    planId: plan.razorpayPlanId,
    startAt: new Date().toISOString(),
    planType: getPlanTypeForBackend(plan.planType),
  };
  try {
    const response = await postRequest({
      API: API_ENPOINTS.SUBSCRIPTIONS_CREATE,
      DATA: requestData,
    });

    return response.data as CreateSubscriptionApiResponse;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};


/**
 * Calls the checkout API to get Razorpay configuration for a subscription
 */
export const getCheckoutConfig = async (
  subscriptionId: string,
  notes?: Record<string, string>
): Promise<CheckoutApiResponse> => {
  const requestData: CheckoutApiRequest = {
    subscriptionId,
    ...(notes && { notes }),
  };

  const response = await postRequest({
    API: API_ENPOINTS.SUBSCRIPTIONS_CHECKOUT,
    DATA: requestData,
  });

  return response.data as CheckoutApiResponse;
};

/**
 * Creates a one-time payment order for the selected plan option
 */
export const createOneTimeOrder = async (
  membershipPlanId: number,
  optionIndex: number
): Promise<CreateOneTimeOrderResponse> => {
  const requestData: CreateOneTimeOrderRequest = {
    membershipPlanId,
    optionIndex,
  };
  try {
    const response = await postRequest({
      API: API_ENPOINTS.ONE_TIME_CREATE_ORDER,
      DATA: requestData,
    });
    return response.data as CreateOneTimeOrderResponse;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
};

/**
 * Gets Razorpay configuration for a one-time payment order
 */
export const getOneTimeCheckoutConfig = async (
  orderId: string,
  notes?: Record<string, string>
): Promise<OneTimeCheckoutResponse> => {
  const requestData: OneTimeCheckoutRequest = {
    orderId,
    ...(notes && { notes }),
  };
  const response = await postRequest({
    API: API_ENPOINTS.ONE_TIME_CHECKOUT,
    DATA: requestData,
  });
  return response.data as OneTimeCheckoutResponse;
};
