import { faDumpster, faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ICustomBadge {
  index?: number;
  activeBadge: any;
  item: any;
  onclick?: (data?: any) => void;
  onclickDelete?: (data?: any) => void;
  onclickSetting?: (data?: any) => void;
  showDeleteIcon?: boolean;
  showSettingIcon?: boolean;
}

const CustomBadge: React.FC<ICustomBadge> = (props) => {
  const {
    index,
    item,
    onclick = () => {},
    onclickDelete = () => {},
    onclickSetting = () => {},
    activeBadge,
    showDeleteIcon = false,
    showSettingIcon = false,
  } = props;

  const renderDeleteIcon = () => {
    if (showDeleteIcon) {
      return (
        <em className="ms-4" onClick={() => onclickDelete(item)}>
          <FontAwesomeIcon icon={faTrash} />
        </em>
      );
    }
    if (showSettingIcon) {
      return (
        <em className="ms-4" onClick={() => onclickSetting(item)}>
          <FontAwesomeIcon icon={faGear} />
        </em>
      );
    }
    return null;
  };

  return (
    <div
      key={index}
      className={`custom-badge-class ${
        activeBadge?.id === item?.id ? "active-badge-class" : ""
      }`}
      onClick={() => onclick(item)}
    >
      <span>{item?.label}</span>

      {/* {renderDeleteIcon()} */}
    </div>
  );
};

export default CustomBadge;
