import React from "react";

interface ICustomBadge {
  index?: number;
  activeBadge: any;
  item: any;
  onclick?: (data?: any) => void;
}

const CustomBadge: React.FC<ICustomBadge> = (props) => {
  const { index, item, onclick = () => {}, activeBadge } = props;
  return (
    <div
      key={index}
      className={`custom-badge-class ${
        activeBadge?.id === item?.id ? "active-badge-class" : ""
      }`}
      onClick={() => onclick(item)}
    >
      {item?.label}
    </div>
  );
};

export default CustomBadge;
