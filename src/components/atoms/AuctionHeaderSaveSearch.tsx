"use client";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import LoginComp from "../templates/LoginComp";
import CustomModal from "./CustomModal";
import { useState } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";

const AuctionHeaderSaveSearch = () => {
  const [showSavedSearchModal, setShowSavedSearchModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";

  const handleSaveSearchClick = () => {
    if (token) {
      setShowSavedSearchModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div
        className="max-w-fit link link-primary mb-2 cursor-pointer"
        onClick={handleSaveSearchClick}
      >
        {"Save this search".toUpperCase()}
      </div>

      <CustomModal
        openModal={showLoginModal}
        modalHeading={STRING_DATA.LOGIN}
        customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
        onClose={() => setShowLoginModal(false)}
      >
        <div className="w-full">
          <LoginComp
            isAuthModal={true}
            closeModal={() => setShowLoginModal(false)}
          />
        </div>
      </CustomModal>

      <SavedSearchModal
        openModal={showSavedSearchModal}
        hideModal={() => setShowSavedSearchModal(false)}
      />
    </>
  );
};

export default AuctionHeaderSaveSearch;
