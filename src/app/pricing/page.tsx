import PricingPlans from "@/components/templates/PricingPlans";
import { fetchMembershipPlans } from "@/server/actions/membershipPlans";

export default async function Page(): Promise<JSX.Element> {
  const membershipPlans = await fetchMembershipPlans();

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
  return <PricingPlans showTooltips={false} showLegend={false} showDescriptions={true} membershipPlans={membershipPlans} />;
}

