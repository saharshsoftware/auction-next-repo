import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logout } from "@/server/actions";
import { redirect } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Link from "next/link";

const LogoutButton = () => {
  const handleLogout = () => {
    logout();
    // redirect(ROUTE_CONSTANTS.DASHBOARD)
  };
  return (
    <>
      <Link
        href={ROUTE_CONSTANTS.DASHBOARD}
        className="text-sm cursor-pointer"
        onClick={handleLogout}
      >
        {STRING_DATA.LOGOUT}
      </Link>
    </>
  );
};

export default LogoutButton;
