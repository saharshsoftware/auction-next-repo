import PricingPlans from "@/components/templates/PricingPlans";
import { fetchMembershipPlans } from "@/server/actions/membershipPlans";
import { fetchUserProfile } from "@/server/actions/userProfile";

// Add 5 minutes to the revalidate time
export const revalidate = 5 * 60; // 5 minutes
export const dynamic = 'force-static'; 

export default async function Page(): Promise<JSX.Element> {
  const [membershipPlans, userProfile] = await Promise.all([
    fetchMembershipPlans(),
    fetchUserProfile(),
  ]);
  if (!membershipPlans || membershipPlans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Unable to load membership plans</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }
  const subscriptionStatus = userProfile?.subscriptionDetails?.subscription?.status?.toLowerCase() || null;
  const hasSubscriptionSnapshot = !!userProfile?.subscriptionDetails?.subscription;
  return (
    <PricingPlans
      showTooltips={false}
      showLegend={false}
      showDescriptions={true}
      membershipPlans={membershipPlans}
      initialSubscriptionStatus={subscriptionStatus}
      hasServerSubscriptionSnapshot={hasSubscriptionSnapshot}
      initialUserProfile={userProfile}
    />
  );
}