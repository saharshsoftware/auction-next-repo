"use client";
import { FILTER_EMPTY } from "@/shared/Constants";
import {
  getAuctionFilterRequiredKey,
  sanitizeStrapiImageUrl,
} from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import { useFilterStore } from "@/zustandStore/filters";

const CommonCollectionComp = (props: any) => {
  const { setFilter: setAuctionFilter } = useFilterStore();

  const { item = "", fetchQuery } = props;
  const handleLinkClick = (item: any) => {
    const collectionFilterKey = getAuctionFilterRequiredKey(fetchQuery);
    // console.log(collectionFilterKey, "collectionFilterKey");
    setAuctionFilter({
      ...FILTER_EMPTY,
      [collectionFilterKey]: { ...item, label: item?.name, value: item?.id },
    });
  };
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";

  return (
    <>
      <Link
        className="z-20 text-center"
        href={`/${fetchQuery}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div
          className="w-full p-4 min-h-28"
          // onClick={() => handleLinkClick(item)}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {/* border border-gray-400 shadow overflow-hidden */}
            <div className="relative w-20 h-28 flex items-center justify-center m-auto ">
              <ImageTag imageUrl={imageUrl} alt={"i"} />
            </div>
            <span className="text-center text-sm">{item?.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CommonCollectionComp;
