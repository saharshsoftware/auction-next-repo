"use client";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import LoginComp from "../templates/LoginComp";
import CustomModal from "./CustomModal";
import { useState } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";
import LoginModal from "../ modals/LoginModal";
import Breadcrumb from "./Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";

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

  const getBreadcrumbItems = () => {
    const baseItems = [
      {
        label: "Find Auctions",
        href: ROUTE_CONSTANTS.AUCTION,
      },
    ];

    // If no search params, return base items
    if (!searchParams?.q) {
      return baseItems;
    }

    // Extract and decode filter data from query params
    const filterQueryData = getDataFromQueryParamsMethod(
      Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q
    );

    if (!filterQueryData) {
      return baseItems;
    }

    // Build dynamic breadcrumb labels based on active filters
    const filterLabels: string[] = [];

    if (filterQueryData?.category?.name) {
      filterLabels.push(filterQueryData.category.name);
    }

    if (filterQueryData?.propertyType?.name) {
      filterLabels.push(filterQueryData.propertyType.name);
    }

    if (filterQueryData?.bank?.name) {
      filterLabels.push(filterQueryData.bank.name);
    }

    if (filterQueryData?.location?.name) {
      filterLabels.push(filterQueryData.location.name);
    }

    if (filterQueryData?.serviceProvider?.label) {
      filterLabels.push(filterQueryData.serviceProvider.label);
    }

    // If we have filter labels, add them as a second breadcrumb item
    if (filterLabels.length > 0) {
      const searchLabel = filterLabels.join(" + ");
      baseItems.push({
        label: searchLabel,
        href: `${ROUTE_CONSTANTS.AUCTION}${searchParams.q ? `?q=${encodeURIComponent(Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)}` : ''}`,
      });
    }

    return baseItems;
  };

  return (
    <>
      {/* Breadcrumb Navigation and Save Search Button */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
        <div className="flex-1">
          <Breadcrumb
            items={getBreadcrumbItems()}
          />
        </div>
        <div
          className="max-w-fit link link-primary cursor-pointer whitespace-nowrap"
          onClick={handleSaveSearchClick}
        >
          {"Save this search".toUpperCase()}
        </div>
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
