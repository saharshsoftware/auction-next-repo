import { useCallback } from "react";
import { QueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/shared/Constants";
import { logInfo, logError } from "@/shared/Utilies";

const POLLING_INTERVAL_MS = 2000;
const MAX_POLLING_ATTEMPTS = 15;

/**
 * Custom hook for polling subscription status after payment
 */
export const useSubscriptionPolling = (queryClient: QueryClient): ((expectedSubscriptionId: string) => Promise<boolean>) => {
  return useCallback(async (expectedSubscriptionId: string): Promise<boolean> => {
    let attempts = 0;
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        attempts++;
        try {
          logInfo(`Polling subscription status (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`, { 
            expectedSubscriptionId 
          });
          
          const freshData = await queryClient.fetchQuery({ 
            queryKey: [REACT_QUERY.USER_PROFILE] 
          });
          
          const subscriptionDetails = (freshData as any)?.subscriptionDetails;
          
          if (subscriptionDetails?.subscription) {
            const currentSubscriptionId = subscriptionDetails.subscription.id?.toString();
            const subscriptionStatus = subscriptionDetails.subscription.status?.toLowerCase();
            
            logInfo("Subscription status check", {
              currentSubscriptionId,
              expectedSubscriptionId,
              status: subscriptionStatus,
            });
            
            if (
              currentSubscriptionId === expectedSubscriptionId &&
              subscriptionStatus === "active"
            ) {
              clearInterval(interval);
              logInfo("Subscription activated successfully", { subscriptionId: currentSubscriptionId });
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
