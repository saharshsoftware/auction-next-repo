'use client'
import React from "react";
import useModal from "@/hooks/useModal";
import SurveyModal from "@/components/ modals/SurveyModal";
import { APP_STORE_URLS } from "@/shared/Constants";
import { GoogleIcon } from "../svgIcons/GoogleIcon";
import { AndroidIcon } from "../svgIcons/AndroidIcon";
import { IosIcon } from "../svgIcons/IosIcon";
import { NotesIcon } from "../svgIcons/NotesIcon";
import { useSurveyDisplay } from "@/hooks/useSurveyDisplay";

interface SurveyCardProps {
  /** Whether to show the card randomly on auction list pages */
  isRandom?: boolean;
  /** Survey ID to check for completion status */
  surveyId?: string;
  /** Custom CSS classes */
  className?: string;
  /** Whether this is on an auction detail page */
  isAuctionDetail?: boolean;
  /** Current page number for auction list pages */
  pageNumber?: number;
}

const SurveySection: React.FC<SurveyCardProps> = ({
  isRandom = false,
  surveyId,
  className = "",
  isAuctionDetail = false,
  pageNumber = 0
}) => {
  const { openModal, showModal, hideModal } = useModal();
  const { isVisible, handleMaybeLater } = useSurveyDisplay({
    surveyId,
    isRandom,
    isAuctionDetail,
    pageNumber
  });

  const handleSurveyClick = () => {
    showModal();
  };

  const handleReviewClick = (type: 'google' | 'android' | 'ios') => {
    let url = '';
    switch (type) {
      case 'google':
        url = APP_STORE_URLS.GOOGLE_REVIEW;
        break;
      case 'android':
        url = APP_STORE_URLS.GOOGLE_PLAY;
        break;
      case 'ios':
        url = APP_STORE_URLS.APP_STORE;
        break;
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className={` rounded-xl border border-blue-100 p-4 ${className} transition-all duration-300 ease-in-out `}>
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Help us improve your experience! 
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mx-auto mb-4">
            Your valuable feedback helps us make our platform better for everyone.
            Share your thoughts and help us serve you better.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Review Button */}
          <button
            onClick={() => handleReviewClick('google')}
            className="group flex items-center justify-center gap-3 px-4 py-3  rounded-lg border border-gray-200 hover:shadow-lg"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="font-medium">
              Google Review
            </span>
          </button>

          {/* Android App Button */}
          <button
            onClick={() => handleReviewClick('android')}
            className="group flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:shadow-lg"
          >
            <AndroidIcon className="w-5 h-5" />
            <span className="font-medium">Android App</span>
          </button>

          {/* iOS App Button */}
          <button
            onClick={() => handleReviewClick('ios')}
            className="group flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:shadow-lg"
          >
            <IosIcon className="w-5 h-5" />
            <span className="font-medium">iOS App</span>
          </button>

          {/* Take Survey Button */}
          <button
            onClick={handleSurveyClick}
            className="group flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:shadow-lg"
          >
            <NotesIcon className="w-5 h-5" />
            <span className="font-medium">Take Survey</span>
          </button>
        </div>

        
      </div>

      {/* Survey Modal */}
      {openModal && (
        <SurveyModal
          openModal={openModal}
          hideModal={hideModal}
          isSurveySection={true}
        />
      )}
    </>
  );
};

export default SurveySection; 