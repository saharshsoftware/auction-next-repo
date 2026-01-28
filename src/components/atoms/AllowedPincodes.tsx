"use client";
import React, { useState } from "react";
import { Plus, MapPin, X } from "lucide-react";
import toast from "react-simple-toasts";

interface IAllowedPincodes {
  value: string[];
  onChange: (pincodes: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const AllowedPincodes: React.FC<IAllowedPincodes> = ({
  value = [],
  onChange,
  label = "Allowed Pincodes",
  error,
  disabled = false,
}) => {
  const [pinInput, setPinInput] = useState("");

  // Handle adding a new pincode
  const handleAddPincode = () => {
    const pin = pinInput.trim();

    // Validate: must be exactly 6 digits
    if (!/^\d{6}$/.test(pin)) {
      toast("Invalid pincode. Please enter exactly 6 digits.", {
        duration: 3000,
        position: 'top-center',
        theme: 'failure',
      });
      return;
    }

    // Check for duplicates
    if (value.includes(pin)) {
      toast("This pincode is already added.", {
        duration: 3000,
        position: 'top-center',
        theme: 'failure',
      });
      setPinInput("");
      return;
    }

    // Add the pincode
    onChange([...value, pin]);
    setPinInput("");
  };

  // Handle removing a pincode
  const handleRemovePincode = (pinToRemove: string) => {
    onChange(value.filter((p) => p !== pinToRemove));
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPincode();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>

      {/* Input and Add Button Container */}
      <div className="flex gap-2">
        {/* Pincode Input Field */}
        <input
          type="text"
          value={pinInput}
          onChange={(e) => {
            // Only allow digits and limit to 6 characters
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPinInput(val);
          }}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="form-controls flex-1"
          placeholder="Enter pincode (6 digits)"
          maxLength={6}
        />

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddPincode}
          disabled={disabled || pinInput.length !== 6}
          className="w-12 h-10 flex items-center justify-center border border-brand-color rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}

      {/* Pincode Tags/Chips */}
      {value.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {value.map((pin) => (
            <div
              key={pin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5c6bf2] border border-[#4a5ae0] text-white"
            >
              {/* Location Pin Icon */}
              <MapPin className="h-4 w-4 flex-shrink-0" />

              {/* Pincode Text */}
              <span className="text-sm font-bold">{pin}</span>

              {/* Remove Icon */}
              <button
                type="button"
                onClick={() => handleRemovePincode(pin)}
                disabled={disabled}
                className="ml-1 hover:bg-[#4a5ae0] rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remove pincode ${pin}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllowedPincodes;
