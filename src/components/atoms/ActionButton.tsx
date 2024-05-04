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
  isActionButton?: boolean;
  isDeleteButton?: boolean;
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
    isActionButton = true,
    isDeleteButton = false,
  } = props;

  const getButtonClass = () => {
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
        } btn  ${getButtonClass()}`}
        onClick={onclick}
      >
        {isLoading ? <CustomLoading /> : text}
        {icon ? icon : null}
      </button>
    </>
  );
};

export default ActionButton;
