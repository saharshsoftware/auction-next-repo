import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ILocations } from "@/types";
import Link from "next/link";
import React from "react";

const TopCities = (props: {
  isBankRoute?: boolean;
  locationOptions?: ILocations[];
  bankSlug?: string;
}) => {
  const { isBankRoute = false, locationOptions = [], bankSlug } = props;

  const renderLink = (item: ILocations) => {
    const URL = `/${STRING_DATA.LOCATIONS?.toLowerCase()}/${item?.slug}${
      ROUTE_CONSTANTS.BANKS
    }/${bankSlug}`;
    if (isBankRoute) {
      return <Link href={URL} className="text-sm-xs">{item?.name}</Link>;
    }

    return (
      <Link href={`${ROUTE_CONSTANTS.LOCATION}/${item?.slug}`} className="text-sm-xs">
        {item?.name}
      </Link>
    );
  };

  const renderer = () => {
    if (locationOptions?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {locationOptions?.slice(0, 5)?.map((item, index) => {
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_CITIES}</div>
      {renderer()}
    </>
  );
};

export default TopCities;
