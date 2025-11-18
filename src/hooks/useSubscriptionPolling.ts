import { useCallback, useEffect, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/shared/Constants";
import { logInfo, logError, getPlanTypeForBackend } from "@/shared/Utilies";
import { getUserDetails } from "@/services/auth";
import { isSubscriptionProcessing, clearSubscriptionProcessing } from "@/utils/subscription-storage";
import { useConfettiStore } from "@/zustandStore/confettiStore";

const POLLING_INTERVAL_MS = 4000;
const MAX_POLLING_ATTEMPTS = 30;
const INITIAL_POLL_DELAY_MS = 500; // Small delay before first poll

interface PollingParams {
  readonly expectedSubscriptionId: string;
  readonly expectedSubscriptionType: string;
  readonly expectedRazorpaySubscriptionId: string;
}

/**
 * Custom hook for polling subscription status after payment
 * Polls until subscription is active and subscriptionType matches the expected type
 */
export const useSubscriptionPolling = (queryClient: QueryClient): ((params: PollingParams) => Promise<boolean>) => {
  return useCallback(async ({ expectedSubscriptionId, expectedSubscriptionType, expectedRazorpaySubscriptionId }: PollingParams): Promise<boolean> => {
    let attempts = 0;
    const normalizedExpectedType = getPlanTypeForBackend(expectedSubscriptionType.toLowerCase());
    
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        attempts++;
        try {
          logInfo(`Polling subscription status (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`, { 
            expectedSubscriptionId,
            expectedSubscriptionType: normalizedExpectedType,
            expectedRazorpaySubscriptionId,
          });
          
          const freshData = await queryClient.fetchQuery({ 
            queryKey: [REACT_QUERY.USER_PROFILE],
            queryFn: getUserDetails,
            staleTime: 0,
          });
          
          const subscriptionDetails = (freshData as any)?.subscriptionDetails;
          
          if (subscriptionDetails?.subscription) {
            const currentRazorpaySubscriptionId = subscriptionDetails.subscription.razorpaySubscriptionId?.toString();
            const subscriptionStatus = subscriptionDetails.subscription.status?.toLowerCase();
            const rawSubscriptionType = subscriptionDetails.subscription.subscriptionType || '';
            // Normalize the current subscription type the same way as expected type
            const normalizedCurrentType = getPlanTypeForBackend(rawSubscriptionType.toLowerCase());
            
            logInfo("Subscription status check", {
              currentRazorpaySubscriptionId,
              expectedSubscriptionId,
              status: subscriptionStatus,
              expectedRazorpaySubscriptionId,
              rawSubscriptionType,
              normalizedCurrentType,
              normalizedExpectedType,
            });
            
            // Check if subscription is active and subscriptionType matches
            if (
              currentRazorpaySubscriptionId === expectedRazorpaySubscriptionId &&
              normalizedCurrentType === normalizedExpectedType
            ) {
              clearInterval(interval);
              logInfo("Subscription activated successfully with matching type", { 
                subscriptionId: currentRazorpaySubscriptionId,
                subscriptionType: normalizedCurrentType
              });
              clearSubscriptionProcessing();
              useConfettiStore.getState().showConfetti();
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
 * Also monitors localStorage for processing flag
 */
export const useAutoPollPendingSubscription = (
  queryClient: QueryClient,
  subscriptionData: { subscriptionData?: { subscription?: { id?: number; status?: string; planName?: string; razorpaySubscriptionId?: string } | null } } | null | undefined,
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
    
    // Check if localStorage processing flag is set
    const hasProcessingFlag = isSubscriptionProcessing();

    // Only start polling if status is pending OR if localStorage flag is set
    if (!isPending && !hasProcessingFlag) {
      return;
    }

    const subscriptionId = subscription.id?.toString();
    const razorpaySubscriptionId = subscription.razorpaySubscriptionId?.toString();
    // planName in transformed data corresponds to subscriptionType in API
    const subscriptionType = subscription.planName;

    if (!subscriptionId || !subscriptionType || !razorpaySubscriptionId) {
      logError("Cannot start auto-polling: missing subscription ID, type, or Razorpay subscription ID", {
        subscriptionId,
        subscriptionType,
        razorpaySubscriptionId,
      });
      return;
    }

    pollingRef.current = true;
    logInfo("Starting auto-polling for subscription", {
      subscriptionId,
      subscriptionType,
      reason: isPending ? "pending status" : "localStorage flag"
    });

    const pollPendingSubscription = async () => {
      const isActivated = await pollSubscriptionStatus({
        expectedSubscriptionId: subscriptionId,
        expectedSubscriptionType: subscriptionType,
        expectedRazorpaySubscriptionId: razorpaySubscriptionId,
      });

      pollingRef.current = false;

      if (isActivated) {
        logInfo("Subscription activated successfully via auto-polling", {
          subscriptionId,
          subscriptionType,
        });
        // Clear localStorage processing flag when activated
        clearSubscriptionProcessing();
        // Query data is already updated in polling hook, just ensure UI refreshes
        await queryClient.invalidateQueries({ queryKey: [REACT_QUERY.USER_PROFILE] });
      } else {
        logInfo("Auto-polling timeout reached for subscription", {
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

/**
 * Hook to immediately start polling when localStorage processing flag is detected
 * This ensures polling starts right after checkout, even before subscription data loads
 */
export const useImmediatePollingOnCheckout = (
  queryClient: QueryClient,
  isAuthenticated: boolean
): void => {
  const pollingRef = useRef<boolean>(false);
  const hasCheckedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only check once on mount
    if (hasCheckedRef.current || !isAuthenticated) {
      return;
    }

    hasCheckedRef.current = true;

    // Check if localStorage flag is set
    const hasProcessingFlag = isSubscriptionProcessing();
    
    if (!hasProcessingFlag || pollingRef.current) {
      return;
    }

    logInfo("Immediate polling triggered by localStorage flag");
    pollingRef.current = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    // Start immediate polling with a small initial delay
    const startImmediatePolling = async () => {
      // Wait a bit for any in-flight requests to complete
      await new Promise(resolve => setTimeout(resolve, INITIAL_POLL_DELAY_MS));
      
      let attempts = 0;
      pollInterval = setInterval(async () => {
        attempts++;
        
        try {
          logInfo(`Immediate polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);
          
          const freshData = await queryClient.fetchQuery({ 
            queryKey: [REACT_QUERY.USER_PROFILE],
            queryFn: getUserDetails,
            staleTime: 0,
          });


          
          const subscriptionDetails = (freshData as any)?.subscriptionDetails;
          console.log("[immediate polling] subscriptionDetails", subscriptionDetails);
          
          // If subscription is found, then we tell the user that the subscription is activated
          if (subscriptionDetails?.subscription) {
            const subscriptionStatus = subscriptionDetails.subscription.status?.toLowerCase();
            
            logInfo("[Immediate polling] Subscription activated successfully with matching type", { 
              status: subscriptionStatus,
              subscriptionId: subscriptionDetails.subscription.id,
              subscriptionType: subscriptionDetails.subscription.subscriptionType
            });
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            clearSubscriptionProcessing();
            pollingRef.current = false;
            useConfettiStore.getState().showConfetti();
            // Update cache and invalidate
            queryClient.setQueryData([REACT_QUERY.USER_PROFILE], freshData);
            await queryClient.invalidateQueries({ queryKey: [REACT_QUERY.USER_PROFILE] });
            return;
   
          }
          
          // Stop if max attempts reached
          if (attempts >= MAX_POLLING_ATTEMPTS) {
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            pollingRef.current = false;
            logInfo("Immediate polling - max attempts reached");
            return;
          }
        } catch (error) {
          logError("Immediate polling error", error);
          
          if (attempts >= MAX_POLLING_ATTEMPTS) {
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            pollingRef.current = false;
            return;
          }
        }
      }, POLLING_INTERVAL_MS);
    };

    startImmediatePolling();

    // Cleanup
    return () => {
      pollingRef.current = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [queryClient, isAuthenticated]);
};
