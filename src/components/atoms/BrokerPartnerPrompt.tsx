"use client";

/**
 * BrokerPartnerPrompt Component
 * 
 * A floating prompt card that encourages broker users to join the partner program.
 * This component is designed to be non-intrusive while still capturing attention.
 * 
 * Features:
 * - Only displays for users with userType === "Broker"
 * - Shows maximum 2 times per day (controlled via localStorage)
 * - Appears after a 5-second delay to avoid interrupting initial page load
 * - Responsive design: centered on mobile, right-aligned on desktop
 * - Animated slide-up entrance for better UX
 * 
 * @module BrokerPartnerPrompt
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { STRING_DATA } from "@/shared/Constants";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserData } from "@/hooks/useAuthenticated";
import {
  canShowBrokerPrompt,
  incrementBrokerPromptCount,
  SHOW_DELAY_MS,
} from "@/helpers/BrokerPartnerPromptHelper";
import { USER_TYPE } from "@/types.d";

/**
 * BrokerPartnerPrompt displays a slide-up card prompting broker users
 * to become partners. The prompt is shown maximum twice per day and
 * includes a dismiss button for user control.
 * 
 * @returns The prompt component or null if conditions are not met
 * 
 * @example
 * // Add to layout.tsx to show on all pages
 * <BrokerPartnerPrompt />
 */
const BrokerPartnerPrompt: React.FC = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const { fullProfileData } = useUserProfile(!!userData);
  const [isVisible, setIsVisible] = useState(false);

  // Check if the current user is a broker
  const isBroker = fullProfileData?.userType === USER_TYPE.BROKER;
  
  /**
   * Effect to handle the delayed display of the prompt.
   * Only runs when user is confirmed as a broker and hasn't exceeded daily limit.
   */
  useEffect(() => {
    if (isBroker && canShowBrokerPrompt()) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        incrementBrokerPromptCount();
      }, SHOW_DELAY_MS);

      // Cleanup timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [isBroker]);

  /**
   * Handles the dismiss action when user clicks the close button.
   * Simply hides the prompt without affecting the daily count.
   */
  const handleDismiss = (): void => {
    setIsVisible(false);
  };

  /**
   * Handles the click on "Learn More" button.
   * Navigates to the partner page and hides the prompt.
   */
  const handlePartnerClick = (): void => {
    router.push(ROUTE_CONSTANTS.PARTNER);
    setIsVisible(false);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-4 z-40 animate-slide-up">
      {/* Prompt Card Container */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-4 md:p-5 max-w-sm mx-auto md:mx-0 relative">
        
        {/* Close/Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white p-1 transition-colors"
          aria-label="Dismiss partner prompt"
        >
          <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
        </button>

        {/* Content Layout */}
        <div className="flex items-start gap-3 md:gap-4">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHandshake}
                className="h-5 w-5 md:h-6 md:w-6 text-white"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="pr-4">
            <h4 className="font-bold text-base md:text-lg mb-1">
              Become a Partner
            </h4>
            <p className="text-blue-100 text-xs md:text-sm mb-3">
              As a broker, you can grow your business with our partner program.
              Get exclusive leads and support!
            </p>
            
            {/* Call-to-Action Button */}
            <button
              onClick={handlePartnerClick}
              className="bg-white text-blue-600 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-xs md:text-sm hover:bg-blue-50 transition-colors"
            >
              Learn More →
            </button>
          </div>
        </div>
      </div>

      {/* Slide-up Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrokerPartnerPrompt;
