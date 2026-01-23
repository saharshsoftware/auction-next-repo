"use client";
import React from "react";
import { Check } from "lucide-react";
import { IActionCheckBox } from "@/interfaces/ActionCheckBox";

const ActionCheckboxV2: React.FC<IActionCheckBox> = (props) => {
  const {
    checkboxLabel,
    checked = false,
    onChange,
    disabled = false,
    id,
    name,
    customClass,
  } = props;

  return (
    <label
      className={`cursor-pointer flex items-center gap-3 ${customClass || ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      htmlFor={id || name}
    >
      {/* Custom checkbox with rounded corners */}
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
        />
        {/* Custom checkbox visual */}
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-[#5c6bf2] border-[#5c6bf2]"
              : "bg-white border-gray-300"
          } ${disabled ? "opacity-50" : ""}`}
        >
          {checked && (
            <Check className="h-4 w-4 text-white stroke-[3]" />
          )}
        </div>
      </div>
      {/* Label text */}
      <span className="label-text text-sm font-bold text-gray-900">
        {checkboxLabel}
      </span>
    </label>
  );
};

export default ActionCheckboxV2;
