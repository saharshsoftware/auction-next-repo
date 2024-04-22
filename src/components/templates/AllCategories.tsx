"use client";
import { getCategoryBoxCollectionClient } from "@/services/auction";
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from "@/shared/Constants";
import { ICategoryCollection } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CategoryCollection from "../molecules/CategoryCollection";
import SkeltopAllCategories from "../skeltons/SkeltopAllCategories";
import useLocalStorage from "@/hooks/useLocationStorage";


const AllCategories = () => {
    const [auctionFilter, setAuctionFilter] = useLocalStorage(
      COOKIES.AUCTION_FILTER,
      FILTER_EMPTY
    );

  const { data: categoryOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
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
          return (
            <div
              key={item?.slug}
              className="lg:col-span-3 md:col-span-4 col-span-6"
            >
              <CategoryCollection
                item={item}
                key={item?.slug}
                handleLinkClick={handleLinkClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllCategories;
