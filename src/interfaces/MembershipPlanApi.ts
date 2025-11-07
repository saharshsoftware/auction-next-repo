export interface ApiPlanLimits {
  readonly alertsMax: number;
  readonly emailAlerts: boolean;
  readonly collectionsMax: number;
  readonly whatsappAlerts: boolean;
  readonly savedSearchesMax: "infinity" | number;
}

export interface ApiMembershipPlanAttributes {
  readonly planLimits: ApiPlanLimits;
  readonly razorpayPlanId: string;
  readonly isRecommended: boolean;
  readonly price: number;
  readonly name: string;
  readonly description: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

export interface ApiMembershipPlan {
  readonly id: number;
  readonly attributes: ApiMembershipPlanAttributes;
}

export interface ApiMembershipPlansResponse {
  readonly data: readonly ApiMembershipPlan[];
  readonly meta: {
    readonly pagination: {
      readonly page: number;
      readonly pageSize: number;
      readonly pageCount: number;
      readonly total: number;
    };
  };
}
