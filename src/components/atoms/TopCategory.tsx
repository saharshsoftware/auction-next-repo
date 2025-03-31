"use client";
import { fetchCategoriesTopClient } from "@/services/Home";
import { FILTER_EMPTY, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ICategoryCollection } from "@/types";
import { useFilterStore } from "@/zustandStore/filters";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const TopCategory = () => {
  const { setFilter } = useFilterStore();

  const { data: categoryOptions, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON, "top"],
    queryFn: async () => {
      const res =
        (await fetchCategoriesTopClient()) as unknown as ICategoryCollection[];
      return res ?? [];
    },
  });

  const handleLinkClick = (category: ICategoryCollection) => {
    setFilter({
      ...FILTER_EMPTY,
      category: {
        ...category,
        label: category?.name,
        value: category?.id,
      } as any,
    });
  };

  const renderLink = (item: ICategoryCollection) => {
    return (
      <Link
        href={`${ROUTE_CONSTANTS.CATEGORY}/${item?.slug}`}
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
    if (categoryOptions?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {categoryOptions?.slice(0, 5).map((item, index) => {
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
      <div className="custom-common-header-class">
        {STRING_DATA.TOP_CATEGORIES}
      </div>
      {renderer()}
    </>
  );
};

export default TopCategory;
