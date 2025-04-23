"use client";
import React from "react";
import OtpInput from "react-otp-input";

interface OTPInputProps {
  length?: number;
  onChange: (otp: string) => void;
  disabled?: boolean;
  value: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onChange,
  disabled = false,
  value,
}) => {
  return (
    <OtpInput
      value={value}
      onChange={onChange}
      numInputs={length}
      renderInput={(props) => (
        <input
          {...props}
          inputMode="numeric" // ✅ instead of inputType="number"
          className="!w-12 !h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
      )}
      shouldAutoFocus
      containerStyle="flex items-center gap-2 justify-center"
    />
  );
};

export default OTPInput;
