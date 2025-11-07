export interface ApiSubscriptionLimits {
  readonly collectionsMax: number;
  readonly alertsMax: number;
  readonly savedSearchesMax: number | null;
  readonly whatsappAlerts: boolean;
  readonly emailAlerts: boolean;
}

export interface ApiSubscription {
  readonly id: string;
  readonly status: string;
  readonly planId: string;
  readonly planName: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly renewalDate?: string;
  readonly autoRenewal: boolean;
  readonly paymentMethod?: string;
  readonly lastPaymentDate?: string;
  readonly billingEmail?: string;
  readonly gstNumber?: string;
  readonly amount: number;
  readonly currency: string;
}

export interface ApiSubscriptionData {
  readonly subscription: ApiSubscription | null;
  readonly tier: string;
  readonly limits: ApiSubscriptionLimits;
}

export interface ApiSubscriptionResponse {
  readonly success: boolean;
  readonly data: ApiSubscriptionData;
}
