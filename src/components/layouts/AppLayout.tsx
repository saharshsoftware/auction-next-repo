"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/routes/AuthRoutes";

const AppLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const pathname = usePathname();

  const isAuthRoute = AUTH_ROUTES.some((route: any) => route.path === pathname);

  const renderChildren = () => {
    return (
      <div
        className={`flex-1 ${
          isAuthRoute ? "flex items-center justify-center" : ""
        } `}
      >
        {children}
      </div>
    );
  };
  return <>{renderChildren()}</>;
};

export default AppLayout;
