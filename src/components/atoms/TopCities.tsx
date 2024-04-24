"use client";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchLocation } from "@/server/actions";
import { fetchLocationTopClient } from "@/services/location";
import {
  COOKIES,
  FILTER_EMPTY,
  REACT_QUERY,
  SAMPLE_CITY,
  STRING_DATA,
} from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ILocations } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const TopCities = () => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (location: ILocations) => {
    setAuctionFilter({ ...FILTER_EMPTY, location });
  };
  const {
    data: locationOptions,
    fetchStatus,
  } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION, "top"],
    queryFn: async () => {
      const res = (await fetchLocationTopClient()) as unknown as ILocations[];
      console.log(res, "footertop");
      return res ?? [];
    },
  });

  const renderLink = (item: ILocations) => {
    return (
      <Link
        href={`/location/${item?.slug}`}
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
    if (locationOptions?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {locationOptions?.map((item, index) => {
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_CITY}</div>
      {renderer()}
    </>
  );
};

export default TopCities;
