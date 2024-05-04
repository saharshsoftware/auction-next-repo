"use client";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import { ICategoryCollection } from "@/types";
import React from "react";
import useLocalStorage from "@/hooks/useLocationStorage";
import Link from "next/link";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import ImageTag from "../ui/ImageTag";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const AllCategories = (props: { data: ICategoryCollection[] }) => {
  const { data: categoryOptions } = props;
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

  return (
    <div className="common-section my-8">
      <div className="grid grid-cols-12 gap-4">
        {categoryOptions?.map((item: ICategoryCollection) => {
          const imageUrl = sanitizeStrapiImageUrl(item);
          return (
            <div
              key={item?.slug}
              className="lg:col-span-3 md:col-span-4 col-span-6"
            >
              <Link
                href={`${ROUTE_CONSTANTS.CATEGORY}/${item?.slug}`}
                onClick={() => handleLinkClick(item)}
                prefetch={false}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllCategories;
