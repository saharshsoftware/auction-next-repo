"use client";
import React, { MouseEventHandler } from "react";
import CustomLoading from "./Loading";

interface IActionButton {
  text: string;
  onclick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  disabled?: boolean;
  customClass?: string;
  isSubmit?: boolean;
  icon?: any;
  iconLeft?: any;
  isActionButton?: boolean;
  isDeleteButton?: boolean;
  isOutline?: boolean; // ✅ New flag added
}

const ActionButton: React.FC<IActionButton> = (props) => {
  const {
    text,
    onclick,
    isLoading,
    disabled,
    customClass,
    isSubmit,
    icon,
    iconLeft,
    isActionButton = true,
    isDeleteButton = false,
    isOutline = false, // ✅ Destructure it here
  } = props;

  const getButtonClass = () => {
    if (isOutline) {
      return "border border-gray-400 text-gray-700 bg-transparent hover:bg-gray-100";
    }
    if (isDeleteButton) {
      return "bg-[#dc3545] text-white";
    }
    if (isActionButton) {
      return "bg-action-btn text-white";
    }
    return "btn-active";
  };

  return (
    <>
      <button
        type={isSubmit ? "submit" : "button"}
        disabled={disabled || isLoading}
        className={`min-w-[80px] max-w-max-content ${
          disabled ? "custom-btn-disabled" : ""
        } ${
          customClass ?? "custom-action-button-class"
        } btn ${getButtonClass()}`}
        onClick={onclick}
      >
        {iconLeft ? iconLeft : null}
        {isLoading ? <CustomLoading /> : text}
        {icon ? icon : null}
      </button>
    </>
  );
};

export default ActionButton;
