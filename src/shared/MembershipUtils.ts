import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";

export const MEMBERSHIP_LIMIT_LABELS: Record<keyof MembershipPlan["limits"], string> = {
  collectionsMax: STRING_DATA.MEMBERSHIP_COLLECTIONS,
  alertsMax: STRING_DATA.MEMBERSHIP_ALERTS,
  savedSearchesMax: STRING_DATA.MEMBERSHIP_SAVED_SEARCHES,
  whatsappAlerts: STRING_DATA.MEMBERSHIP_WHATSAPP_ALERTS,
  emailAlerts: STRING_DATA.MEMBERSHIP_EMAIL_ALERTS,
};

export const MEMBERSHIP_LIMIT_ORDER: ReadonlyArray<keyof MembershipPlan["limits"]> = [
  "collectionsMax",
  "alertsMax",
  "savedSearchesMax",
  "emailAlerts",
  "whatsappAlerts",
];

export const getMembershipLimitDisplayValue = (value: number): string => {
  if (Number.isFinite(value)) {
    return value.toString();
  }
  return STRING_DATA.UNLIMITED;
};

export const getMembershipBooleanDisplayValue = (value: boolean): string => {
  return value ? "✅" : "❌";
};

/**
 * Gets all features for a plan with proper formatting
 */
export const mapMembershipPlanLimits = (
  plan: MembershipPlan,
): ReadonlyArray<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean }> => {
  const features: Array<{ readonly label: string; readonly value: string; readonly isBooleanFeature: boolean }> = [];
  
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
      if (bothEnabled) {
        label = "WhatsApp & Email Alerts";
      } else if (emailValue) {
        label = "Email Alerts";
      } else if (whatsappValue) {
        label = "WhatsApp Alerts";
      } else {
        label = "WhatsApp & Email Alerts";
      }
      
      features.push({
        label,
        value: bothEnabled || emailValue || whatsappValue ? "✅" : "❌",
        isBooleanFeature: true,
      });
      return;
    }
    
    const value =
      typeof rawValue === "number"
        ? getMembershipLimitDisplayValue(rawValue)
        : getMembershipBooleanDisplayValue(rawValue);
    
    features.push({
      label: MEMBERSHIP_LIMIT_LABELS[limitKey],
      value,
      isBooleanFeature,
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

