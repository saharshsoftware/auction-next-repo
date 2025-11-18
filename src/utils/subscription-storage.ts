/**
 * Utility functions for managing subscription processing state in localStorage
 */

const SUBSCRIPTION_PROCESSING_KEY = 'subscriptionProcessing';
const SUBSCRIPTION_PROCESSING_EVENT = 'subscription-processing-change';

interface SubscriptionProcessingEventDetail {
  readonly isProcessing: boolean;
}

type SubscriptionProcessingEvent = CustomEvent<SubscriptionProcessingEventDetail>;

const dispatchSubscriptionProcessingEvent = (isProcessing: boolean): void => {
  if (typeof window === 'undefined') return;
  const event: SubscriptionProcessingEvent = new CustomEvent(SUBSCRIPTION_PROCESSING_EVENT, {
    detail: {
      isProcessing,
    },
  });
  window.dispatchEvent(event);
};

/**
 * Sets the subscription processing flag in localStorage
 * @param value - The processing state to set
 */
export const setSubscriptionProcessing = (value: boolean): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (value) {
      localStorage.setItem(SUBSCRIPTION_PROCESSING_KEY, 'true');
    } else {
      localStorage.removeItem(SUBSCRIPTION_PROCESSING_KEY);
    }
    dispatchSubscriptionProcessingEvent(value);
  } catch (error) {
    console.error('Failed to set subscription processing state:', error);
  }
};

/**
 * Checks if subscription is currently being processed
 * @returns boolean indicating if subscription is processing (defaults to false)
 */
export const isSubscriptionProcessing = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const value = localStorage.getItem(SUBSCRIPTION_PROCESSING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Failed to get subscription processing state:', error);
    return false;
  }
};

/**
 * Clears the subscription processing flag from localStorage
 */
export const clearSubscriptionProcessing = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SUBSCRIPTION_PROCESSING_KEY);
    dispatchSubscriptionProcessingEvent(false);
  } catch (error) {
    console.error('Failed to clear subscription processing state:', error);
  }
};

/**
 * Subscribes to subscription processing state changes
 * Returns a cleanup function to remove the listener
 */
export const subscribeToSubscriptionProcessing = (
  handler: (isProcessing: boolean) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const listener = (event: Event) => {
    const customEvent = event as SubscriptionProcessingEvent;
    handler(customEvent.detail.isProcessing);
  };

  window.addEventListener(SUBSCRIPTION_PROCESSING_EVENT, listener);

  return () => {
    window.removeEventListener(SUBSCRIPTION_PROCESSING_EVENT, listener);
  };
};

