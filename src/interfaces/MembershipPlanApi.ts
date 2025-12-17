import { ApiPlanLimits } from "./PlanLimits";

export type { ApiPlanLimits };

export interface OneTimeOption {
  readonly id: number;
  readonly duration: number;
  readonly durationUnit: string;
  readonly price: number;
  readonly discountedPrice: number;
  readonly displayName: string;
  readonly description: string | null;
  readonly isActive: boolean;
  readonly sortOrder: number;
}

export interface ApiMembershipPlanAttributes {
  readonly planLimits: ApiPlanLimits;
  readonly razorpayPlanId: string;
  readonly isRecommended: boolean;
  readonly price: number;
  readonly discountedPrice: number;
  readonly name: string;
  readonly description: string;
  readonly frequency: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
  readonly slug: string;
  readonly oneTimeOptions: readonly OneTimeOption[];
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
