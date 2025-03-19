"use client";
import { fetchBankTopClient, fetchPopularBankClient } from "@/services/Home";
import { FILTER_EMPTY, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IBanks } from "@/types";
import { useFilterStore } from "@/zustandStore/filters";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const TopBanks = (props: {
  isLocationCategoriesRoute?: boolean;
  isLocationRoute?: boolean;
}) => {
  const { isLocationCategoriesRoute = false, isLocationRoute = false } = props;
  const { setFilter, setBank } = useFilterStore();
  const params = useParams() as {
    slug: string;
    slugasset: string;
    slugcategory: string;
    slugbank: string;
  };

  const { data: bankOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS, "top"],
    queryFn: async () => {
      const res = (await fetchBankTopClient()) as unknown as IBanks[];
      return res ?? [];
    },
  });

  const handleLinkClick = (bank: IBanks) => {
    if (isLocationCategoriesRoute || isLocationRoute) {
      setBank({
        ...bank,
        label: bank?.name,
        value: bank?.id,
      });
      return;
    }
    setFilter({
      ...FILTER_EMPTY,
      bank: {
        ...bank,
        label: bank?.name,
        value: bank?.id,
      } as any,
    });
  };

  const renderLink = (item: IBanks) => {
    if (isLocationCategoriesRoute || isLocationRoute) {
      return (
        <Link
          href={`${ROUTE_CONSTANTS.LOCATION}/${params.slug}/${ROUTE_CONSTANTS.BANKS}/${item?.slug}`}
          onClick={() => handleLinkClick(item)}
        >
          {item?.name}
        </Link>
      );
    }
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
