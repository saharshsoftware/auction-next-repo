import React from "react";
import MembershipPlanCard from "@/components/atoms/MembershipPlanCard";
import { MEMBERSHIP_PLANS } from "@/shared/MembershipPlans";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";

/**
 * Displays the pricing plans page with membership information.
 */
const PricingPlans: React.FC = () => {
  const planCards: ReadonlyArray<React.ReactNode> = MEMBERSHIP_PLANS.map((plan: MembershipPlan) => (
    <MembershipPlanCard key={plan.id} plan={plan} />
  ));
  return (
    <section className="common-section py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{STRING_DATA.MEMBERSHIP_PLANS}</h1>
          <p className="max-w-2xl text-sm text-gray-600 md:text-base">{STRING_DATA.MEMBERSHIP_DESCRIPTION}</p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{planCards}</div>
      </div>
    </section>
  );
};

export default PricingPlans;

