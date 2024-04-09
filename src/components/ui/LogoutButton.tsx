import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logout } from "@/server/actions";

const LogoutButton = () => {
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <div className="text-sm cursor-pointer" onClick={handleLogout}>{STRING_DATA.LOGOUT}</div>
    </>
  );
};

export default LogoutButton;
