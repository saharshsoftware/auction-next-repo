"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { COOKIES } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import useFindUrl from "@/hooks/useFindUrl";
import CategorySpecificAssets from "../atoms/CategorySpecificAssets";

const TopAssets = dynamic(() => import("../atoms/TopAssets"), {
  ssr: false,
});

const AddToWishlist = dynamic(() => import("../templates/AddToWishlist"), {
  ssr: false,
});

const TopCities = dynamic(() => import("../atoms/TopCities"), {
  ssr: false,
});

const TopCategory = dynamic(() => import("@/components/atoms/TopCategory"), {
  ssr: false,
});

const TopBanks = dynamic(() => import("@/components/atoms/TopBanks"), {
  ssr: false,
});

const RecentData = () => {
  const currentRoute = usePathname();
  const { findUrl } = useFindUrl();
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";

  const renderSpecificTwoSlugRoutes = () => {
    if (findUrl?.isBankTypesRoute) {
      return (
        <div className="mb-4">
          <TopAssets isBankTypesRoute={true} />
        </div>
      );
    }
    if (findUrl?.isBankCategoriesRoute) {
      return (
        <div className="mb-4">
          <CategorySpecificAssets isBankCategoriesRoute={true} />
        </div>
      );
    }
  };

  const renderSpecificRoutes = () => {
    // console.log(findUrl, "findUrlfindUrl");
    if (findUrl?.isCategoryRoute) {
      return (
        <div className="mb-4">
          <TopCategory />
        </div>
      );
    }
    if (findUrl?.isBankRoute) {
      return (
        <div className="mb-4">
          <TopCities isBankRoute={true} />
        </div>
      );
    }
    if (findUrl?.isLocationRoute) {
      return (
        <div className="mb-4">
          <TopBanks isLocationRoute={true} />
        </div>
      );
    }
    if (findUrl?.isTypesRoute) {
      return (
        <div className="mb-4">
          <TopAssets />
        </div>
      );
    }
  };

  const showAddToWishlist = () => {
    const requiredRoute = currentRoute.split("/").slice(0, 2).join("/");
    // console.log(requiredRoute, "requiredRoute");
    if (requiredRoute === ROUTE_CONSTANTS.AUCTION_SLASH && token) {
      return (
        <>
          <AddToWishlist />
        </>
      );
    }
    return null;
  };

  const renderChildren = () => {
    if (
      currentRoute === ROUTE_CONSTANTS.AUCTION ||
      currentRoute === ROUTE_CONSTANTS.AUCTION_SLASH
    ) {
      return (
        <>
          <TopCities />
        </>
      );
    }
    return (
      <>
        {showAddToWishlist()}
        {renderSpecificRoutes()}
        {renderSpecificTwoSlugRoutes()}
      </>
    );
  };
  return <>{renderChildren()}</>;
};

export default RecentData;
