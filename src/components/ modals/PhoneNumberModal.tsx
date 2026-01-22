"use client";
import React from "react";
import CustomModal from "../atoms/CustomModal";
import { Phone } from "lucide-react";

interface IPhoneNumberModal {
  visible: boolean;
  onClose: () => void;
  phoneNumbers: string[];
  onSelectNumber: (phoneNumber: string) => void;
}

const PhoneNumberModal: React.FC<IPhoneNumberModal> = ({
  visible,
  onClose,
  phoneNumbers,
  onSelectNumber,
}) => {
  // Handle empty state
  if (phoneNumbers.length === 0) {
    return null;
  }

  const handlePhoneClick = (phoneNumber: string) => {
    onSelectNumber(phoneNumber);
    onClose();
  };

  return (
    <CustomModal
      openModal={visible}
      modalHeading="Select Phone Number"
      customWidthClass="md:w-[32%] sm:w-3/5 w-11/12"
      isCrossVisible={true}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 w-full">
        <p className="text-left text-gray-700 text-sm">
          Choose a phone number to call:
        </p>
        <div className="flex flex-col gap-3">
          {phoneNumbers.map((phoneNumber, index) => (
            <button
              key={index}
              onClick={() => handlePhoneClick(phoneNumber)}
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left"
              aria-label={`Call ${phoneNumber}`}
            >
              <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <span className="text-base font-semibold text-gray-900">
                {phoneNumber}
              </span>
            </button>
          ))}
        </div>
      </div>
    </CustomModal>
  );
};

export default PhoneNumberModal;
