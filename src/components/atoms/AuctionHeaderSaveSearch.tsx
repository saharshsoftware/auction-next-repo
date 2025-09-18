"use client";
import { COOKIES, RANGE_PRICE, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import { useState } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";
import LoginModal from "../ modals/LoginModal";
import SortByDropdown from "./SortByDropdown";
import MobileSortContainer from "./MobileSortContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
interface IAuctionHeaderSaveSearchProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const AuctionHeaderSaveSearch = ({ searchParams }: IAuctionHeaderSaveSearchProps) => {
  const [showSavedSearchModal, setShowSavedSearchModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const encodedQuery: string = Array.isArray(searchParams?.q)
    ? (searchParams?.q?.[0] as string)
    : ((searchParams?.q as string) || "");
  const decodedFilters: any = getDataFromQueryParamsMethod(encodedQuery) || {};

  const getActiveFiltersCount = (): number => {
    let count = 0;
    const hasCategory = !!decodedFilters?.category?.name && decodedFilters?.category?.label !== STRING_DATA.ALL;
    const hasLocation = !!decodedFilters?.location?.name && decodedFilters?.location?.label !== STRING_DATA.ALL;
    const hasBank = !!decodedFilters?.bank?.name && decodedFilters?.bank?.label !== STRING_DATA.ALL;
    const hasPropertyType = !!decodedFilters?.propertyType?.name && decodedFilters?.propertyType?.label !== STRING_DATA.ALL;
    const hasPriceRange = Array.isArray(decodedFilters?.price) && decodedFilters?.price?.length > 0 && (
      Number(decodedFilters?.price?.[0]) !== Number(RANGE_PRICE.MIN) ||
      Number(decodedFilters?.price?.[1]) !== Number(RANGE_PRICE.MAX)
    );
    if (hasCategory) count++;
    if (hasLocation) count++;
    if (hasBank) count++;
    if (hasPropertyType) count++;
    if (hasPriceRange) count++;
    return count;
  };
  const activeFiltersCount: number = getActiveFiltersCount();

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
        <div className="max-w-fit flex flex-col gap-1">
          <button type="button" className="link link-primary cursor-pointer max-w-fit" onClick={handleSaveSearchClick}>
            {"Save this search".toUpperCase()}
          </button>
          {activeFiltersCount >= 2 && (
            <div className="inline-flex items-center gap-2 text-xs py-1 rounded-full w-fit text-gray-600">
              <FontAwesomeIcon icon={faFilter} className="" />
              <span>Resume your journey later with saved filters</span>
            </div>
          )}
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
