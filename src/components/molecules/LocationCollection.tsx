"use client";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import { FILTER_EMPTY } from "@/shared/Constants";
import { IBanks, ILocations } from "@/types";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useFilterStore } from "@/zustandStore/filters";

const LocationCollection = (props: { fetchQuery?: string; item: any }) => {
  const { setFilter: setAuctionFilter } = useFilterStore();

  const handleLinkClick = (location: ILocations) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      location: { ...location, label: location?.name, value: location?.id },
    } as any);
  };
  const { item = "", fetchQuery } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";

  return (
    <>
      <Link
        className="z-20 text-center"
        prefetch={false}
        href={`${ROUTE_CONSTANTS.LOCATION}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div className="w-full p-4 min-h-28">
          <div className="flex flex-col items-center justify-center gap-2">
            {/* border border-gray-400 shadow overflow-hidden */}
            <div className="relative rounded-lg w-20 h-20 flex items-center justify-center m-auto  overflow-hidden">
              <ImageTag imageUrl={imageUrl} alt={"i"} />
            </div>
            <span className="text-center text-sm">{item?.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default LocationCollection;
