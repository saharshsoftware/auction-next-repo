"use client";
import { getCategoryBoxCollectionClient } from "@/services/auction";
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from "@/shared/Constants";
import { ICategoryCollection } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CategoryCollection from "../molecules/CategoryCollection";
import SkeltopAllCategories from "../skeltons/SkeltopAllCategories";
import useLocalStorage from "@/hooks/useLocationStorage";
import Link from "next/link";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";


const AllCategories = () => {
    const [auctionFilter, setAuctionFilter] = useLocalStorage(
      COOKIES.AUCTION_FILTER,
      FILTER_EMPTY
    );

  const { data: categoryOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS, "all"],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      return res ?? [];
    },
  });

  if (fetchStatus === "fetching") {
    return (
      <div className="common-section my-8">
        <SkeltopAllCategories />
      </div>
    );
  }

  const handleLinkClick = (category: ICategoryCollection) => {
    setAuctionFilter({ ...FILTER_EMPTY, category });
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
                href={`/category/${item?.slug}`}
                onClick={() => handleLinkClick(item)}
              >
                <div className="w-full border border-gray-400 rounded-lg shadow p-4">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="relative w-12 h-12">
                      <img
                        src={imageUrl}
                        alt="i"
                        className="object-contain bg-contain "
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
