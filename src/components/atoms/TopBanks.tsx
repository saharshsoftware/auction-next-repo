"use client";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchBankTopClient } from "@/services/Home";
import {
  COOKIES,
  FILTER_EMPTY,
  REACT_QUERY,
  STRING_DATA,
} from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IBanks } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const TopBanks = () => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const { data: bankOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS, "top"],
    queryFn: async () => {
      const res = (await fetchBankTopClient()) as unknown as IBanks[];
      return res ?? [];
    },
  });

  const handleLinkClick = (bank: IBanks) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      bank: {
        ...bank,
        label: bank?.name,
        value: bank?.id,
      },
    });
  };

  const renderLink = (item: IBanks) => {
    return (
      <Link
        href={`${ROUTE_CONSTANTS.BANKS}/${item?.slug}`}
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
    if (bankOptions?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {bankOptions?.map((item, index) => {
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_BANKS}</div>
      {renderer()}
    </>
  );
};

export default TopBanks;
