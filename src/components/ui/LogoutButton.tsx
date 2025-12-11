"use client";
import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logout } from "@/server/actions";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Link from "next/link";
import { setUserIdInDataLayer } from "@/helpers/WindowHelper";
import { useAuthStore } from "@/zustandStore/authStore";

const LogoutButton = (props: { customClass?: string, handleClick?: () => void }) => {
  const { customClass, handleClick } = props;
  const triggerAuthRefresh = useAuthStore((state) => state.triggerAuthRefresh);

  const handleLogout = () => {
    setUserIdInDataLayer(null);
    handleClick?.();
    logout();
    // Trigger auth refresh to update navbar and other auth-dependent components
    triggerAuthRefresh();
  };

  return (
    <Link
      href={ROUTE_CONSTANTS.DASHBOARD}
      className={`${customClass ?? "text-sm cursor-pointer"}`}
      onClick={handleLogout}
    >
      {STRING_DATA.LOGOUT}
    </Link>
  );
};

export default LogoutButton;
