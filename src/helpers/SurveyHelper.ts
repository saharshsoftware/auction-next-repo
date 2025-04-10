import { STORAGE_KEYS } from "@/shared/Constants";
import { USER_SURVEY_STATUS } from "@/types";

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
    const SURVEY_STATUS = getActiveSurveyStorageStatus(surveyId);

    if (SURVEY_STATUS === "COMPLETED") {
      return false;
    }

    if (SURVEY_STATUS === "REMIND_LATER" && !isRemindLaterValid(surveyId)) {
      return false;
    }

    const views = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.AUCTION_VIEW_KEY) || "[]"
    );

    const MIN_AUCTION_VIEWS = 5;

    if (!Array.isArray(views) || views.length < MIN_AUCTION_VIEWS) {
      return false;
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
  status: USER_SURVEY_STATUS
) {
  try {
    const data: any = { status };

    if (status === "REMIND_LATER" || status === "INCOMPLETE") {
      data.remindLaterTimestamp = Date.now(); // Store current timestamp
    }

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
  status: USER_SURVEY_STATUS
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

/**
 * Checks if the "REMIND_LATER" status is still valid or expired.
 * @param {string} storageKey - The key to check.
 * @returns {boolean} - Returns true if "REMIND_LATER" is still valid, false if expired.
 */
export function isRemindLaterValid(surveyId: string): boolean {
  try {
    const surveyData = JSON.parse(
      localStorage.getItem(`SurveyId_${surveyId}`) || "{}"
    ) as { status: USER_SURVEY_STATUS; remindLaterTimestamp: number };

    const remindLaterTimestamp = surveyData?.remindLaterTimestamp;
    if (!remindLaterTimestamp) {
      return true; // No timestamp means the reminder is valid
    }

    let isExpired = false;

    if (surveyData?.status === "REMIND_LATER") {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      isExpired = Date.now() >= remindLaterTimestamp + oneWeekInMs;
    }

    if (surveyData?.status === "INCOMPLETE") {
      const threeDayinMs = 3 * 24 * 60 * 60 * 1000;
      // const threeDayinMs = 5000; // 5 seconds for testing
      isExpired = Date.now() >= remindLaterTimestamp + threeDayinMs;
    }

    return isExpired;

    // const onMinutes = 1 * 60 * 1000;
    // const currentDateInMs = Date.now();
    // const isExpired = currentDateInMs >= remindLaterTimestamp + onMinutes;
    // console.table({
    //   isExpired,
    //   checkValue: remindLaterTimestamp + onMinutes,
    //   current: currentDateInMs,
    // });
    // return isExpired;
  } catch (error) {
    console.error("Error checking remind later validity:", error);
    return true;
  }
}

/**
 * Retrieves the status from localStorage for a given surveyId.
 * If no status exists, it initializes the storage with a default status of `null`.
 *
 * @param {string} storageKey - The base key for storage.
 * @param {string} surveyId - The unique ID of the survey.
 * @returns {string | null} - The status ('COMPLETED', 'REMIND_LATER', or null).
 */
export function getOrCreateSurveyStorageData(surveyId: string): string | null {
  try {
    const fullKey = `SurveyId_${surveyId}`;
    const data = localStorage.getItem(fullKey);

    if (data) {
      const parsed = JSON.parse(data);
      return parsed.status || null;
    }

    // Initialize storage with null status if not found
    const defaultData = { status: null };
    localStorage.setItem(fullKey, JSON.stringify(defaultData));
    return null;
  } catch (error) {
    console.error(
      `Error getting or creating storage for key SurveyId_${surveyId} and SurveyId_${surveyId}:`,
      error
    );
    return null;
  }
}

export function checkSurveyTrigger(
  surveyId: string,
  showSurveyPopup: () => void
) {
  const surveyKey = `${STORAGE_KEYS.SURVEY_SHOWN}${surveyId}`;
  const DELAY_TIME = 5000; // 5 seconds delay
  const PAGE_VIEWS_THRESHOLD = 10;
  const SEARCH_COUNT_THRESHOLD = 3;

  let pageVisits = parseInt(
    localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || "0"
  );
  let searchCount = parseInt(
    localStorage.getItem(STORAGE_KEYS.SEARCH_COUNT) || "0"
  );
  let tabOpenedTime = parseInt(
    sessionStorage.getItem(STORAGE_KEYS.SESSION_TIME) || "0"
  );

  // If conditions are met, check the delay
  if (
    pageVisits >= PAGE_VIEWS_THRESHOLD &&
    searchCount >= SEARCH_COUNT_THRESHOLD
  ) {
    const currentTime = Date.now();

    // If no time is set, store the tab open time
    if (!tabOpenedTime) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_TIME, currentTime.toString());
      tabOpenedTime = currentTime;
    }

    console.log("Waiting for 5 seconds before showing survey popup.", {
      tabOpenedTime,
      currentTime,
    });
    // Show survey after 5 seconds
    setTimeout(() => {
      showSurveyPopup();
      localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_COUNT);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_TIME);
    }, Math.max(0, DELAY_TIME - (currentTime - tabOpenedTime)));
  }
}

// Store the page visits and searches in localStorage
export function incrementCounter(key: string) {
  let count = localStorage.getItem(key) || "0";
  localStorage.setItem(key, (parseInt(count) + 1).toString());
}

// Call this function when a search is made
export function trackSearch() {
  incrementCounter(STORAGE_KEYS.SEARCH_COUNT);
}
export function getStorageKeyData(key: any) {
  return JSON.parse(localStorage.getItem(key) || "null");
}

// Helper function to recursively get descendant question IDs
function getDescendants(
  qid: string,
  questions: any,
  visited = new Set<string>()
) {
  let descendants: any = [];
  if (!questions[qid] || visited.has(qid)) return descendants;
  visited.add(qid);
  const options = questions[qid].options;
  options.forEach((option: any) => {
    if (option.next) {
      descendants.push(option.next);
      descendants = descendants.concat(
        getDescendants(option.next, questions, visited)
      );
    }
  });
  return descendants;
}

// Main function to remove downstream responses
export function removeDownstreamResponses(
  currentQuestion: any,
  responses: any,
  questions: any
) {
  // Find the ID of the current question (assuming question texts are unique)
  let currentQId = null;
  for (const id in questions) {
    if (questions[id].question === currentQuestion.question) {
      currentQId = id;
      break;
    }
  }
  // If not found, nothing to remove; return original responses
  if (!currentQId) return responses;

  // Get all descendant question IDs from the current question
  const descendantIds = getDescendants(currentQId, questions);

  // Remove responses for all descendant questions based on their text
  descendantIds.forEach((qid: string) => {
    if (questions[qid]) {
      const qText = questions[qid].question;
      if (responses.hasOwnProperty(qText)) {
        delete responses[qText];
      }
    }
  });

  return responses;
}
