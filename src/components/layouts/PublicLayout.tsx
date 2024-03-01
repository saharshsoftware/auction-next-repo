import React from "react";

const PublicLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <>{children}</>;
};

export default PublicLayout;
