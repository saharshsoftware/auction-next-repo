import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ICategoryCollection } from "@/types";
import Link from "next/link";
import React from "react";

const TopCategory = (props: {
  categoryOptions?: ICategoryCollection[];
  isCategoryRoute?: boolean;
}) => {
  const { categoryOptions = [], isCategoryRoute = false } = props;

  const renderLink = (item: ICategoryCollection) => {
    return (
      <Link prefetch href={`${ROUTE_CONSTANTS.CATEGORY}/${item?.slug}`} className="text-sm-xs">
        {item?.name}
      </Link>
    );
  };

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
