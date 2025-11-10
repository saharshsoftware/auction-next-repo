export interface UserSubscriptionLimits {
  readonly collectionsMax: number;
  readonly alertsMax: number;
  readonly savedSearchesMax: number | null;
  readonly whatsappAlerts: boolean;
  readonly emailAlerts: boolean;
}

export interface UserSubscription {
  readonly createdAt: string;
  readonly id: number;
  readonly status: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly updatedAt: string;
  readonly sitemap_exclude: boolean;
  readonly subscriptionType: string;
  readonly razorpaySubscriptionId: string;
  readonly razorpayCustomerId: string;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string;
  readonly cancelAt: string | null;
  readonly canceledAt: string | null;
}

export interface UserRazorpaySubscription {
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
  readonly payment_method: string | null;
  readonly offer_id: string | null;
  readonly remaining_count: number;
}

export interface UserSubscriptionDetails {
  readonly subscription: UserSubscription | null;
  readonly razorpaySubscription: UserRazorpaySubscription | null;
  readonly tier: string;
  readonly limits: UserSubscriptionLimits;
}

export interface UserProfileApiResponse {
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly interestedCities: string | null;
  readonly interestedCategories: string | null;
  readonly userType: string | null;
  readonly budgetRanges: string | null;
  readonly subscriptionDetails: UserSubscriptionDetails;
}
