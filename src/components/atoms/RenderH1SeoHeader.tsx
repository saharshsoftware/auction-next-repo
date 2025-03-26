"use client";
import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getPathType, sanitizeCategorySEOH1title } from "@/shared/Utilies";
import { useFilterStore } from "@/zustandStore/filters";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IRenderH1SeoHeader {
  total: number;
  isLoading?: boolean;
}

const RenderH1SeoHeader = (props: IRenderH1SeoHeader) => {
  const { total, isLoading } = props;
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
      currentRoute === STRING_DATA.BANKS?.toLowerCase() &&
      subRoute === STRING_DATA.TYPES?.toLowerCase()
    ) {
      title = `${bankNamePrimary} ${propertyTypeName} auctions`;
    } else if (
      currentRoute === STRING_DATA.BANKS?.toLowerCase() &&
      subRoute === STRING_DATA.CATEGORIES?.toLowerCase()
    ) {
      title = `${bankNamePrimary}  ${category} Property Auctions`;
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
      title = sanitizeCategorySEOH1title(titlename);
    } else {
      title = `Auction Properties in ${titlename}`;
    }

    setPageTitle(`${total ? `${total}` : ""} ${title} `);
  }, [
    pathname,
    filterData,
    total,
    params.slugbank,
    params.slug,
    bankName,
    locationName,
    propertyPluralizeName,
    category,
    titlename,
    propertyTypeName,
  ]);

  const Heading = ({ children }: { children: React.ReactNode }) => (
    <h1 className="custom-h1-class break-words my-4">{children}</h1>
  );

  const renderer = () => {
    if (isLoading)
      return (
        <Heading>
          <div className="skeleton h-6 w-2/3"></div>
        </Heading>
      );

    if (pathname) {
      if (pathname === ROUTE_CONSTANTS.SEARCH) {
        return (
          <Heading>
            {`${
              total ?? 0
            } auction properties result found for ${searchParams.get("q")}`}
          </Heading>
        );
      }

      if (getPathType?.(pathname) && titlename) {
        return <Heading>{pageTitle}</Heading>;
      }
    }

    return null;
  };

  return <>{renderer()}</>;
};

export default RenderH1SeoHeader;
