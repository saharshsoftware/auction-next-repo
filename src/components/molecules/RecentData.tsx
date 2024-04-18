"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { formatPrice, formattedDate } from "@/shared/Utilies";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { COOKIES } from "@/shared/Constants";

import { ISpecificRoute } from "@/types";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import useFindUrl from "@/hooks/useFindUrl";
// import TopCategory from "../atoms/TopCategory";

const OtherCategory = dynamic(() => import("../atoms/OtherCategory"), {
  ssr: false,
});

const OtherLocations = dynamic(() => import("../atoms/OtherLocations"), {
  ssr: false,
});

const OtherBanks = dynamic(() => import("../atoms/OtherBanks"), {
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

const ShowSimilerProperties = (props: { item: any; index: number }) => {
  const { item, index } = props;
  return (
    <div className="custom-common-header-detail-class" key={index}>
      <div className="flex flex-col gap-4 p-4  w-full min-h-12">
        <h2 className="custom-h2-class line-clamp-1">{item?.title}</h2>
        {item?.date ? (
          <span className="text-sm">{formattedDate(item?.date)}</span>
        ) : null}
        <span className="custom-prize-color text-lg">
          {formatPrice(item?.price)}
        </span>
      </div>
    </div>
  );
};

const RecentData = (props: ISpecificRoute) => {
  const {
    isBankRoute = false,
    isCategoryRoute = false,
    isLocationRoute = false,
  } = props;

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
