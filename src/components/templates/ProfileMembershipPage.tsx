"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ProfileMembershipSection from "@/components/ui/ProfileMembershipSection";
import ActionButton from "@/components/atoms/ActionButton";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { STRING_DATA } from "@/shared/Constants";

const ProfileMembershipPage: React.FC = () => {
  const router = useRouter();

  const handleCancelSubscription = () => {
    console.info("[ProfileMembershipPage] Cancel subscription requested");
    // TODO: Integrate with cancellation API endpoint.
  };

  const handleNavigateBack = () => {
    router.push(ROUTE_CONSTANTS.PROFILE);
  };

  return (
    <section className="common-section py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{STRING_DATA.MEMBERSHIP_SETTINGS}</h1>
            <p className="text-sm text-gray-600 md:text-base">
              Manage your current membership plan, billing preferences, and past payments.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton
              text={STRING_DATA.CANCEL_SUBSCRIPTION}
              onclick={handleCancelSubscription}
              isDeleteButton={true}
            />
            <ActionButton
              text={STRING_DATA.BACK}
              onclick={handleNavigateBack}
              isActionButton={false}
            />
          </div>
        </header>
        <ProfileMembershipSection />
      </div>
    </section>
  );
};

export default ProfileMembershipPage;

