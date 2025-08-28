import React from "react";
import BlurredFieldWrapper from "./BlurredFieldWrapper";
import Link from "next/link";
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
  glossaryLink?: {
    term: string;
    text: string;
  };
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
    glossaryLink,
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

  const renderHeadingWithGlossaryLink = () => {
    if (!glossaryLink) {
      return heading;
    }

    return (
      <div className="flex items-center gap-2">
        <span className="font-bold">{heading}</span>
        <Link
          href={`/glossary?term=${encodeURIComponent(glossaryLink.term)}`}
          className="text-sm text-brand-color underline hover:no-underline transition-colors"
        >
          {glossaryLink.text}
        </Link>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-12 gap-1 ${sizeClass ? sizeClass : ""}`}>
      <div
        className={`font-bold flex items-center min-w-0 ${headingClass ?? "lg:col-span-4 col-span-full"
          } `}
      >
        {renderHeadingWithGlossaryLink()}
      </div>
      <div className={`${valueClass ?? "lg:col-span-8 col-span-full"}`}>
        {renderValueContainer()}
      </div>
    </div>
  );
};

export default ShowLabelValue;
