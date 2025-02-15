import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getPathType } from "@/shared/Utilies";
import { useFilterStore } from "@/zustandStore/filters";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IRenderH1SeoHeader {
  total: number;
}

const RenderH1SeoHeader = (props: IRenderH1SeoHeader) => {
  const { total } = props;
  const filterData = useFilterStore((state) => state.filter);
  const propertyTypeName = filterData?.propertyType?.name ?? "";
  const bankName = filterData?.bank?.name ?? "";
  const locationName = filterData?.location?.name ?? "";
  const category = filterData?.category?.name ?? "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const titlename =
    filterData?.[getPathType?.(pathname) as keyof typeof filterData]?.name;

  const [pageTitle, setPageTitle] = useState<string>("Auction Properties");

  useEffect(() => {
    if (!pathname) return;

    // Extract slugs dynamically
    const pathSegments = pathname.split("/").filter(Boolean);
    const currentRoute = pathSegments[0];
    const locationSlug = pathSegments[1] || ""; // 'agra'
    const subRoute = pathSegments[2];
    const bankSlug = pathSegments[3] || ""; // 'icici-home-finance'
    console.log("pathname", {
      currentRoute,
      subRoute,
    });
    // Generate dynamic title
    let title = "Auction Properties";

    if (currentRoute === "locations" && subRoute === "banks") {
      title = `${bankName} Auction Properties in ${locationName}`;
    } else if (currentRoute === "locations" && subRoute === "types") {
      title = `${propertyTypeName} for Auction in ${locationName}`;
    } else if (currentRoute === "locations" && subRoute === "categories") {
      title = `${category} Properties for Bank Auction in ${locationName}`;
    } else if (currentRoute === "banks") {
      title = `${bankName} Auction Properties`;
    } else if (currentRoute === "asset-types") {
      title = `Bank Auction ${titlename} in India`;
    } else {
      title = `Auction Properties in ${titlename}`;
    }

    setPageTitle(`${total ? `${total}` : ""} ${title} `);
  }, [pathname]);

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
          {/* {`Auction Properties ${
            propertyTypeName ? ` and ${propertyTypeName}` : ""
          } ${category ? ` and ${category}` : ""} in ${titlename}`} */}
          {pageTitle}
        </h1>
      );
    }
    console.log("No data found", titlename);

    return "";
  };

  return <>{renderer()}</>;
};

export default RenderH1SeoHeader;
