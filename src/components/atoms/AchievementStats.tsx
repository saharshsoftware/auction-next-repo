"use client";

/**
 * AchievementStats Component
 * 
 * Displays platform statistics in a clean, subtle grid layout.
 * This component is used in the PartnerAchievementsSection on the homepage.
 * 
 * @module AchievementStats
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ACHIEVEMENT_STATS } from "@/shared/Constants";

/**
 * AchievementStats displays platform statistics in a clean, understated design.
 * 
 * @returns The achievement stats grid component
 */
const AchievementStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10">
      {ACHIEVEMENT_STATS.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center py-4 md:py-6 px-3 md:px-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
        >
          {/* Icon */}
          <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-3">
            <FontAwesomeIcon
              icon={stat.icon}
              className="h-5 w-5 md:h-6 md:w-6 text-blue-600"
            />
          </div>
          
          {/* Value */}
          <div className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">
            {stat.value}
          </div>
          
          {/* Label */}
          <div className="text-xs md:text-sm text-gray-500">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementStats;

