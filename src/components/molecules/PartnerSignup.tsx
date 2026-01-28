"use client";
import React, { useEffect } from "react";
import CreatePartnerModal from "../partners/create-partner-modal";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import useModal from "@/hooks/useModal";
import LoginModal from "../ modals/LoginModal";
import ActionButton from "../atoms/ActionButton";

const PartnerSignup = () => {
  const { isAuthenticated, refreshAuth } = useIsAuthenticated();
  const { openModal, showModal, hideModal } = useModal();

  // Refresh auth state when modal closes (in case user logged in)
  const handleCloseModal = () => {
    hideModal();
    refreshAuth();
  };

  // Check authentication state when component mounts or auth refreshes
  useEffect(() => {
    if (isAuthenticated) {
      hideModal();
    }
  }, [isAuthenticated, hideModal]);

  // Show login message and link for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <div className="w-11/12 mx-auto">
          <div className="lg:col-span-6 col-span-full">
            <div className="w-full my-12 mx-auto flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Please login with your eauctiondekho email id
                </p>
                <ActionButton
                  text="Login"
                  onclick={showModal}
                  customClass="px-6 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <LoginModal 
          openModal={openModal} 
          hideModal={handleCloseModal}
          initialView="login"
        />
      </>
    );
  }

  // Show partner signup form for authenticated users
  return (
    <>
      <h2 className="text-4xl leading text-center">
        Partner Signup{" "}
        <hr className="border border-brand-color w-32 mx-auto my-4" />
      </h2>

      <div className="w-11/12 mx-auto">
        <div className="lg:col-span-6 col-span-full">
          <div className="w-full my-12 mx-auto">
            <CreatePartnerModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSignup;
