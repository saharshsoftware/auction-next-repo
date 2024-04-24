"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { COOKIES } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import useFindUrl from "@/hooks/useFindUrl";

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

  const renderSpecificRoutes = () => {
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
          <TopBanks />
        </div>
      );
    }
    if (findUrl?.isLocationRoute) {
      return (
        <div className="mb-4">
          <TopCities />
        </div>
      );
    }
  };

  const showAddToWishlist = () => {
    const requiredRoute = currentRoute.split("/").slice(0, 2).join("/");
    console.log(requiredRoute, "requiredRoute");
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
    if (currentRoute === ROUTE_CONSTANTS.AUCTION) {
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
      </>
    );
  };
  return <>{renderChildren()}</>;
};

export default RecentData;
