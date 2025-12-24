"use client";

/**
 * PartnerAchievementsSection Component
 * 
 * Displays platform statistics and a prominent "Partner with Us" CTA.
 * Placed between HeroSection and HomeRecommendationsClient on the homepage.
 * 
 * @module PartnerAchievementsSection
 */

import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import AchievementStats from "./AchievementStats";

/**
 * PartnerAchievementsSection displays platform statistics and a prominent
 * "Partner with Us" CTA. Uses the AchievementStats component for the stats grid.
 * 
 * @returns The section component with stats and partner CTA
 */
const PartnerAchievementsSection: React.FC = () => {
  const router = useRouter();

  /**
   * Handles navigation to the partner page
   */
  const handlePartnerClick = (): void => {
    router.push(ROUTE_CONSTANTS.PARTNER);
  };

  return (
    <section className="py-12">
      <div className="common-section mx-auto">
        {/* Achievement Stats - Separate component for easy customization */}
        <AchievementStats />

        {/* Partner With Us - Prominent CTA */}
        <div className="bg-brand-color rounded-2xl p-6 md:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4">
                <FontAwesomeIcon icon={faHandshake} className="h-4 w-4" />
                <span className="text-sm font-medium">Partner Program</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Become a Partner with Us
              </h2>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Are you a broker or financial professional? Join India&apos;s
                fastest-growing bank auction platform and grow your business
                with us.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handlePartnerClick}
                className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Partner Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerAchievementsSection;

