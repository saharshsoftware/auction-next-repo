const isBrowser = typeof window !== 'undefined';

// set userId in window.dataLayer
export const setUserIdInDataLayer = (userId: string | null) => {
  if (!isBrowser) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    userId: userId,
  });
  (window as Window & { userId?: string | null }).userId = userId;
};

/**
 * Tracks upgrade to premium events in Google Analytics via dataLayer.
 * @param {string} eventName - The event name to push to dataLayer.
 */
export const trackUpgradeToPremiumEvent = (eventName: string): void => {
  if (!isBrowser) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
  });
};

