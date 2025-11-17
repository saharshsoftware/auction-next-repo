export interface CancelSubscriptionApiRequest {
  readonly cancelAtCycleEnd: boolean;
}

export interface CancelSubscriptionApiResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: {
    readonly subscriptionId: string;
    readonly status: string;
    readonly cancelledAt: string;
    readonly willEndAt?: string;
  };
}
