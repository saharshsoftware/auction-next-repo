"use client";
import React, { useState, useEffect } from "react";
import CustomModal from "../atoms/CustomModal";
import { STRING_DATA } from "@/shared/Constants";
import LoginComp from "../templates/LoginComp";
import SignupComp from "../templates/SignupComp";
import { useRouter } from "next/navigation";
import OtpVerificationForm from "../templates/OtpVerificationForm";

interface ILoginModal {
  openModal: boolean;
  hideModal?: () => void;
  initialView?: "login" | "signup";
}

const LoginModal = (props: ILoginModal) => {
  const { openModal, hideModal = () => { }, initialView = "signup" } = props;
  const router = useRouter();
  const [show, setShow] = useState({ 
    login: initialView === "login", 
    signup: initialView === "signup" 
  });
  const [showOtpForm, setShowOtpForm] = useState(false);

  // Reset to initial view when modal opens
  useEffect(() => {
    if (openModal) {
      setShow({ 
        login: initialView === "login", 
        signup: initialView === "signup" 
      });
      setShowOtpForm(false);
    }
  }, [openModal, initialView]);

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

  const handleShowLogin = () => {
    setShow({ login: true, signup: false });
  };

  const renderAuthComponent = () => {
    if (show?.login) {
      return (
        handleLoginForm()
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
        isCrossVisible={true}
        onClose={hideModal}
        customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
      >
        <div className="w-full">{renderAuthComponent()}</div>
      </CustomModal>
    </>
  );
};

export default LoginModal;
