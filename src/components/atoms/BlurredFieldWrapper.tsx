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
  const { hideModal, openModal, showModal } = useModal();

  const handleBlurClick = () => {
    showModal();
  };
  return (
    <>
      <div className={`relative ${isBlurred ? " select-none" : ""}`}>
        {" "}
        {/* Prevents selection */}
        <div
          className={`${
            isBlurred ? "blur-sm pointer-events-none select-none" : ""
          } `} // Prevents text selection inside the blurred content
        >
          {children}
        </div>
        {isBlurred && (
          <div className="bg-white/70">
            <button
              onClick={handleBlurClick}
              className="absolute inset-0 flex items-center justify-center cursor-pointer link link-primary font-semibold underline rounded w-fit h-fit m-auto"
            >
              <div className="flex items-center gap-2">
                {icon && <Eye className="h-4 w-4" />}
                <span>{blurText}</span>
              </div>
            </button>
          </div>
        )}
      </div>
      <AuthModal openModal={openModal} hideModal={hideModal} />
    </>
  );
};

export default BlurredFieldWrapper;
