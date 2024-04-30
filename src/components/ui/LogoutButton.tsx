import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logout } from "@/server/actions";
import { redirect } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Link from "next/link";

const LogoutButton = (props: {customClass?: string, handleClick?: ()=> void}) => {
  const { customClass, handleClick } = props;
  const handleLogout = () => {
    if (handleClick) {
      handleClick?.();
    } 
    logout();
    // redirect(ROUTE_CONSTANTS.DASHBOARD)
  };
  return (
    <>
      <Link
        href={ROUTE_CONSTANTS.DASHBOARD}
        className={`${customClass ?? "text-sm cursor-pointer"}`}
        onClick={handleLogout}
      >
        {STRING_DATA.LOGOUT}
      </Link>
    </>
  );
};

export default LogoutButton;
