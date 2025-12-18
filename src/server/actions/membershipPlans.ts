"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { CACHE_TIMES } from "@/shared/Constants";
import { ApiMembershipPlansResponse, ApiMembershipPlan } from "@/interfaces/MembershipPlanApi";
import { MembershipPlan } from "@/interfaces/MembershipPlan";

const UNLIMITED_LIMIT_VALUE = Number.POSITIVE_INFINITY;

/**
 * Maps API membership plan data to the application's MembershipPlan interface
 */
const mapApiPlanToMembershipPlan = (apiPlan: ApiMembershipPlan): MembershipPlan => {
  const { id, attributes } = apiPlan;
  const { name, description, price, planLimits, razorpayPlanId, isRecommended, discountedPrice, frequency, oneTimeOptions } = attributes;

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
    apiId: id,
    label: name,
    priceText: price === 0 ? "₹0" : `₹${price?.toLocaleString()}`,
    priceSubtext: frequency || "per month",
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
    oneTimeOptions: oneTimeOptions || [],
  };
};

/**
 * Fetches membership plans from the API (server-side)
 */
export const fetchMembershipPlans = async (): Promise<MembershipPlan[] | null> => {
  "use server";
  try {
    const URL = API_BASE_URL +  API_ENPOINTS.MEMBERSHIP_PLANS + "?populate[oneTimeOptions][filters][isActive][$eq]=true";

    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.MEMBERSHIP_PLANS },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch membership plans");
    }

    const apiResponse: ApiMembershipPlansResponse = await response.json();

    // Sort API plans by discountedPrice (actual price user pays) to establish proper hierarchy
    const sortedApiPlans = [...apiResponse.data].sort((a, b) => {
      const priceA = a.attributes.discountedPrice ?? a.attributes.price;
      const priceB = b.attributes.discountedPrice ?? b.attributes.price;
      return priceA - priceB;
    });

    // Convert API plans to MembershipPlan interface
    const sortedPlans = sortedApiPlans.map(mapApiPlanToMembershipPlan);

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

