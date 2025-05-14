import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  children: React.ReactElement;
  openModal: boolean;
  customWidthClass?: string;
  modalHeading?: string;
  isCrossVisible?: boolean;
  onClose?: () => void;
}

const CustomModal = ({
  modalHeading,
  children,
  openModal = false,
  customWidthClass = "",
  isCrossVisible = false,
  onClose,
}: Props) => {
  const getRequiredWidth = () => {
    return customWidthClass || "lg:w-1/2 md:w-3/5 sm:w-4/5 w-11/12";
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`relative bg-white rounded-lg flex flex-col gap-4 p-6 ${getRequiredWidth()}`}
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
};

export default CustomModal;
