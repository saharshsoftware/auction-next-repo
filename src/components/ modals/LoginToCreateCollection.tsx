"use client";

import useModal from "@/hooks/useModal";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
import ActionButton from "../atoms/ActionButton";
import LoginModal from "./LoginModal";
import CreateFavList from "./CreateFavList";

function LoginToCreateCollection({
  isAuthenticated,
}: {
  isAuthenticated?: boolean;
}) {
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();

  const handleCloseCreateFavList = () => {
    hideModal();
    router.refresh();
  };

  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateFavList
          openModal={openModal}
          hideModal={handleCloseCreateFavList}
        />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateFavList} />
    );
  };
  return (
    <>
      <ActionButton
        text="Login To Create Collection"
        onclick={showModal}
        iconLeft={<FontAwesomeIcon icon={faBell} className="h-4 w-4 " />}
      />
      {openModal ? renderModalContainer() : null}
    </>
  );
}

export default LoginToCreateCollection;
