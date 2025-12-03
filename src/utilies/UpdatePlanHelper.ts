import { STORAGE_KEYS } from "@/shared/Constants";

const MAX_FREE_AUCTION_VIEWS_PER_DAY = 5;

const isBrowser = typeof window !== 'undefined';

/**
 * Helper functions to manage premium plan restrictions for free tier users
 * Tracks auction detail page views and shows upgrade modal after limit reached
 */
export const updatePlanLogic = {
  /**
   * Checks if daily limit needs to be reset (new day)
   * @returns boolean indicating if reset is needed
   */
  shouldResetDailyLimit: (): boolean => {
    if (!isBrowser) return false;
    try {
      const lastResetDate = localStorage.getItem(STORAGE_KEYS.PREMIUM_LAST_RESET_DATE);
      const currentDate = new Date().toDateString();
      return !lastResetDate || lastResetDate !== currentDate;
    } catch (err) {
      console.error('Error checking daily limit reset:', err);
      return false;
    }
  },

  /**
   * Resets the daily auction visit counter
   */
  resetDailyCounter: () => {
    if (!isBrowser) return;
    try {
      const currentDate = new Date().toDateString();
      localStorage.removeItem(STORAGE_KEYS.PREMIUM_AUCTION_VISIT_IDS);
      localStorage.removeItem(STORAGE_KEYS.SHOW_UPGRADE_MODAL_FLAG);
      localStorage.setItem(STORAGE_KEYS.PREMIUM_LAST_RESET_DATE, currentDate);
    } catch (err) {
      console.error('Error resetting daily counter:', err);
    }
  },

  /**
   * Marks an auction detail as visited for non-premium users
   * Tracks unique auction IDs and triggers upgrade modal after limit
   * @param auctionId - Unique identifier for the auction
   */
  markAuctionDetailVisited: (auctionId: string) => {
    if (!isBrowser) return;
    try {
      // Check if we need to reset for a new day
      if (updatePlanLogic.shouldResetDailyLimit()) {
        updatePlanLogic.resetDailyCounter();
      }

      const raw = localStorage.getItem(STORAGE_KEYS.PREMIUM_AUCTION_VISIT_IDS);
      const visited: string[] = raw ? JSON.parse(raw) : [];

      // Only add if not already visited (unique auctions only)
      if (!visited.includes(auctionId)) {
        visited.push(auctionId);

        if (visited.length >= MAX_FREE_AUCTION_VIEWS_PER_DAY) {
          // Reached the limit, set flag to show upgrade modal
          localStorage.setItem(STORAGE_KEYS.SHOW_UPGRADE_MODAL_FLAG, 'true');
          localStorage.removeItem(STORAGE_KEYS.PREMIUM_AUCTION_VISIT_IDS);
        } else {
          // Still under limit, save the updated list
          localStorage.setItem(STORAGE_KEYS.PREMIUM_AUCTION_VISIT_IDS, JSON.stringify(visited));
        }
      }
    } catch (err) {
      console.error('Error tracking auction visit:', err);
    }
  },

  /**
   * Checks if the upgrade modal should be shown
   * @returns boolean indicating if modal should be displayed
   */
  getShouldShowUpgradeModal: (): boolean => {
    if (!isBrowser) return false;
    try {
      // Check if we need to reset for a new day
      if (updatePlanLogic.shouldResetDailyLimit()) {
        updatePlanLogic.resetDailyCounter();
        return false;
      }
      return localStorage.getItem(STORAGE_KEYS.SHOW_UPGRADE_MODAL_FLAG) === 'true';
    } catch (err) {
      console.error('Error reading upgrade modal flag:', err);
      return false;
    }
  },

  /**
   * Resets the upgrade flag and clears the counter
   * Should be called when user upgrades to premium or dismisses modal
   */
  resetUpgradeFlag: () => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SHOW_UPGRADE_MODAL_FLAG);
      localStorage.removeItem(STORAGE_KEYS.PREMIUM_AUCTION_VISIT_IDS);
      localStorage.removeItem(STORAGE_KEYS.PREMIUM_LAST_RESET_DATE);
    } catch (err) {
      console.error('Error resetting upgrade flag:', err);
    }
  },
};
