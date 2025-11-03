import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactElement;
  openModal: boolean;
  customWidthClass?: string;
  modalHeading?: string;
  isCrossVisible?: boolean;
  onClose?: () => void;
  useStickyHeader?: boolean;
}

const CustomModal = ({
  modalHeading,
  children,
  openModal = false,
  customWidthClass = "",
  isCrossVisible = false,
  onClose,
  useStickyHeader = false,
}: Props) => {
  const getRequiredWidth = () => {
    return customWidthClass || "lg:w-1/2 md:w-3/5 sm:w-4/5 w-11/12";
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (openModal) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore body scroll
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [openModal]);

  if (!openModal) return null;

  // Original behavior (centered, no sticky header)
  if (!useStickyHeader) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className={`relative bg-white rounded-lg flex flex-col gap-4 p-6 max-h-[90vh] overflow-y-auto ${getRequiredWidth()}`}
        >
          {isCrossVisible && (
            <button
              onClick={onClose}
              className="absolute top-[1.2rem] right-[1.2rem] bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold z-[60]"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          )}
          {modalHeading && (
            <h2 className="custom-h2-class text-left text-3xl">{modalHeading}</h2>
          )}
          <div className="flex flex-col items-center">{children}</div>
        </div>
      </div>
    );
  }

  // New behavior (sticky header)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className={`relative bg-white rounded-lg flex flex-col max-h-[calc(100vh-4rem)] ${getRequiredWidth()}`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white rounded-t-lg p-6 pb-4 z-10">
          {isCrossVisible && (
            <button
              onClick={onClose}
              className="absolute top-[1.2rem] right-[1.2rem] bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold z-[60]"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          )}
          {modalHeading && (
            <h2 className="custom-h2-class text-left text-3xl pr-12">{modalHeading}</h2>
          )}
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="flex flex-col items-center gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
