"use client";
import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import LoginComp from "../templates/LoginComp";
import SignupComp from "../templates/SignupComp";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import OtpVerificationForm from "../templates/OtpVerificationForm";

interface IAuthModal {
  openModal: boolean;
  hideModal?: () => void;
}

const AuthModal = (props: IAuthModal) => {
  const router = useRouter();
  const { openModal, hideModal = () => { } } = props;
  const [show, setShow] = useState({ login: false, signup: true });
  const [showOtpForm, setShowOtpForm] = useState(false);

  // const token = getCookie(COOKIES.TOKEN_KEY) ?? "";

  const [myToken, setMyToken] = useState(getCookie(COOKIES.TOKEN_KEY) ?? "");

  const handleShowLogin = () => {
    setShow({ login: true, signup: false });
  };

  const handleShowRegister = () => {
    setShow({ login: false, signup: true });
    router.refresh();
  };

  const handleLoginForm = () => {
    if (showOtpForm) {
      return (
        <OtpVerificationForm isAuthModal={true} loginApiCallback={hideModal} setShowOtpForm={() => setShowOtpForm(false)} />
      )
    }
    return (
      <LoginComp
        isAuthModal={true}
        handleLinkclick={handleShowRegister}
        closeModal={hideModal}
        setShowOtpForm={() => setShowOtpForm(true)}
      />
    );
  }

  const renderAuthComponent = () => {
    if (show?.login) {
      return handleLoginForm();
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
    if (show?.login && !myToken) {
      heading = STRING_DATA.LOGIN;
    }
    if (show?.signup && !myToken) {
      heading = STRING_DATA.REGISTER;
    }
    return heading;
  };

  const getIPAddress = async () => {
    try {
      // Get user's IP address using ipify
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ipAddress = data.ip;
      return ipAddress;
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const renderer = () => {
    return renderAuthComponent();
  };

  return (
    <>
      <CustomModal
        openModal={openModal}
        isCrossVisible={true}
        onClose={hideModal}
        modalHeading={selectedHeading()}
        customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
      >
        <div className="w-full">{renderer()}</div>
      </CustomModal>
    </>
  );
};

export default AuthModal;
