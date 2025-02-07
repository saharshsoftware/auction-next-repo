import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getPathType } from "@/shared/Utilies";
import { useFilterStore } from "@/zustandStore/filters";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface IRenderH1SeoHeader {
  total: number;
}

const RenderH1SeoHeader = (props: IRenderH1SeoHeader) => {
  const { total } = props;
  const filterData = useFilterStore((state) => state.filter);
  const propertyTypeName = filterData?.propertyType?.name;
  const bankName = filterData?.bank?.name;
  const locationName = filterData?.location?.name;
  const category = filterData?.category?.name;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const titlename =
    filterData?.[getPathType?.(pathname) as keyof typeof filterData]?.name;
  const renderer = () => {
    if (pathname === ROUTE_CONSTANTS.SEARCH) {
      return (
        <h1 className="custom-h1-class break-words my-4">
          {`${
            total ?? 0
          } auction properties result found for ${searchParams.get("q")}`}
        </h1>
      );
    }
    if (pathname && getPathType?.(pathname) && titlename) {
      return (
        <h1 className="custom-h1-class break-words my-4">
          {`Auction Properties ${
            propertyTypeName ? ` and ${propertyTypeName}` : ""
          } ${category ? ` and ${category}` : ""} in ${titlename}`}
        </h1>
      );
    }
    console.log("No data found", titlename);

    return "";
  };

  return <>{renderer()}</>;
};

export default RenderH1SeoHeader;
