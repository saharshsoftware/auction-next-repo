import React from "react";

const Loading: React.ComponentType<any> = (props) => {
  const { customClass } = props;
  return (
    <span
      className={`loading loading-dots ${customClass || "loading-sm"}`}
    ></span>
  );
};

export default Loading;
