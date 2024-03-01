import React from "react";

interface IShowData {
  hasChildren?: boolean;
  sizeClass?: string;
  valueClass?: string;
  heading: string;
  headingClass?: string;
  value?: any;
  children?: React.ReactNode;
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
  } = props;
  return (
    <div className={`grid grid-cols-12 ${sizeClass ? sizeClass : ""}`}>
      <div
        className={`font-bold ${
          headingClass ?? "lg:col-span-4 col-span-full"
        } `}
      >
        {heading}
      </div>
      <div className={`${valueClass ?? "lg:col-span-8 col-span-full"}`}>
        {hasChildren ? children : value}
      </div>
    </div>
  );
};

export default ShowLabelValue;
