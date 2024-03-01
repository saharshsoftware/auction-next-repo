import React from "react";

const CustomLoading: React.ComponentType<any> = (props) => {
  const { customClass } = props;
  return (
    <span
      className={`loading loading-dots ${customClass || "loading-sm"}`}
    ></span>
  );
};

export default CustomLoading;
