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
  "whatsappAlerts",
  "emailAlerts",
];

export const getMembershipLimitDisplayValue = (value: number): string => {
  if (Number.isFinite(value)) {
    return value.toString();
  }
  return STRING_DATA.UNLIMITED;
};

export const getMembershipBooleanDisplayValue = (value: boolean): string => {
  return value ? STRING_DATA.YES : STRING_DATA.NO;
};

export const mapMembershipPlanLimits = (
  plan: MembershipPlan,
): ReadonlyArray<{ readonly label: string; readonly value: string }> => {
  return MEMBERSHIP_LIMIT_ORDER.map((limitKey) => {
    const rawValue: number | boolean = plan.limits[limitKey];
    const value =
      typeof rawValue === "number"
        ? getMembershipLimitDisplayValue(rawValue)
        : getMembershipBooleanDisplayValue(rawValue);
    return {
      label: MEMBERSHIP_LIMIT_LABELS[limitKey],
      value,
    };
  });
};

