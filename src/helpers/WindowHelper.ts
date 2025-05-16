const isBrowser = typeof window !== 'undefined';

// set userId in window.dataLayer
export const setUserIdInDataLayer = (userId: string | null) => {
  if (!isBrowser) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    userId: userId,
  });
  (window as Window & { userId?: string | null }).userId = userId;
}

// set aucitondetail propertytype in window.id
export const setAuctionDetailPropertyInId = (propertyType: string | null) => {
  if (!isBrowser) return;
  (window as Window & { id?: string | null }).id = propertyType;
}