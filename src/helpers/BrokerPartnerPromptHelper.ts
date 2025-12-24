/**
 * BrokerPartnerPromptHelper
 * 
 * Helper utilities for managing the Broker Partner Prompt feature.
 * Handles localStorage persistence to track how many times the prompt
 * has been shown to broker users per day.
 * 
 * @module BrokerPartnerPromptHelper
 */

import { STORAGE_KEYS } from "@/shared/Constants";


/** Maximum number of times to show the prompt per day */
const MAX_DAILY_SHOWS = 2;

/** Delay in milliseconds before showing the prompt */
export const SHOW_DELAY_MS = 5000;

/**
 * Interface representing the stored prompt data in localStorage
 */
interface BrokerPromptStorageData {
  /** Date in YYYY-MM-DD format when the prompt was last shown */
  readonly date: string;
  /** Number of times the prompt has been shown today */
  readonly count: number;
}

/**
 * Retrieves the broker partner prompt storage data from localStorage.
 * 
 * @returns The stored data object, or null if no data exists or running on server
 * 
 * @example
 * const data = getStorageData();
 * if (data) {
 *   console.log(`Shown ${data.count} times on ${data.date}`);
 * }
 */
const getStorageData = (): BrokerPromptStorageData | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BROKER_PARTNER_PROMPT);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading broker prompt storage:", error);
    return null;
  }
};

/**
 * Saves the broker partner prompt storage data to localStorage.
 * 
 * @param data - The data object to store
 * 
 * @example
 * setStorageData({ date: '2024-12-24', count: 1 });
 */
const setStorageData = (data: BrokerPromptStorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BROKER_PARTNER_PROMPT, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving broker prompt storage:", error);
  }
};

/**
 * Gets today's date in YYYY-MM-DD format.
 * Used for comparing against stored date to reset daily counter.
 * 
 * @returns Today's date string in ISO format (YYYY-MM-DD)
 * 
 * @example
 * const today = getTodayDate(); // Returns "2024-12-24"
 */
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Checks if the broker partner prompt can be shown based on the daily limit.
 * 
 * Rules:
 * - If no data exists, prompt can be shown (first time)
 * - If stored date is not today, prompt can be shown (new day)
 * - If count is less than MAX_DAILY_SHOWS, prompt can be shown
 * 
 * @returns true if the prompt can be shown, false otherwise
 * 
 * @example
 * if (canShowBrokerPrompt()) {
 *   setIsVisible(true);
 * }
 */
export const canShowBrokerPrompt = (): boolean => {
  const data = getStorageData();
  const today = getTodayDate();
  
  // No data exists or it's a new day - can show
  if (!data || data.date !== today) {
    return true;
  }
  
  // Check if under daily limit
  return data.count < MAX_DAILY_SHOWS;
};

/**
 * Increments the show count for today's broker partner prompt.
 * If it's a new day, resets the counter to 1.
 * 
 * Should be called when the prompt is actually displayed to the user.
 * 
 * @example
 * // When showing the prompt
 * setIsVisible(true);
 * incrementBrokerPromptCount();
 */
export const incrementBrokerPromptCount = (): void => {
  const today = getTodayDate();
  const data = getStorageData();
  
  if (!data || data.date !== today) {
    // New day or first time - start fresh
    setStorageData({ date: today, count: 1 });
  } else {
    // Same day - increment count
    setStorageData({ date: today, count: data.count + 1 });
  }
};

/**
 * Resets the broker partner prompt storage.
 * Useful for testing or when user explicitly wants to see prompts again.
 * 
 * @example
 * resetBrokerPromptStorage();
 */
export const resetBrokerPromptStorage = (): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.BROKER_PARTNER_PROMPT);
  } catch (error) {
    console.error("Error resetting broker prompt storage:", error);
  }
};

/**
 * Gets the current show count for today.
 * Useful for debugging or analytics.
 * 
 * @returns The number of times the prompt has been shown today, or 0 if none
 * 
 * @example
 * const count = getBrokerPromptShowCount();
 * console.log(`Prompt shown ${count} times today`);
 */
export const getBrokerPromptShowCount = (): number => {
  const data = getStorageData();
  const today = getTodayDate();
  
  if (!data || data.date !== today) {
    return 0;
  }
  
  return data.count;
};

