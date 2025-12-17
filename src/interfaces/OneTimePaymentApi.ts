export interface CreateOneTimeOrderRequest {
  readonly membershipPlanId: number;
  readonly optionIndex: number;
  readonly notes?: Record<string, string>;
}

export interface CreateOneTimeOrderData {
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly order: {
    readonly amount: number;
    readonly amount_due: number;
    readonly amount_paid: number;
    readonly attempts: number;
    readonly created_at: number;
    readonly currency: string;
    readonly entity: string;
  };
}

export interface CreateOneTimeOrderResponse {
  readonly success: boolean;
  readonly data: CreateOneTimeOrderData;
}

export interface OneTimeCheckoutRequest {
  readonly orderId: string;
}

export interface OneTimeCheckoutPrefill {
  readonly name: string;
  readonly email: string;
  readonly contact: string;
}

export interface OneTimeCheckoutTheme {
  readonly color: string;
}

export interface OneTimeCheckoutData {
  readonly key: string;
  readonly order_id: string;
  readonly amount: number;
  readonly currency: string;
  readonly name: string;
  readonly description: string;
  readonly prefill: OneTimeCheckoutPrefill;
  readonly theme: OneTimeCheckoutTheme;
}

export interface OneTimeCheckoutResponse {
  readonly success: boolean;
  readonly data: OneTimeCheckoutData;
}

