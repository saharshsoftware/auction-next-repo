"use client";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchTopAssetsTypeClient } from "@/services/assetsType";
import {
  COOKIES,
  FILTER_EMPTY,
  REACT_QUERY,
  STRING_DATA,
} from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAssetType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const TopAssets = () => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const { data: assetsTypeData, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.ASSETS_TYPE, "top"],
    queryFn: async () => {
      const res = (await fetchTopAssetsTypeClient()) as unknown as IAssetType[];
      return res ?? [];
    },
  });

  const handleLinkClick = (propertyType: IAssetType) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      propertyType: {
        ...propertyType,
        label: propertyType?.name,
        value: propertyType?.id,
      },
    });
  };

  const renderLink = (item: IAssetType) => {
    return (
      <Link
        href={`${ROUTE_CONSTANTS.ASSETS_TYPE}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        {item?.name}
      </Link>
    );
  };

  if (fetchStatus === "fetching") {
    return (
      <div className="flex flex-col my-4">
        <div className="custom-common-header-class min-h-12 flex items-center justify-start">
          <div className="skeleton h-4 w-32 "></div>
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div className="custom-common-header-detail-class" key={index}>
            <div className="flex flex-col gap-4 p-4  w-full min-h-12">
              <h2 className="line-clamp-1">
                <div className="skeleton h-4 w-32 "></div>
              </h2>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderer = () => {
    if (assetsTypeData?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {assetsTypeData?.map((item, index) => {
          return (
            <div className="custom-common-header-detail-class" key={index}>
              <div className="flex flex-col gap-4 p-4  w-full min-h-12">
                <h2 className="line-clamp-1">{renderLink(item)}</h2>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="custom-common-header-class">{STRING_DATA.TOP_ASSETS}</div>
      {renderer()}
    </>
  );
};

export default TopAssets;
