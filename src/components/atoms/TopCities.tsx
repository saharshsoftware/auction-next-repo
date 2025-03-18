"use client";
import { fetchPopularLocationClient } from "@/services/location";
import { FILTER_EMPTY, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ILocations } from "@/types";
import { useFilterStore } from "@/zustandStore/filters";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const TopCities = (props: { isBankRoute?: boolean }) => {
  const { isBankRoute = false } = props;
  const { setFilter, setLocation } = useFilterStore();
  const params = useParams() as {
    slug: string;
    slugasset: string;
    slugcategory: string;
    slugbank: string;
  };

  const handleLinkClick = (location: ILocations) => {
    if (isBankRoute) {
      setLocation({
        ...location,
        label: location?.name,
        value: location?.id,
      });
      return;
    }
    setFilter({
      ...FILTER_EMPTY,
      location: {
        ...location,
        label: location?.name,
        value: location?.id,
      } as any,
    });
  };
  const { data: locationOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION, "top"],
    queryFn: async () => {
      const res =
        (await fetchPopularLocationClient()) as unknown as ILocations[];
      return res ?? [];
    },
  });

  const renderLink = (item: ILocations) => {
    const URL = `/${STRING_DATA.LOCATIONS?.toLowerCase()}/${item?.slug}${
      ROUTE_CONSTANTS.BANKS
    }/${params.slug}`;
    if (isBankRoute) {
      return (
        <Link href={URL} onClick={() => handleLinkClick(item)}>
          {item?.name}
        </Link>
      );
    }

    return (
      <Link
        href={`${ROUTE_CONSTANTS.LOCATION}/${item?.slug}`}
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_CITIES}</div>
      {renderer()}
    </>
  );
};

export default TopCities;
