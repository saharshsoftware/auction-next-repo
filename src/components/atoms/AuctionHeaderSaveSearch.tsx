"use client";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import LoginComp from "../templates/LoginComp";
import CustomModal from "./CustomModal";
import { useState } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";
import LoginModal from "../ modals/LoginModal";

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

      <LoginModal openModal={showLoginModal} hideModal={() => setShowLoginModal(false)} />

      <SavedSearchModal
        openModal={showSavedSearchModal}
        hideModal={() => setShowSavedSearchModal(false)}
      />
    </>
  );
};

export default AuctionHeaderSaveSearch;
