"use client";
import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import { STRING_DATA } from "@/shared/Constants";
import LoginComp from "../templates/LoginComp";
import SignupComp from "../templates/SignupComp";
import { useRouter } from "next/navigation";

interface ILoginModal {
  openModal: boolean;
  hideModal?: () => void;
}

const LoginModal = (props: ILoginModal) => {
  const { openModal, hideModal = () => { } } = props;
  const router = useRouter();
  const [show, setShow] = useState({ login: false, signup: true });
  const handleShowRegister = () => {
    setShow({ login: false, signup: true });
    router.refresh();
  };

  const handleShowLogin = () => {
    setShow({ login: true, signup: false });
  };
  const renderAuthComponent = () => {
    if (show?.login) {
      return (
        <LoginComp
          isAuthModal={true}
          handleLinkclick={handleShowRegister}
          closeModal={hideModal}
        />
      );
    }
    if (show?.signup) {
      return (
        <SignupComp
          isAuthModal={true}
          handleLinkclick={handleShowLogin}
          closeModal={hideModal}
        />
      );
    }
  };

  const selectedHeading = () => {
    let heading = STRING_DATA.SHOW_INTEREST;
    if (show?.login) {
      heading = STRING_DATA.LOGIN;
    }
    if (show?.signup) {
      heading = STRING_DATA.REGISTER;
    }
    return heading;
  };
  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={selectedHeading()}
        useStickyHeader={true}
        customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
      >
        <div className="w-full">{renderAuthComponent()}</div>
      </CustomModal>
    </>
  );
};

export default LoginModal;
