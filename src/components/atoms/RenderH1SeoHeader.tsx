import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getDynamicHeight, getPathType } from "@/shared/Utilies";
import { useFilterStore } from "@/zustandStore/filters";
import { useParams, usePathname, useSearchParams } from "next/navigation";
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
  const params = useParams() as {
    slug: string;
    slugasset: string;
    slugcategory: string;
    slugbank: string;
  };

  const titlename =
    filterData?.[getPathType?.(pathname) as keyof typeof filterData]?.name;
  const propertyPluralizeName =
    filterData?.["propertyType"]?.pluralizeName ?? "";

  const [pageTitle, setPageTitle] = useState<string>("Auction Properties");

  useEffect(() => {
    if (!pathname) return;

    // Extract slugs dynamically
    const pathSegments = pathname.split("/").filter(Boolean);
    const currentRoute = pathSegments[0];
    const locationSlug = pathSegments[1] || ""; // 'agra'
    const subRoute = pathSegments[2];
    const bankSlug = pathSegments[3] || ""; // 'icici-home-finance'

    const bankNamePrimary =
      filterData?.bank?.secondarySlug === params.slugbank ||
      filterData?.bank?.secondarySlug === params.slug
        ? filterData?.bank?.secondarySlug?.toUpperCase() ?? (bankName || "")
        : bankName || "";
    // console.log("pathname", {
    //   currentRoute,
    //   subRoute,
    // });
    // Generate dynamic title
    let title = "Auction Properties";

    if (
      currentRoute === STRING_DATA.LOCATIONS?.toLowerCase() &&
      subRoute === STRING_DATA.BANKS?.toLowerCase()
    ) {
      title = `${bankNamePrimary} Auction Properties in ${locationName}`;
    } else if (
      currentRoute === STRING_DATA.LOCATIONS?.toLowerCase() &&
      subRoute === STRING_DATA.TYPES?.toLowerCase()
    ) {
      title = `Bank Auction ${propertyPluralizeName}  in ${locationName}`;
    } else if (
      currentRoute === STRING_DATA.LOCATIONS?.toLowerCase() &&
      subRoute === STRING_DATA.CATEGORIES_LOWER?.toLowerCase()
    ) {
      title = `${category} Bank Properties in ${locationName}`;
    } else if (currentRoute === STRING_DATA.BANKS?.toLowerCase()) {
      title = `${bankNamePrimary} Auction Properties`;
    } else if (currentRoute === STRING_DATA.TYPES?.toLowerCase()) {
      title = `Bank Auction ${propertyPluralizeName} in India`;
    } else if (
      currentRoute === STRING_DATA.CATEGORIES?.toLowerCase() &&
      subRoute === STRING_DATA.TYPES?.toLowerCase()
    ) {
      title = `Bank Auction ${propertyPluralizeName}  in India`;
    } else if (currentRoute === STRING_DATA.CATEGORIES?.toLowerCase()) {
      title = `${titlename} Bank Auction Properties  in India`;
    } else {
      title = `Auction Properties in ${titlename}`;
    }

    setPageTitle(`${total ? `${total}` : ""} ${title} `);
  }, [pathname]);

  // const seoHeaderHeight = getDynamicHeight(pageTitle);
  const seoHeaderHeight = pageTitle.length || 0;

  const renderer = () => {
    if (pathname === ROUTE_CONSTANTS.SEARCH) {
      return `${
        total ?? 0
      } auction properties result found for ${searchParams.get("q")}`;
    }
    if (pathname && getPathType?.(pathname) && titlename) {
      return pageTitle;
    }
    // console.log("No data found", titlename);

    return "";
  };

  // return <>{renderer()}</>;
  return (
    <h1
      className={
        `text-2xl font-bold break-words my-4  
    ` +
        ` ${pageTitle && seoHeaderHeight < 40 && " md:h-[45px] h-[75px]"}` +
        ` ${
          pageTitle &&
          seoHeaderHeight >= 40 &&
          pageTitle &&
          seoHeaderHeight < 120 &&
          "h-[60px] md:h-[30px]"
        }` +
        ` ${seoHeaderHeight >= 120 && " h-[80px]"}`
      }
    >
      {renderer()}
    </h1>
  );
};

export default RenderH1SeoHeader;
