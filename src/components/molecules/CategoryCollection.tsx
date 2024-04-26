"use client"
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import useLocalStorage from "@/hooks/useLocationStorage";
import { ICategoryCollection } from "@/types";
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
        href={`/category/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div className="w-full border border-gray-400 rounded-lg shadow p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-12 h-12">
              <ImageTag
                imageUrl={imageUrl}
                alt={"i"}
                customClass="object-contain bg-contain "
              />
            </div>
            <div>{item?.totalNotices}</div>
            {item?.name}
          </div>
        </div>
      </Link>
    </>
  );
};

export default CategoryCollection;
