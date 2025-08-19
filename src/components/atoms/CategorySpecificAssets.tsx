import { fetchAssetTypes } from "@/server/actions/assetTypes";
import { fetchTopAssetsTypeClient } from "@/services/assetsType";
import { FILTER_EMPTY, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getCategorySpecificAssets } from "@/shared/Utilies";
import { IAssetType } from "@/types";
import { useFilterStore } from "@/zustandStore/filters";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const CategorySpecificAssets = (props: {
  isBankCategoriesRoute?: boolean;
  isCategoryRoute?: boolean;
  assetsTypeData?: IAssetType[];
  categorySlug?: string;
  bankSlug?: string;
}) => {
  const {
    isBankCategoriesRoute = false,
    isCategoryRoute = false,
    assetsTypeData = [],
    bankSlug,
    categorySlug,
  } = props;

  const renderLink = (item: IAssetType) => {
    let URL = "";
    URL = `${
      ROUTE_CONSTANTS.CATEGORY
    }/${categorySlug}/${STRING_DATA.TYPES?.toLowerCase()}/${item?.slug}`;
    if (isCategoryRoute) {
      return <Link href={URL} className="text-sm-xs">{item?.name}</Link>;
    }
    URL = `${
      ROUTE_CONSTANTS.BANKS
    }/${bankSlug}/${STRING_DATA.TYPES?.toLowerCase()}/${item?.slug}`;
    // console.log("INFO:: (URL)", { URL, params });
    if (isBankCategoriesRoute) {
      return <Link href={URL} className="text-sm-xs">{item?.name}</Link>;
    }
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
        {assetsTypeData?.map((item, index) => {
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

export default CategorySpecificAssets;
