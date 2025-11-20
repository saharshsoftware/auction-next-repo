import { PlanLimits } from "./PlanLimits";

export interface MembershipPlan {
  readonly id: string;
  readonly label: string;
  readonly priceText: string;
  readonly priceSubtext: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly isPopular: boolean;
  readonly badgeLabel?: string;
  readonly amountInPaise: number;
  readonly previousPlanId?: string;
  readonly razorpayPlanId: string;
  readonly planType: string;
  readonly limits: PlanLimits;
  readonly discountedPriceText: string;
}

