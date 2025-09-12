"use client";

import useModal from "@/hooks/useModal";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
import ActionButton from "../atoms/ActionButton";
import CreateAlert from "./CreateAlert";
import LoginModal from "./LoginModal";

function LoginToCreateAlert({
  isAuthenticated,
  isHowToCreateRoute = false,
}: {
  isAuthenticated?: boolean;
  isHowToCreateRoute?: boolean;
}) {
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();

  const handleCloseCreateAlert = () => {
    hideModal();
    router.refresh();
  };

  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateAlert openModal={openModal} hideModal={handleCloseCreateAlert} isHowToCreateRoute={isHowToCreateRoute} />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateAlert} />
    );
  };
  return (
    <>
      <ActionButton
        text={isAuthenticated ? "Create Alert" : "Signup to create alert"}
        onclick={showModal}
        iconLeft={<FontAwesomeIcon icon={faBell} className="h-4 w-4 " />}
      />
      {openModal ? renderModalContainer() : null}
    </>
  );
}

export default LoginToCreateAlert;
