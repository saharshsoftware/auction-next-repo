export interface MembershipPlan {
  readonly id: "free" | "broker" | "brokerPlus";
  readonly label: string;
  readonly priceText: string;
  readonly priceSubtext: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly isPopular: boolean;
  readonly badgeLabel?: string;
  readonly limits: {
    readonly collectionsMax: number;
    readonly alertsMax: number;
    readonly savedSearchesMax: number;
    readonly whatsappAlerts: boolean;
    readonly emailAlerts: boolean;
  };
}

