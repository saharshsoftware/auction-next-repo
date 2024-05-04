"use client";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import useLocalStorage from "@/hooks/useLocationStorage";
import { ICategoryCollection } from "@/types";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
interface ICategroyCollectionComp {
  item: any;
  fetchQuery?: string;
  key?: string | number;
}

const CategoryCollection = (props: ICategroyCollectionComp) => {
  const { item = "" } = props;
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (category: ICategoryCollection) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      category: { ...category, label: category?.name, value: category?.id },
    });
  };
  const imageUrl = sanitizeStrapiImageUrl(item);
  return (
    <>
      <Link
        href={`${ROUTE_CONSTANTS.CATEGORY}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div className="w-full  rounded-lg  p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative rounded-full w-20 h-20 flex items-center justify-center m-auto ">
              <ImageTag imageUrl={imageUrl} alt={"i"} />
            </div>
            <div>{item?.totalNotices}</div>
            <span className="text-center">{item?.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CategoryCollection;
