"use client";
import React from "react";
import { WishlistSvg } from "../svgIcons/WishlistSvg";
import { STRING_DATA } from "@/shared/Constants";

interface FloatingInterestButtonProps {
  readonly isInterested: boolean;
  readonly isModalOpen: boolean;
  readonly onShowInterest: () => void;
}

/**
 * FloatingInterestButton displays a fixed "Show Interest" button.
 * - Mobile: Full-width button at the bottom of the screen
 * - Desktop: Compact floating button on the right side
 * Hidden when user has already shown interest or when the interest modal is open.
 */
const FloatingInterestButton: React.FC<FloatingInterestButtonProps> = ({
  isInterested,
  isModalOpen,
  onShowInterest,
}) => {
  if (isInterested || isModalOpen) return null;

  return (
    <>
      {/* Mobile: Full-width bottom button */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <button
          onClick={onShowInterest}
          className="w-full bg-brand-color text-white py-4 px-6 rounded-xl font-bold text-lg shadow-[0_8px_30px_rgba(83,86,255,0.4)] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <WishlistSvg />
          {STRING_DATA.SHOW_INTEREST.toUpperCase()}
        </button>
      </div>

      {/* Desktop: Compact floating button on right side */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <button
          onClick={onShowInterest}
          className="bg-brand-color text-white py-3 px-6 rounded-xl font-bold text-base shadow-[0_8px_30px_rgba(83,86,255,0.4)] flex items-center justify-center gap-2 hover:opacity-90 hover:scale-105 active:scale-100 transition-all"
        >
          <WishlistSvg />
          {STRING_DATA.SHOW_INTEREST.toUpperCase()}
        </button>
      </div>

      {/* Spacer to prevent content from being hidden by floating button (mobile only) */}
      <div className="h-24 md:hidden" />
    </>
  );
};

export default FloatingInterestButton;

