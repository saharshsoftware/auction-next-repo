'use client';
import { useMemo } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { STRING_DATA, BROKER_PLUS_FEATURES } from '@/shared/Constants';

/**
 * Feature types that can have limits
 */
export type LimitFeatureType = 'collections' | 'alerts' | 'savedSearches';

/**
 * Plan information for comparison
 */
interface PlanInfo {
  readonly currentPlan: string;
  readonly currentLimit: number | string;
  readonly suggestedPlan: string;
  readonly suggestedLimit: number | string;
}

/**
 * Feature highlight for Broker Plus
 */
interface FeatureHighlight {
  readonly feature: string;
  readonly description: string;
}

/**
 * Return type for useLimitReached hook
 */
interface LimitReachedData {
  readonly title: string;
  readonly description: string;
  readonly ctaText: string;
  readonly planInfo: PlanInfo;
  readonly brokerPlusFeatures: readonly FeatureHighlight[];
}

/**
 * Gets the appropriate title based on feature type
 */
const getTitle = (featureType: LimitFeatureType): string => {
  switch (featureType) {
    case 'collections':
      return STRING_DATA.LIMIT_REACHED_COLLECTIONS_TITLE;
    case 'alerts':
      return STRING_DATA.LIMIT_REACHED_ALERTS_TITLE;
    case 'savedSearches':
      return STRING_DATA.LIMIT_REACHED_SAVED_SEARCHES_TITLE;
    default:
      return STRING_DATA.LIMIT_REACHED;
  }
};

/**
 * Gets the appropriate description based on feature type
 */
const getDescription = (featureType: LimitFeatureType): string => {
  switch (featureType) {
    case 'collections':
      return STRING_DATA.LIMIT_REACHED_COLLECTIONS_DESCRIPTION;
    case 'alerts':
      return STRING_DATA.LIMIT_REACHED_ALERTS_DESCRIPTION;
    case 'savedSearches':
      return STRING_DATA.LIMIT_REACHED_SAVED_SEARCHES_DESCRIPTION;
    default:
      return STRING_DATA.UPGRADE_TO_CREATE_MORE;
  }
};

/**
 * Gets the current limit based on feature type
 */
const getCurrentLimit = (
  featureType: LimitFeatureType,
  limits?: { collectionsMax: number; alertsMax: number; savedSearchesMax: number | null }
): number | string => {
  if (!limits) return 0;

  switch (featureType) {
    case 'collections':
      return limits.collectionsMax;
    case 'alerts':
      return limits.alertsMax;
    case 'savedSearches':
      return limits.savedSearchesMax === null || limits.savedSearchesMax === Number.POSITIVE_INFINITY
        ? STRING_DATA.UNLIMITED
        : limits.savedSearchesMax;
    default:
      return 0;
  }
};

/**
 * Hook to get limit reached messaging and plan comparison data
 * @param featureType - The type of feature that has reached its limit
 * @returns Formatted messaging, plan info, and Broker Plus feature highlights
 */
export const useLimitReached = (featureType: LimitFeatureType): LimitReachedData => {
  const { fullProfileData } = useUserProfile();
  const subscriptionDetails = fullProfileData?.subscriptionDetails;
  const limits = subscriptionDetails?.limits;

  return useMemo(() => {
    const currentPlan = subscriptionDetails?.tier || STRING_DATA.FREE;
    const currentLimit = getCurrentLimit(featureType, limits);

    const planInfo: PlanInfo = {
      currentPlan,
      currentLimit,
      suggestedPlan: STRING_DATA.BROKER_PLUS,
      suggestedLimit: STRING_DATA.UNLIMITED,
    };

    return {
      title: getTitle(featureType),
      description: getDescription(featureType),
      ctaText: STRING_DATA.UPGRADE_YOUR_PLAN,
      planInfo,
      brokerPlusFeatures: BROKER_PLUS_FEATURES,
    };
  }, [featureType, subscriptionDetails, limits]);
};

