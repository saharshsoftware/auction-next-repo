import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAssetType } from "@/types";
import Link from "next/link";
import React from "react";

const TopAssets = (props: {
  isBankTypesRoute?: boolean;
  bankSlug?: string;
  assetsTypeData?: IAssetType[];
}) => {
  const { isBankTypesRoute = false, assetsTypeData = [], bankSlug } = props;

  const renderLink = (item: IAssetType) => {
    const URL = `${ROUTE_CONSTANTS.BANKS}/${bankSlug}/${STRING_DATA.TYPES}/${item?.slug}`;
    // console.log("INFO:: (URL)", { URL, params });
    if (isBankTypesRoute) {
      return <Link href={URL} className="text-sm-xs">{item?.name}</Link>;
    }
    return (
      <Link href={`${ROUTE_CONSTANTS.TYPES}/${item?.slug}`} className="text-sm-xs">{item?.name}</Link>
    );
  };

  const renderer = () => {
    if (assetsTypeData?.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          No data found
        </div>
      );
    }
    return (
      <>
        {assetsTypeData?.slice(0, 5)?.map((item, index) => {
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
      <div className="custom-common-header-class">{STRING_DATA.TOP_ASSETS}</div>
      {renderer()}
    </>
  );
};

export default TopAssets;
