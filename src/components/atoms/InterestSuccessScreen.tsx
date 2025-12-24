"use client";

/**
 * InterestSuccessScreen Component
 * 
 * A celebratory modal that appears after a user successfully submits their
 * interest in a property. Features confetti, animations, and an encouraging
 * message to make the user feel accomplished.
 * 
 * @module InterestSuccessScreen
 */

import React, { useEffect } from "react";
import { useConfettiStore } from "@/zustandStore/confettiStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faArrowRight, faHome } from "@fortawesome/free-solid-svg-icons";
import CustomModal from "./CustomModal";

interface InterestSuccessScreenProps {
  /** Title of the property the user showed interest in */
  readonly propertyTitle?: string;
  /** Location of the property */
  readonly propertyLocation?: string;
  /** Callback when user closes the success screen */
  readonly onClose: () => void;
  /** Callback to browse more properties */
  readonly onBrowseMore?: () => void;
}

/**
 * InterestSuccessScreen displays a celebratory modal after successful
 * interest submission. Triggers confetti and shows an accomplishment message.
 * 
 * @param props - Component props
 * @returns The success modal component
 */
const InterestSuccessScreen: React.FC<InterestSuccessScreenProps> = ({
  propertyTitle,
  propertyLocation,
  onClose,
  onBrowseMore,
}) => {
  /**
   * Effect to trigger confetti on mount and clean up on unmount
   */
  useEffect(() => {
    // Trigger confetti celebration
    useConfettiStore.getState().showConfetti();

    // Auto-hide confetti after 5 seconds (but don't auto-close modal)
    const confettiTimer = setTimeout(() => {
      useConfettiStore.getState().hideConfetti();
    }, 5000);

    // Cleanup: hide confetti when component unmounts
    return () => {
      clearTimeout(confettiTimer);
      useConfettiStore.getState().hideConfetti();
    };
  }, []);

  /**
   * Handles closing the success modal
   */
  const handleClose = (): void => {
    useConfettiStore.getState().hideConfetti();
    onClose();
  };

  /**
   * Handles the "Browse More" action
   */
  const handleBrowseMore = (): void => {
    useConfettiStore.getState().hideConfetti();
    if (onBrowseMore) {
      onBrowseMore();
    } else {
      onClose();
    }
  };

  return (
    <CustomModal
      openModal={true}
      onClose={handleClose}
      isCrossVisible={true}
      customWidthClass="lg:w-[35%] md:w-3/5 sm:w-4/5 w-11/12"
    >
      <div className="text-center">
        {/* Success Icon with Animation */}
        <div className="mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full animate-bounce-success">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="h-10 w-10 text-green-500"
            />
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          You&apos;re One Step Closer! 🎉
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Your interest has been registered successfully
        </p>

        {/* Property Info */}
        {(propertyTitle || propertyLocation) && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100 text-left">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
              <FontAwesomeIcon icon={faHome} className="h-3 w-3" />
              <span>Property of Interest</span>
            </div>
            {propertyTitle && (
              <p className="text-gray-900 font-semibold text-sm line-clamp-2">
                {propertyTitle}
              </p>
            )}
            {propertyLocation && (
              <p className="text-gray-500 text-xs mt-1">
                {propertyLocation}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <div className="mb-5 text-left">
          <p className="text-gray-700 text-sm mb-2">
            <strong>Great choice!</strong> Our team will review your request and get back to you shortly.
          </p>
          <p className="text-gray-500 text-xs">
            We typically respond within 24-48 hours. Keep an eye on your email and phone!
          </p>
        </div>

        {/* What's Next Section */}
        <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100 text-left">
          <p className="text-blue-800 font-semibold text-sm mb-2">
            What happens next?
          </p>
          <ul className="text-blue-600 text-xs space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>Our team will verify the property details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>You&apos;ll receive auction guidance & support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>Get help with documentation & bidding</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleBrowseMore}
            className="w-full bg-brand-color text-white py-3 px-6 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Browse More Properties
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
          >
            Continue viewing this property
          </button>
        </div>

        {/* Custom Animation */}
        <style jsx>{`
          @keyframes bounce-success {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          .animate-bounce-success {
            animation: bounce-success 0.6s ease-in-out;
          }
        `}</style>
      </div>
    </CustomModal>
  );
};

export default InterestSuccessScreen;

