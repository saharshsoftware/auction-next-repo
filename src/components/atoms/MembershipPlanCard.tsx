"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ActionButton from "./ActionButton";
import { MembershipPlan } from "@/interfaces/MembershipPlan";
import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { mapMembershipPlanLimits } from "@/shared/MembershipUtils";

interface MembershipPlanCardProps {
  readonly plan: MembershipPlan;
}

const CTA_ROUTE_MAP: Record<MembershipPlan["id"], string> = {
  free: ROUTE_CONSTANTS.DASHBOARD,
  broker: ROUTE_CONSTANTS.REGISTER,
  brokerPlus: ROUTE_CONSTANTS.CONTACT,
};

/**
 * Renders a responsive membership plan card.
 */
const MembershipPlanCard: React.FC<MembershipPlanCardProps> = (props) => {
  const { plan } = props;
  const router: ReturnType<typeof useRouter> = useRouter();
  const limitEntries: ReadonlyArray<{ readonly label: string; readonly value: string }> = mapMembershipPlanLimits(plan);
  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow transition-all duration-300 ${
        plan.isPopular ? "border-brand-color shadow-lg" : "border-gray-200"
      }`}
    >
      {plan.badgeLabel ? (
        <span className="w-max rounded-full border border-brand-color px-3 py-1 text-xs font-semibold text-brand-color">
          {plan.badgeLabel}
        </span>
      ) : null}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-gray-900">{plan.label}</h3>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{plan.priceText}</span>
        <span className="text-sm text-gray-500">{plan.priceSubtext}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-gray-900">{STRING_DATA.MEMBERSHIP_LIMITS}</h4>
        <ul className="flex flex-col gap-2">
          {limitEntries.map((item) => (
            <li key={item.label} className="flex justify-between text-sm text-gray-600">
              <span>{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <ActionButton
          text={plan.ctaLabel}
          customClass="w-full justify-center"
          onclick={() => router.push(CTA_ROUTE_MAP[plan.id])}
        />
      </div>
    </div>
  );
};

export default MembershipPlanCard;

