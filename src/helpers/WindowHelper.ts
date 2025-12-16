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
