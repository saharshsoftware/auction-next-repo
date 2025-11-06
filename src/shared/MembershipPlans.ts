import { MembershipPlan } from "@/interfaces/MembershipPlan";

export const UNLIMITED_LIMIT_VALUE = Number.POSITIVE_INFINITY;

export const MEMBERSHIP_PLANS: readonly MembershipPlan[] = [
  {
    id: "free",
    label: "Free",
    priceText: "₹0",
    priceSubtext: "per month",
    description: "Intelligence for everyday tasks",
    ctaLabel: "Stay on Free",
    isPopular: false,
    amountInPaise: 0,
    limits: {
      collectionsMax: 5,
      alertsMax: 3,
      savedSearchesMax: UNLIMITED_LIMIT_VALUE,
      whatsappAlerts: false,
      emailAlerts: false,
    },
  },
  {
    id: "broker",
    label: "Broker",
    priceText: "₹399",
    priceSubtext: "per month",
    description: "More access to popular features",
    ctaLabel: "Upgrade to Broker",
    isPopular: true,
    badgeLabel: "Popular",
    amountInPaise: 39900,
    limits: {
      collectionsMax: 5,
      alertsMax: 3,
      savedSearchesMax: UNLIMITED_LIMIT_VALUE,
      whatsappAlerts: false,
      emailAlerts: true,
    },
  },
  {
    id: "brokerPlus",
    label: "Broker Plus",
    priceText: "₹1,999",
    priceSubtext: "per month",
    description: "More access to advanced intelligence",
    ctaLabel: "Get Broker Plus",
    isPopular: false,
    amountInPaise: 199900,
    limits: {
      collectionsMax: 10,
      alertsMax: 5,
      savedSearchesMax: UNLIMITED_LIMIT_VALUE,
      whatsappAlerts: true,
      emailAlerts: true,
    },
  },
];

