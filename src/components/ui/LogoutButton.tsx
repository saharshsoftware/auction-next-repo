import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logout } from "@/server/actions";
import ActionButton from "../atoms/ActionButton";

const LogoutButton = () => {
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <ActionButton
        text={STRING_DATA.LOGOUT}
        isDeleteButton={true}
        onclick={handleLogout}
      />
    </>
  );
};

export default LogoutButton;
