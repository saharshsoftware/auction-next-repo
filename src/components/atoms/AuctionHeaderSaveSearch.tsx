"use client";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import LoginComp from "../templates/LoginComp";
import CustomModal from "./CustomModal";
import { useState } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";
import LoginModal from "../ modals/LoginModal";
import SortByDropdown from "./SortByDropdown";
import MobileSortContainer from "./MobileSortContainer";
interface IAuctionHeaderSaveSearchProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const AuctionHeaderSaveSearch = ({ searchParams }: IAuctionHeaderSaveSearchProps) => {
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
      <div className="w-full flex items-center justify-between gap-2 mb-2 ">
        <div
          className="max-w-fit link link-primary cursor-pointer"
          onClick={handleSaveSearchClick}
        >
          {"Save this search".toUpperCase()}

        </div>
        <MobileSortContainer />
        <SortByDropdown />

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
