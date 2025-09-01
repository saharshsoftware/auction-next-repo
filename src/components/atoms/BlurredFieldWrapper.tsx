"use client";
import React from "react";
import AuthModal from "../ modals/AuthModal";
import useModal from "@/hooks/useModal";
import { Eye } from 'lucide-react';

interface IBlurredFieldWrapperProps {
  children: React.ReactNode;
  blurText?: string;
  isBlurred?: boolean;
  hasImageCarousel?: boolean;
  icon?: React.ReactNode;
}

const BlurredFieldWrapper: React.FC<IBlurredFieldWrapperProps> = ({
  children,
  blurText = "Login to view",
  isBlurred,
  hasImageCarousel = false,
  icon,
}) => {
  const { showModal, openModal, hideModal } = useModal();

  if (!isBlurred) {
    return <div className="relative">{children}</div>;
  }

  const renderCTA = () => {
    if (hasImageCarousel) {
      return (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <button
            onClick={showModal}
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
          onClick={showModal}
          className="absolute inset-0 flex items-center justify-center cursor-pointer link link-primary font-semibold underline rounded w-fit h-fit m-auto"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{blurText}</span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="relative select-none">
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>
        {renderCTA()}
      </div>
      <AuthModal openModal={openModal} hideModal={hideModal} />
    </>
  );
};

export default BlurredFieldWrapper;
