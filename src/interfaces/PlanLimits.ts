/**
 * Base plan limits interface containing all possible limit fields
 * This is the single source of truth for plan limits structure
 */
export interface PlanLimits {
  readonly collectionsMax: number;
  readonly alertsMax: number;
  readonly savedSearchesMax: number;
  readonly whatsappAlerts: boolean;
  readonly emailAlerts: boolean;
  readonly notificationAlerts: boolean;
}

/**
 * API plan limits - savedSearchesMax can be "infinity" string or number
 * This represents the raw format from the API
 */
export interface ApiPlanLimits extends Omit<PlanLimits, "savedSearchesMax"> {
  readonly savedSearchesMax: "infinity" | number;
}

/**
 * User subscription limits - savedSearchesMax can be null
 * This represents the format returned from user profile API
 */
export interface UserSubscriptionLimits extends Omit<PlanLimits, "savedSearchesMax"> {
  readonly savedSearchesMax: number | null;
}

