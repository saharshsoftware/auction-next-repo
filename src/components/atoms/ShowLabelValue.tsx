import React from "react";
import BlurredFieldWrapper from "./BlurredFieldWrapper";
import { STRING_DATA } from "@/shared/Constants";

interface IShowData {
  hasChildren?: boolean;
  sizeClass?: string;
  valueClass?: string;
  heading: string;
  headingClass?: string;
  value?: any;
  children?: React.ReactNode;
  isBlurred?: boolean; // New flag to blur the field
}

const ShowLabelValue: React.FC<IShowData> = (props) => {
  const {
    hasChildren = false,
    sizeClass,
    valueClass,
    heading,
    headingClass,
    value,
    children,
    isBlurred = false, // Default to false
  } = props;

  const renderValueContainer = () => {
    if (hasChildren) {
      return children;
    }
    return (
      <BlurredFieldWrapper isBlurred={isBlurred}>
        <div id={heading === STRING_DATA.PROPERTY_TYPE ? 'property-type' : undefined}>
          {value}
        </div>
      </BlurredFieldWrapper>
    );
  };

  return (
    <div className={`grid grid-cols-12 ${sizeClass ? sizeClass : ""}`}>
      <div
        className={`font-bold ${headingClass ?? "lg:col-span-4 col-span-full"
          } `}
      >
        {heading}
      </div>
      <div className={`${valueClass ?? "lg:col-span-8 col-span-full"}`}>
        {renderValueContainer()}
      </div>
    </div>
  );
};

export default ShowLabelValue;
