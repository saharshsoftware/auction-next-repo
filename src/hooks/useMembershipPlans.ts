"use client";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { ApiMembershipPlansResponse, ApiMembershipPlan } from "@/interfaces/MembershipPlanApi";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { REACT_QUERY } from "@/shared/Constants";

const UNLIMITED_LIMIT_VALUE = Number.POSITIVE_INFINITY;

/**
 * Maps API membership plan data to the application's MembershipPlan interface
 */
const mapApiPlanToMembershipPlan = (apiPlan: ApiMembershipPlan): MembershipPlan => {
  const { id, attributes } = apiPlan;
  const { name, description, price, planLimits, razorpayPlanId, isRecommended } = attributes;

  // Create plan ID based on name (lowercase, no spaces)
  const planId = name.toLowerCase().replace(/\s+/g, "");
  
  // Convert price from rupees to paise
  const amountInPaise = price * 100;
  
  // Handle savedSearchesMax - convert "infinity" string to number
  const savedSearchesMax = planLimits.savedSearchesMax === "infinity" 
    ? UNLIMITED_LIMIT_VALUE 
    : planLimits.savedSearchesMax;

  return {
    id: planId,
    label: name,
    priceText: price === 0 ? "₹0" : `₹${price.toLocaleString()}`,
    priceSubtext: "per month",
    description,
    ctaLabel: price === 0 ? "Stay on Free" : `Upgrade to ${name}`,
    isPopular: isRecommended,
    badgeLabel: isRecommended ? "Popular" : undefined,
    amountInPaise,
    razorpayPlanId,
    planType: planId, // Use planId as planType (e.g., "broker", "free", etc.)
    limits: {
      collectionsMax: planLimits.collectionsMax,
      alertsMax: planLimits.alertsMax,
      savedSearchesMax,
      whatsappAlerts: planLimits.whatsappAlerts,
      emailAlerts: planLimits.emailAlerts,
    },
  };
};

/**
 * Fetches membership plans from the API
 */
const fetchMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await fetch(`${API_BASE_URL}${API_ENPOINTS.MEMBERSHIP_PLANS}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch membership plans: ${response.statusText}`);
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
};

/**
 * Custom hook to fetch and manage membership plans data
 */
export const useMembershipPlans = () => {
  return useQuery({
    queryKey: [REACT_QUERY.MEMBERSHIP_PLANS],
    queryFn: fetchMembershipPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
