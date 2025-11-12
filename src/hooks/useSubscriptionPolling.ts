import { useCallback, useEffect, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/shared/Constants";
import { logInfo, logError, getPlanTypeForBackend } from "@/shared/Utilies";
import { getUserDetails } from "@/services/auth";

const POLLING_INTERVAL_MS = 4000;
const MAX_POLLING_ATTEMPTS = 30;

interface PollingParams {
  readonly expectedSubscriptionId: string;
  readonly expectedSubscriptionType: string;
}

/**
 * Custom hook for polling subscription status after payment
 * Polls until subscription is active and subscriptionType matches the expected type
 */
export const useSubscriptionPolling = (queryClient: QueryClient): ((params: PollingParams) => Promise<boolean>) => {
  return useCallback(async ({ expectedSubscriptionId, expectedSubscriptionType }: PollingParams): Promise<boolean> => {
    let attempts = 0;
    const normalizedExpectedType = getPlanTypeForBackend(expectedSubscriptionType.toLowerCase());
    
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        attempts++;
        try {
          logInfo(`Polling subscription status (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`, { 
            expectedSubscriptionId,
            expectedSubscriptionType: normalizedExpectedType
          });
          
          const freshData = await queryClient.fetchQuery({ 
            queryKey: [REACT_QUERY.USER_PROFILE],
            queryFn: getUserDetails,
            staleTime: 0,
          });
          
          const subscriptionDetails = (freshData as any)?.subscriptionDetails;
          
          if (subscriptionDetails?.subscription) {
            const currentSubscriptionId = subscriptionDetails.subscription.razorpaySubscriptionId?.toString();
            const subscriptionStatus = subscriptionDetails.subscription.status?.toLowerCase();
            const rawSubscriptionType = subscriptionDetails.subscription.subscriptionType || '';
            // Normalize the current subscription type the same way as expected type
            const normalizedCurrentType = getPlanTypeForBackend(rawSubscriptionType.toLowerCase());
            
            logInfo("Subscription status check", {
              currentSubscriptionId,
              expectedSubscriptionId,
              status: subscriptionStatus,
              rawSubscriptionType,
              normalizedCurrentType,
              normalizedExpectedType,
            });
            
            // Check if subscription is active and subscriptionType matches
            if (
              currentSubscriptionId === expectedSubscriptionId &&
              subscriptionStatus === "active" &&
              normalizedCurrentType === normalizedExpectedType
            ) {
              clearInterval(interval);
              logInfo("Subscription activated successfully with matching type", { 
                subscriptionId: currentSubscriptionId,
                subscriptionType: normalizedCurrentType
              });
              // Immediately update the cache with fresh data to sync UI
              queryClient.setQueryData([REACT_QUERY.USER_PROFILE], freshData);
              // Invalidate to trigger refetch and ensure all components update
              await queryClient.invalidateQueries({ queryKey: [REACT_QUERY.USER_PROFILE] });
              resolve(true);
              return;
            }
          }
          
          if (attempts >= MAX_POLLING_ATTEMPTS) {
            clearInterval(interval);
            logInfo("Polling timeout reached", { attempts });
            resolve(false);
            return;
          }
        } catch (error) {
          logError("Error during polling", error);
          
          if (attempts >= MAX_POLLING_ATTEMPTS) {
            clearInterval(interval);
            resolve(false);
            return;
          }
        }
      }, POLLING_INTERVAL_MS);
    });
  }, [queryClient]);
};

/**
 * Custom hook to automatically poll when subscription status is pending on page load
 */
export const useAutoPollPendingSubscription = (
  queryClient: QueryClient,
  subscriptionData: { subscriptionData?: { subscription?: { id?: number; status?: string; planName?: string } | null } } | null | undefined,
  isLoading: boolean
): void => {
  const pollingRef = useRef<boolean>(false);
  const pollSubscriptionStatus = useSubscriptionPolling(queryClient);

  useEffect(() => {
    // Don't poll if already polling, still loading, or no subscription data
    if (pollingRef.current || isLoading || !subscriptionData?.subscriptionData?.subscription) {
      return;
    }

    const subscription = subscriptionData.subscriptionData.subscription;
    const subscriptionStatus = subscription.status?.toLowerCase();
    const isPending = subscriptionStatus === "pending";

    if (!isPending) {
      return;
    }

    const subscriptionId = subscription.id?.toString();
    // planName in transformed data corresponds to subscriptionType in API
    const subscriptionType = subscription.planName;

    if (!subscriptionId || !subscriptionType) {
      logError("Cannot start auto-polling: missing subscription ID or type", {
        subscriptionId,
        subscriptionType,
      });
      return;
    }

    pollingRef.current = true;
    logInfo("Starting auto-polling for pending subscription", {
      subscriptionId,
      subscriptionType,
    });

    const pollPendingSubscription = async () => {
      const isActivated = await pollSubscriptionStatus({
        expectedSubscriptionId: subscriptionId,
        expectedSubscriptionType: subscriptionType,
      });

      pollingRef.current = false;

      if (isActivated) {
        logInfo("Pending subscription activated successfully via auto-polling", {
          subscriptionId,
          subscriptionType,
        });
        // Query data is already updated in polling hook, just ensure UI refreshes
        await queryClient.invalidateQueries({ queryKey: [REACT_QUERY.USER_PROFILE] });
      } else {
        logInfo("Auto-polling timeout reached for pending subscription", {
          subscriptionId,
          subscriptionType,
        });
      }
    };

    pollPendingSubscription();

    // Cleanup function to reset polling flag if component unmounts
    return () => {
      pollingRef.current = false;
    };
  }, [subscriptionData, isLoading, queryClient, pollSubscriptionStatus]);
};
