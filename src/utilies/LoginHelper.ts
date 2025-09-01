import { STORAGE_KEYS } from "@/shared/Constants";

const MAX_VISITS = 1;
const isBrowser = typeof window !== 'undefined';

export const loginLogic = {
  markAuctionDetailVisited: (auctionId: string) => {
    if (!isBrowser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUCTION_VISIT_IDS);
      const visited: string[] = raw ? JSON.parse(raw) : [];

      if (!visited.includes(auctionId)) {
        visited.push(auctionId);

        if (visited.length >= MAX_VISITS) {
          localStorage.setItem(STORAGE_KEYS.SHOW_LOGIN_FLAG, 'true');
          localStorage.removeItem(STORAGE_KEYS.AUCTION_VISIT_IDS);
        } else {
          localStorage.setItem(STORAGE_KEYS.AUCTION_VISIT_IDS, JSON.stringify(visited));
        }
      }
    } catch (err) {
      console.error('Error tracking auction visit:', err);
    }
  },

  resetLoginFlag: () => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SHOW_LOGIN_FLAG);
      localStorage.removeItem(STORAGE_KEYS.AUCTION_VISIT_IDS);
    } catch (err) {
      console.error('Error resetting login flag:', err);
    }
  },

  getShouldShowLogin: (): boolean => {
    if (!isBrowser) return false;
    try {
      return localStorage.getItem(STORAGE_KEYS.SHOW_LOGIN_FLAG) === 'true';
    } catch (err) {
      console.error('Error reading login flag:', err);
      return false;
    }
  },
};
