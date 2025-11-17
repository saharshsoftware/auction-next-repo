export interface CreateSubscriptionApiRequest {
  readonly planId: string;
  readonly startAt: string;
  readonly planType: string;
}

export interface CreateSubscriptionDetails {
  readonly id: string;
  readonly entity: string;
  readonly plan_id: string;
  readonly customer_id: string;
  readonly status: string;
  readonly current_start: string | null;
  readonly current_end: string | null;
  readonly ended_at: string | null;
  readonly quantity: number;
  readonly notes: {
    readonly userId: string;
    readonly planType: string;
  };
  readonly charge_at: string | null;
  readonly start_at: string | null;
  readonly end_at: string | null;
  readonly auth_attempts: number;
  readonly total_count: number;
  readonly paid_count: number;
  readonly customer_notify: boolean;
  readonly created_at: number;
  readonly expire_by: string | null;
  readonly short_url: string;
  readonly has_scheduled_changes: boolean;
  readonly change_scheduled_at: string | null;
  readonly source: string;
  readonly remaining_count: number;
}

export interface CreateSubscriptionApiData {
  readonly subscriptionId: string;
  readonly customerId: string;
  readonly subscription: CreateSubscriptionDetails;
}

export interface CreateSubscriptionApiResponse {
  readonly success: boolean;
  readonly data: CreateSubscriptionApiData;
}
