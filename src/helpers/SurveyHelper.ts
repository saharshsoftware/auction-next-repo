import { STORAGE_KEYS } from "@/shared/Constants";

/**
 * Adds an auction ID to localStorage and tracks views.
 * @param {string} auctionId - The unique ID of the auction.
 */
export function trackAuctionView(auctionId: string) {
  try {
    let views = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.AUCTION_VIEW_KEY) || "[]"
    );

    if (!Array.isArray(views)) {
      views = [];
    }

    if (!views.includes(auctionId)) {
      views.push(auctionId);
      localStorage.setItem(
        STORAGE_KEYS.AUCTION_VIEW_KEY,
        JSON.stringify(views)
      );
    }
  } catch (error) {
    console.error("Error tracking auction views:", error);
  }
}

/**
 * Checks if the survey should be shown based on auction views and IP record.
 * @returns {Promise<boolean>} - Resolves to `true` if survey should be shown.
 */
export async function shouldShowSurvey(surveyId: string): Promise<boolean> {
  try {
    // if (!isAuthenticated) {
    const SURVEY_STATUS = getActiveSurveyStorageStatus(surveyId);

    if (SURVEY_STATUS === "COMPLETED") {
      return false;
    }
    // }
    const views = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.AUCTION_VIEW_KEY) || "[]"
    );

    const MIN_AUCTION_VIEWS = 5;

    if (!Array.isArray(views) || views.length < MIN_AUCTION_VIEWS) {
      return false; // Don't show survey if views < 5 or survey was already shown
    }

    return true;
  } catch (error) {
    console.error("Error checking survey conditions:", error);
    return false;
  }
}

export async function getSurveyDismissedStatus(): Promise<boolean> {
  try {
    const dismissedSurvey = localStorage.getItem(
      STORAGE_KEYS.SURVEY_DISMISS_KEY
    );
    return dismissedSurvey === "true"; // Convert to boolean
  } catch (error) {
    console.error("Error checking survey dismissed status:", error);
    return false;
  }
}

export function removeAuctionViewTrack() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUCTION_VIEW_KEY);
  } catch (error) {
    console.error("Error while clear tracking auction views:", error);
  }
}

/**
 * Handle "Remind Me Later" by resetting auction view count.
 */
export function handleRemindMeLater() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUCTION_VIEW_KEY); // Reset auction view tracking
  } catch (error) {
    console.error("Error setting remind me later:", error);
  }
}

/**
 * Gets the status from localStorage for a given storage key.
 * @param {string} storageKey - The key to retrieve data from.
 * @returns {string | null} - The status ('COMPLETED', 'REMIND_LATER', or null).
 */
export function getActiveSurveyStorageStatus(
  storageKey: string
): string | null {
  try {
    const data = localStorage.getItem(`SurveyId_${storageKey}`);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.status || null;
    }
    return null;
  } catch (error) {
    console.error(`Error getting status for key ${storageKey}:`, error);
    return null;
  }
}

/**
 * Sets the status in localStorage for a given storage key.
 * @param {string} storageKey - The key to store data under.
 * @param {string} status - The status to be set ('COMPLETED' or 'REMIND_LATER').
 */
export function setActiveSurveyStorageStatus(
  storageKey: string,
  status: "COMPLETED" | "REMIND_LATER" | "null"
) {
  try {
    const data = { status };
    localStorage.setItem(`SurveyId_${storageKey}`, JSON.stringify(data));
  } catch (error) {
    console.error(
      `Error setting status for key SurveyId_${storageKey}:`,
      error
    );
  }
}

/**
 * Updates the status in localStorage for a given storage key.
 * @param {string} storageKey - The key to update data for.
 * @param {string} status - The new status ('COMPLETED' or 'REMIND_LATER').
 */
export function updateActiveSurveyStorageStatus(
  storageKey: string,
  status: "COMPLETED" | "REMIND_LATER" | "null"
) {
  try {
    setActiveSurveyStorageStatus(storageKey, status);
  } catch (error) {
    console.error(
      `Error updating status for key SurveyId_${storageKey}:`,
      error
    );
  }
}

/**
 * Deletes the status from localStorage for a given storage key.
 * @param {string} storageKey - The key to remove data from.
 */
export function deleteActiveSurveyStorageStatus(storageKey: string) {
  try {
    localStorage.removeItem(`SurveyId_${storageKey}`);
  } catch (error) {
    console.error(
      `Error deleting status for key SurveyId_${storageKey}:`,
      error
    );
  }
}
