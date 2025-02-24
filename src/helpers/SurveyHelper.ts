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
export async function shouldShowSurvey(): Promise<boolean> {
  try {
    const views = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.AUCTION_VIEW_KEY) || "[]"
    );
    const surveyAlreadyShown = localStorage.getItem(
      STORAGE_KEYS.SURVEY_SHOWN_KEY
    );

    if (surveyAlreadyShown) {
      removeAuctionViewTrack(); // Clear the auction view track
    }

    if (!Array.isArray(views) || views.length < 5 || surveyAlreadyShown) {
      return false; // Don't show survey if views < 5 or survey was already shown
    }

    localStorage.setItem(STORAGE_KEYS.SURVEY_SHOWN_KEY, "true"); // Prevent multiple surveys
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
