'use client';
import { useMemo } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface CurrentCounts {
  readonly collections?: number;
  readonly alerts?: number;
  readonly savedSearches?: number;
}

interface SubscriptionAccess {
  readonly canAddCollection: boolean;
  readonly canAddAlert: boolean;
  readonly canAddSavedSearch: boolean;
  readonly canReceiveWhatsApp: boolean;
  readonly canReceiveEmail: boolean;
  readonly isLoading: boolean;
}

/**
 * Hook to check if user can perform actions based on subscription limits and current usage
 * @param currentCounts - Optional object with current usage counts for collections, alerts, and saved searches
 */
export const useSubscriptionAccess = (currentCounts?: CurrentCounts): SubscriptionAccess => {
  const { fullProfileData, isLoading: profileLoading, userProfileData } = useUserProfile();
  const limits = fullProfileData?.subscriptionDetails?.limits;

  return useMemo(() => {
    const isLoading = profileLoading;
    
    if (isLoading || !limits) {
      return {
        canAddCollection: false,
        canAddAlert: false,
        canAddSavedSearch: false,
        canReceiveWhatsApp: false,
        canReceiveEmail: false,
        isLoading: true,
      };
    }

    const actualCounts = {
      collections: currentCounts?.collections ?? 0,
      alerts: currentCounts?.alerts ?? 0,
      savedSearches: currentCounts?.savedSearches ?? 0,
    };

    const canAdd = {
      canAddCollection: limits.collectionsMax > 0 && actualCounts.collections < limits.collectionsMax,
      canAddAlert: limits.alertsMax > 0 && actualCounts.alerts < limits.alertsMax,
      canAddSavedSearch: limits.savedSearchesMax === null || 
                         limits.savedSearchesMax === Number.POSITIVE_INFINITY || 
                         (limits.savedSearchesMax > 0 && actualCounts.savedSearches < limits.savedSearchesMax),
      canReceiveWhatsApp: limits.whatsappAlerts,
      canReceiveEmail: limits.emailAlerts,
      isLoading: false,
    };

    return canAdd;
  }, [profileLoading, limits, currentCounts]);
};
