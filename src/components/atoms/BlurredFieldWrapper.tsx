"use client";
import React, { useState, useEffect } from "react";
import AuthModal from "../ modals/AuthModal";
import useModal from "@/hooks/useModal";
import { Eye } from 'lucide-react';
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { UPGRADE_TO_PREMIUM_EVENTS } from "@/shared/Constants";
import { trackUpgradeToPremiumEvent } from "@/helpers/WindowHelper";

type BlurType = "login" | "upgrade";
type UpgradeSource = keyof typeof UPGRADE_TO_PREMIUM_EVENTS;

interface IBlurredFieldWrapperProps {
  children: React.ReactNode;
  blurText?: string;
  isBlurred?: boolean;
  hasImageCarousel?: boolean;
  icon?: React.ReactNode;
  blurType?: BlurType;
  upgradeSource?: UpgradeSource;
}

const BlurredFieldWrapper: React.FC<IBlurredFieldWrapperProps> = ({
  children,
  blurText,
  isBlurred,
  hasImageCarousel = false,
  icon,
  blurType = "login",
  upgradeSource,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();

  // Track when component has mounted to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const defaultBlurText = blurType === "upgrade" ? "Upgrade to premium plan" : "Login to view";
  const displayText = blurText || defaultBlurText;

  const handleClick = () => {
    if (blurType === "upgrade" && upgradeSource) {
      const eventName = UPGRADE_TO_PREMIUM_EVENTS[upgradeSource];
      trackUpgradeToPremiumEvent(eventName);
      router.push(ROUTE_CONSTANTS.PRICING);
    } else {
      showModal();
    }
  };

  // Use consistent blur state: default to false before mount to match server
  const shouldBlur = hasMounted ? isBlurred : false;

  const renderCTA = () => {
    if (!shouldBlur) return null;

    if (hasImageCarousel) {
      return (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <button
            onClick={handleClick}
            className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 font-semibold"
          >
            <Eye className="h-5 w-5" />
            <span>View</span>
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white/70">
        <button
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center cursor-pointer link link-primary font-semibold underline rounded w-fit h-fit m-auto"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{displayText}</span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`relative ${shouldBlur ? 'select-none' : ''}`}>
        <div className={shouldBlur ? 'blur-sm pointer-events-none select-none' : ''}>
          {children}
        </div>
        {renderCTA()}
      </div>
      {blurType === "login" && (
        <AuthModal openModal={openModal} hideModal={hideModal} />
      )}
    </>
  );
};

export default BlurredFieldWrapper;
