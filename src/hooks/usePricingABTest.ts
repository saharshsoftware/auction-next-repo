"use client";

import { useState, useEffect, useMemo } from "react";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { getUserData } from "@/shared/Utilies";

const AB_TEST_STORAGE_KEY = "pricing_ab_group";
const GROUP_A_PLAN_ID = ["free", "trial"];

type ABGroup = "A" | "B";

interface UsePricingABTestProps {
  readonly membershipPlans: MembershipPlan[];
  readonly isAuthenticated: boolean;
  readonly currentTier?: string | null;
}

interface UsePricingABTestResult {
  readonly filteredPlans: MembershipPlan[];
  readonly abGroup: ABGroup | null;
}

/**
 * Determines A/B group based on user ID (even = A, odd = B)
 */
const calculateABGroupByUserId = (userId: number): ABGroup => {
  return userId % 2 === 0 ? "A" : "B";
};

/**
 * Determines A/B group based on current minute (even = A, odd = B)
 * Used for anonymous users on their first visit
 */
const calculateABGroupByMinute = (): ABGroup => {
  const minutes = new Date().getMinutes();
  return minutes % 2 === 0 ? "A" : "B";
};

/**
 * Retrieves stored A/B group from localStorage
 */
const getStoredABGroup = (): ABGroup | null => {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(AB_TEST_STORAGE_KEY);
  if (stored === "A" || stored === "B") {
    return stored;
  }
  return null;
};

/**
 * Stores A/B group assignment in localStorage
 */
const storeABGroup = (group: ABGroup): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AB_TEST_STORAGE_KEY, group);
};

/**
 * Filters membership plans based on A/B group
 * Group A: Free Plan and Trial only
 * Group B: All plans
 */
const filterPlansByGroup = (plans: MembershipPlan[], group: ABGroup | null): MembershipPlan[] => {
  if (group !== "A") {
    return plans;
  }
  return plans.filter((plan) => GROUP_A_PLAN_ID.includes(plan.id));
};

/**
 * Checks if user is on free tier
 */
const isUserOnFreeTier = (tier: string | null | undefined): boolean => {
  if (!tier) return true;
  return tier.toLowerCase() === "free";
};

/**
 * Hook for A/B testing on pricing page
 * 
 * For anonymous users:
 * - First visit: Assigned by current minute (even = A, odd = B), stored in localStorage
 * - Returning: Uses stored assignment for consistency
 * 
 * For logged-in FREE users:
 * - Even user IDs (Group A): Show only Free Plan and Trial
 * - Odd user IDs (Group B): Show all plans
 * 
 * For paid users (non-free tier): Show all plans
 * 
 * Assignment is stored in localStorage for consistency across sessions
 */
export const usePricingABTest = ({
  membershipPlans,
  isAuthenticated,
  currentTier,
}: UsePricingABTestProps): UsePricingABTestResult => {
  const [abGroup, setAbGroup] = useState<ABGroup | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Anonymous users: A/B test based on minute, stored in localStorage
    if (!isAuthenticated) {
      const storedGroup = getStoredABGroup();
      if (storedGroup) {
        setAbGroup(storedGroup);
        return;
      }
      const minuteBasedGroup = calculateABGroupByMinute();
      storeABGroup(minuteBasedGroup);
      setAbGroup(minuteBasedGroup);
      return;
    }

    // Paid users (non-free tier) see all plans - no A/B test for them
    if (!isUserOnFreeTier(currentTier)) {
      setAbGroup(null);
      return;
    }

    // For free tier users, always calculate A/B group from user ID (deterministic)
    // This ensures even/odd user ID rules are respected regardless of prior localStorage values
    const userData = getUserData();
    const userId = userData?.id;

    if (typeof userId === "number") {
      const calculatedGroup = calculateABGroupByUserId(userId);
      storeABGroup(calculatedGroup);
      setAbGroup(calculatedGroup);
    }
  }, [isMounted, isAuthenticated, currentTier]);

  const filteredPlans = useMemo(() => {
    // Show all plans if not mounted yet
    if (!isMounted) {
      return membershipPlans;
    }
    // Paid users (non-free tier) always see all plans
    if (isAuthenticated && !isUserOnFreeTier(currentTier)) {
      return membershipPlans;
    }
    // Anonymous users and free-tier users: filter based on A/B group
    return filterPlansByGroup(membershipPlans, abGroup);
  }, [membershipPlans, abGroup, isMounted, isAuthenticated, currentTier]);

  return {
    filteredPlans,
    abGroup,
  };
};

