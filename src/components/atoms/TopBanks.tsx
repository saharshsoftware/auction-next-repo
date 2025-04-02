import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IBanks } from "@/types";
import Link from "next/link";
import React from "react";

const TopBanks = (props: {
  isLocationCategoriesRoute?: boolean;
  isLocationRoute?: boolean;
  bankOptions?: IBanks[];
  locationSlug?: string;
}) => {
  const {
    isLocationCategoriesRoute = false,
    isLocationRoute = false,
    bankOptions = [],
    locationSlug,
  } = props;

  const renderLink = (item: IBanks) => {
    if (isLocationCategoriesRoute || isLocationRoute) {
      return (
        <Link
          href={`${ROUTE_CONSTANTS.LOCATION}/${locationSlug}${ROUTE_CONSTANTS.BANKS}/${item?.slug}`}
        >
          {item?.name}
        </Link>
      );
    }
    return (
      <Link href={`${ROUTE_CONSTANTS.BANKS}/${item?.slug}`}>{item?.name}</Link>
    );
  };

  const renderer = () => {
    if (bankOptions?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {bankOptions?.slice(0, 5)?.map((item, index) => {
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_BANKS}</div>
      {renderer()}
    </>
  );
};

export default TopBanks;
