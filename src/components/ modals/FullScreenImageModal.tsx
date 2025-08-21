/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import logo from "@/assets/images/no-data.jpg";

interface IFullScreenImageModal {
  openModal: boolean;
  hideModal?: () => void;
  imageUrl?: string;
}

const FullScreenImageModal: React.FC<IFullScreenImageModal> = ({
  openModal,
  hideModal = () => {},
  imageUrl,
}) => {
  const placeholderImage = logo.src;
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when modal opens
  useEffect(() => {
    if (openModal) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [openModal]);

  // Keyboard navigation - ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!openModal) return;
      if (e.key === 'Escape') {
        hideModal();
      }
    };

    if (openModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [openModal, hideModal]);

  // Prevent body scroll
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [openModal]);

  const handleClose = () => {
    hideModal();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-[9999] bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
        aria-label="Close modal"
        type="button"
      >
        <FontAwesomeIcon icon={faX} className="text-lg" />
      </button>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-sm">Loading image...</p>
          </div>
        )}
        
        {/* Error State */}
        {hasError && (
          <div className="flex flex-col items-center gap-4 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faX} className="text-2xl text-red-400" />
            </div>
            <p className="text-lg font-medium">Failed to load image</p>
            <p className="text-sm text-white/70">The image could not be displayed</p>
          </div>
        )}
        
        {/* Image Display - Always render but control visibility */}
        <img
          src={imageUrl || placeholderImage}
          alt="Displayed Image"
          className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
            isLoading || hasError ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: isLoading || hasError ? 'none' : 'block' }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999] text-white/60 text-xs">
        <p>Press ESC to close</p>
      </div>
    </div>
  );
};

export default FullScreenImageModal;
