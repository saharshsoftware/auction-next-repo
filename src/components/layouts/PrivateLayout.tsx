import React from "react";

const PrivateLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <>{children}</>;
};

export default PrivateLayout;
