import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { PlanLimits } from "@/interfaces/PlanLimits";
import { STRING_DATA } from "@/shared/Constants";
import { logInfo } from "./Utilies";

export const MEMBERSHIP_LIMIT_LABELS: Record<keyof PlanLimits, string> = {
  collectionsMax: STRING_DATA.MEMBERSHIP_COLLECTIONS,
  alertsMax: STRING_DATA.MEMBERSHIP_ALERTS,
  savedSearchesMax: STRING_DATA.MEMBERSHIP_SAVED_SEARCHES,
  whatsappAlerts: STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS,
  emailAlerts: STRING_DATA.MEMBERSHIP_EMAIL_ALERTS,
  notificationsAlerts: STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS,
};

const MEMBERSHIP_FEATURE_DESCRIPTIONS: Record<string, string> = {
  [STRING_DATA.MEMBERSHIP_COLLECTIONS]: STRING_DATA.MEMBERSHIP_COLLECTIONS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_ALERTS]: STRING_DATA.MEMBERSHIP_ALERTS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_SAVED_SEARCHES]: STRING_DATA.MEMBERSHIP_SAVED_SEARCHES_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS]: STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_EMAIL_ALERTS]: STRING_DATA.MEMBERSHIP_EMAIL_ALERTS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS]: STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS_DESCRIPTION,
  "WhatsApp & Email Alerts": STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS_DESCRIPTION,
};

export const MEMBERSHIP_LIMIT_ORDER: ReadonlyArray<keyof PlanLimits> = [
  "collectionsMax",
  "alertsMax",
  "savedSearchesMax",
  "emailAlerts",
  "whatsappAlerts",
  "notificationsAlerts",
];

export const getMembershipLimitDisplayValue = (value: number): string => {
  if (!Number.isFinite(value)) {
    return STRING_DATA.UNLIMITED;
  }
  // if (value === 0) {
  //   return "—";
  // }
  return value.toString();
};

export const getMembershipBooleanDisplayValue = (value: boolean): string => {
  return value ? "✅" : "❌";
};

/**
 * Gets all features for a plan with proper formatting including descriptions
 */
export const mapMembershipPlanLimits = (
  plan: MembershipPlan,
): ReadonlyArray<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean; readonly description?: string }> => {
  const features: Array<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean; readonly description?: string }> = [];
  
  MEMBERSHIP_LIMIT_ORDER.forEach((limitKey) => {
    const rawValue: number | boolean = plan.limits[limitKey];
    const isBooleanFeature = typeof rawValue === "boolean";
    
    if (limitKey === "whatsappAlerts") {
      return;
    }
    
    if (limitKey === "notificationsAlerts") {
      return;
    }
    
    if (limitKey === "emailAlerts") {
      const whatsappValue = plan.limits.whatsappAlerts;
      const emailValue = plan.limits.emailAlerts;
      const notificationsValue = plan.limits.notificationsAlerts;
      
      // Combine all notification types in the label
      let label: string;
      let description: string | undefined;
      
      if (whatsappValue && emailValue && notificationsValue) {
        // All three enabled: use shorter combined label
        label = "WhatsApp, Email & Mobile alerts";
        const whatsappDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS];
        const emailDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
        const notificationsDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS];
        description = `Get instant updates on WhatsApp, email, and mobile. Stay informed about new properties and auctions in real time.`;
      } else if (whatsappValue && emailValue) {
        // WhatsApp and Email enabled
        label = "WhatsApp & Email alerts";
        const whatsappDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS];
        const emailDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
        description = `${whatsappDesc} ${emailDesc}`;
      } else if (whatsappValue && notificationsValue) {
        // WhatsApp and Mobile app notifications enabled
        label = "WhatsApp & Mobile alerts";
        const whatsappDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS];
        const notificationsDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS];
        description = `${whatsappDesc} ${notificationsDesc}`;
      } else if (emailValue && notificationsValue) {
        // Email and Mobile app notifications enabled
        label = "Email & Mobile alerts";
        const emailDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
        const notificationsDesc = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS];
        description = `Get auction updates by email and instant app alerts. Stay informed about new properties and price changes`;
      } else if (whatsappValue) {
        // Only WhatsApp enabled
        label = STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS];
      } else if (emailValue) {
        // Only email enabled
        label = STRING_DATA.MEMBERSHIP_EMAIL_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
      } else if (notificationsValue) {
        // Only notifications enabled
        label = STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS];
      } else {
        // None enabled
        label = STRING_DATA.MEMBERSHIP_EMAIL_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
      }
      
      // Value is true if any notification type is enabled
      const isEnabled = whatsappValue || emailValue || notificationsValue;
      
      features.push({
        label,
        value: isEnabled ? "✅" : "❌",
        isBooleanFeature: true,
        description,
      });
      return;
    }
    
    const value =
      typeof rawValue === "number" || typeof rawValue === "string"
        ? getMembershipLimitDisplayValue(rawValue)
        : getMembershipBooleanDisplayValue(rawValue);
    
    const label = MEMBERSHIP_LIMIT_LABELS[limitKey];
    features.push({
      label,
      value,
      isBooleanFeature,
      description: MEMBERSHIP_FEATURE_DESCRIPTIONS[label],
    });
  });
  
  return features;
};

/**
 * Gets the incremental features for a plan compared to the previous plan
 */
export const getIncrementalFeatures = (
  plan: MembershipPlan,
  allPlans?: readonly MembershipPlan[],
): ReadonlyArray<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean }> => {
  if (!plan.previousPlanId || !allPlans) {
    return mapMembershipPlanLimits(plan);
  }

  const previousPlan = allPlans.find((p) => p.id === plan.previousPlanId);
  if (!previousPlan) {
    return mapMembershipPlanLimits(plan);
  }

  const incrementalFeatures: Array<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean }> = [];

  MEMBERSHIP_LIMIT_ORDER.forEach((limitKey) => {
    const currentValue = plan.limits[limitKey];
    const previousValue = previousPlan.limits[limitKey];

    if (limitKey === "whatsappAlerts") {
      return;
    }

    if (limitKey === "notificationsAlerts") {
      return;
    }

    if (limitKey === "emailAlerts") {
      const currentWhatsapp = plan.limits.whatsappAlerts;
      const currentEmail = plan.limits.emailAlerts;
      const currentNotifications = plan.limits.notificationsAlerts;
      const prevWhatsapp = previousPlan.limits.whatsappAlerts;
      const prevEmail = previousPlan.limits.emailAlerts;
      const prevNotifications = previousPlan.limits.notificationsAlerts;

      // Check if any notification type changed
      const emailChanged = currentEmail && !prevEmail;
      const notificationsChanged = currentNotifications && !prevNotifications;
      const whatsappChanged = currentWhatsapp && !prevWhatsapp;

      // Only show if at least one changed
      if (whatsappChanged || emailChanged || notificationsChanged) {
        let label: string;
        
        // Determine label based on what's currently enabled (use shorter labels)
        if (currentWhatsapp && currentEmail && currentNotifications) {
          // All three enabled
          label = "WhatsApp, Email & Mobile alerts";
        } else if (currentWhatsapp && currentEmail) {
          // WhatsApp and Email
          label = "WhatsApp & Email alerts";
        } else if (currentWhatsapp && currentNotifications) {
          // WhatsApp and Mobile app notifications
          label = "WhatsApp & Mobile alerts";
        } else if (currentEmail && currentNotifications) {
          // Email and Mobile app notifications
          label = "Email & Mobile alerts";
        } else if (currentWhatsapp) {
          // Only WhatsApp
          label = STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS;
        } else if (currentEmail) {
          // Only Email
          label = STRING_DATA.MEMBERSHIP_EMAIL_ALERTS;
        } else {
          // Only Mobile app notifications
          label = STRING_DATA.MEMBERSHIP_NOTIFICATIONS_ALERTS;
        }
        
        incrementalFeatures.push({
          label,
          value: "✅",
          isBooleanFeature: true,
        });
      }
      return;
    }

    if (typeof currentValue === "number" && typeof previousValue === "number") {
      if (currentValue !== previousValue) {
        incrementalFeatures.push({
          label: MEMBERSHIP_LIMIT_LABELS[limitKey],
          value: getMembershipLimitDisplayValue(currentValue),
          isBooleanFeature: false,
        });
      }
    } else if (typeof currentValue === "boolean" && typeof previousValue === "boolean") {
      if (currentValue !== previousValue && currentValue) {
        incrementalFeatures.push({
          label: MEMBERSHIP_LIMIT_LABELS[limitKey],
          value: getMembershipBooleanDisplayValue(currentValue),
          isBooleanFeature: true,
        });
      }
    }
  });

  return incrementalFeatures;
};

