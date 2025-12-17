export interface CheckoutApiRequest {
  readonly subscriptionId: string;
}

export interface CheckoutApiPrefill {
  readonly name: string;
  readonly email: string;
  readonly contact: string;
}

export interface CheckoutApiTheme {
  readonly color: string;
}

export interface CheckoutApiData {
  readonly key: string;
  readonly subscription_id: string;
  readonly name: string;
  readonly description: string;
  readonly prefill: CheckoutApiPrefill;
  readonly theme: CheckoutApiTheme;
}

export interface CheckoutApiResponse {
  readonly success: boolean;
  readonly data: CheckoutApiData;
}
