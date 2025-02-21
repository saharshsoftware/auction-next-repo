import React, { useState } from "react";
import AuthModal from "../ modals/AuthModal";
import useModal from "@/hooks/useModal";

interface IBlurredFieldWrapperProps {
  children: React.ReactNode;
  blurText?: string;
  isBlurred?: boolean;
}

const BlurredFieldWrapper: React.FC<IBlurredFieldWrapperProps> = ({
  children,
  blurText = "Login to view",
  isBlurred,
}) => {
  const { hideModal, openModal, showModal } = useModal();

  const handleBlurClick = () => {
    showModal();
  };
  return (
    <>
      <div className="relative select-none">
        {" "}
        {/* Prevents selection */}
        <div
          className={`${
            isBlurred ? "blur-sm" : ""
          } pointer-events-none select-none`} // Prevents text selection inside the blurred content
        >
          {children}
        </div>
        {isBlurred && (
          <div className="bg-white/70">
            <button
              onClick={handleBlurClick}
              className="absolute inset-0 flex items-center justify-center cursor-pointer  link link-primary font-semibold underline rounded w-fit h-fit m-auto"
            >
              {blurText}
            </button>
          </div>
        )}
      </div>
      <AuthModal openModal={openModal} hideModal={hideModal} />
    </>
  );
};

export default BlurredFieldWrapper;
