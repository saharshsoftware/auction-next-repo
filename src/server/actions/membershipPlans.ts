"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { FILTER_API_REVALIDATE_TIME } from "@/shared/Constants";
import { ApiMembershipPlansResponse, ApiMembershipPlan } from "@/interfaces/MembershipPlanApi";
import { MembershipPlan } from "@/interfaces/MembershipPlan";

const UNLIMITED_LIMIT_VALUE = Number.POSITIVE_INFINITY;

/**
 * Maps API membership plan data to the application's MembershipPlan interface
 */
const mapApiPlanToMembershipPlan = (apiPlan: ApiMembershipPlan): MembershipPlan => {
  const { id, attributes } = apiPlan;
  const { name, description, price, planLimits, razorpayPlanId, isRecommended, discountedPrice } = attributes;

  // Create plan ID based on name (lowercase, no spaces)
  const planId = name.toLowerCase().replace(/\s+/g, "");

  // Convert price from rupees to paise
  const amountInPaise = price * 100;
  const discountedPriceText = discountedPrice ? `₹${discountedPrice?.toLocaleString()}` : '₹0';

  // Handle savedSearchesMax - convert "infinity" string to number
  const savedSearchesMax = planLimits.savedSearchesMax === "infinity"
    ? UNLIMITED_LIMIT_VALUE
    : planLimits.savedSearchesMax;

  return {
    id: planId,
    label: name,
    priceText: price === 0 ? "₹0" : `₹${price?.toLocaleString()}`,
    priceSubtext: "per month",
    description,
    discountedPriceText,
    ctaLabel: `Switch to ${name}`,
    isPopular: isRecommended,
    badgeLabel: isRecommended ? "Popular" : undefined,
    amountInPaise,
    razorpayPlanId,
    planType: planId,
    limits: {
      collectionsMax: planLimits.collectionsMax,
      alertsMax: planLimits.alertsMax,
      savedSearchesMax,
      whatsappAlerts: planLimits.whatsappAlerts,
      emailAlerts: planLimits.emailAlerts,
      notificationAlerts: planLimits.notificationAlerts,
    },
  };
};

/**
 * Fetches membership plans from the API (server-side)
 */
export const fetchMembershipPlans = async (): Promise<MembershipPlan[] | null> => {
  "use server";
  try {
    const URL = API_BASE_URL +  API_ENPOINTS.MEMBERSHIP_PLANS;

    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch membership plans");
    }

    const apiResponse: ApiMembershipPlansResponse = await response.json();

    // Convert API plans to MembershipPlan interface
    const plans = apiResponse.data.map(mapApiPlanToMembershipPlan);

    // Sort plans by price to establish proper hierarchy
    const sortedPlans = plans.sort((a, b) => a.amountInPaise - b.amountInPaise);

    // Set up previousPlanId relationships based on sorted order
    const plansWithHierarchy = sortedPlans.map((plan, index) => {
      if (index === 0) {
        return plan; // First (cheapest) plan has no previous plan
      }
      return {
        ...plan,
        previousPlanId: sortedPlans[index - 1].id,
      };
    });

    return plansWithHierarchy;
  } catch (e) {
    console.error(e, "Membership plans error");
    return null;
  }
};

