import React, { MouseEventHandler } from "react";
import Loading from "./Loading";

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
      return "btn-error";
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
        className={`${disabled ? "custom-btn-disabled" : ""} ${
          customClass ?? "custom-action-button-class"
        } btn  ${getButtonClass()}`}
        onClick={onclick}
      >
        {icon ? icon : null}
        {isLoading ? <Loading /> : text}
      </button>
    </>
  );
};

export default ActionButton;
