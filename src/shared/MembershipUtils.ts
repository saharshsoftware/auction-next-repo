import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { logInfo } from "./Utilies";

export const MEMBERSHIP_LIMIT_LABELS: Record<keyof MembershipPlan["limits"], string> = {
  collectionsMax: STRING_DATA.MEMBERSHIP_COLLECTIONS,
  alertsMax: STRING_DATA.MEMBERSHIP_ALERTS,
  savedSearchesMax: STRING_DATA.MEMBERSHIP_SAVED_SEARCHES,
  whatsappAlerts: STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS,
  emailAlerts: STRING_DATA.MEMBERSHIP_EMAIL_ALERTS,
};

const MEMBERSHIP_FEATURE_DESCRIPTIONS: Record<string, string> = {
  [STRING_DATA.MEMBERSHIP_COLLECTIONS]: STRING_DATA.MEMBERSHIP_COLLECTIONS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_ALERTS]: STRING_DATA.MEMBERSHIP_ALERTS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_SAVED_SEARCHES]: STRING_DATA.MEMBERSHIP_SAVED_SEARCHES_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS]: STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS_DESCRIPTION,
  [STRING_DATA.MEMBERSHIP_EMAIL_ALERTS]: STRING_DATA.MEMBERSHIP_EMAIL_ALERTS_DESCRIPTION,
  "WhatsApp & Email Alerts": STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS_DESCRIPTION,
};

export const MEMBERSHIP_LIMIT_ORDER: ReadonlyArray<keyof MembershipPlan["limits"]> = [
  "collectionsMax",
  "alertsMax",
  "savedSearchesMax",
  "emailAlerts",
  "whatsappAlerts",
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
    
    if (limitKey === "emailAlerts") {
      const whatsappValue = plan.limits.whatsappAlerts;
      const emailValue = plan.limits.emailAlerts;
      const bothEnabled = whatsappValue && emailValue;
      const bothDisabled = !whatsappValue && !emailValue;
      
      // Show specific label based on what's actually enabled
      let label = "Notifications";
      let description: string | undefined;
      // if (bothEnabled) {
      //   label = "WhatsApp & Email Alerts";
      //   description = MEMBERSHIP_FEATURE_DESCRIPTIONS["WhatsApp & Email Alerts"];
      // } else 
      if (emailValue) {
        label = STRING_DATA.MEMBERSHIP_EMAIL_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
      } else if (whatsappValue) {
        label = STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS];
      } else {
        label = STRING_DATA.MEMBERSHIP_EMAIL_ALERTS;
        description = MEMBERSHIP_FEATURE_DESCRIPTIONS[STRING_DATA.MEMBERSHIP_EMAIL_ALERTS];
        // label = "WhatsApp & Email Alerts1";
        // description = MEMBERSHIP_FEATURE_DESCRIPTIONS["WhatsApp & Email Alerts"];
      }
      
      features.push({
        label,
        value: bothEnabled || emailValue || whatsappValue ? "✅" : "❌",
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

    if (limitKey === "emailAlerts") {
      const currentWhatsapp = plan.limits.whatsappAlerts;
      const currentEmail = plan.limits.emailAlerts;
      const prevWhatsapp = previousPlan.limits.whatsappAlerts;
      const prevEmail = previousPlan.limits.emailAlerts;

      if (currentEmail && !prevEmail && currentWhatsapp && !prevWhatsapp) {
        incrementalFeatures.push({
          label: "WhatsApp & Email Alerts",
          value: "✅",
          isBooleanFeature: true,
        });
      } else if (currentEmail && !prevEmail) {
        incrementalFeatures.push({
          label: "Email Alerts",
          value: "✅",
          isBooleanFeature: true,
        });
      } else if (currentWhatsapp && !prevWhatsapp) {
        incrementalFeatures.push({
          label: "WhatsApp Alerts",
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
    }
  });

  return incrementalFeatures;
};

