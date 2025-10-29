"use client";
import { RANGE_PRICE, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { setDataInQueryParams } from "@/shared/Utilies";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import { useFilterStore } from "@/zustandStore/filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export interface ILocalFilter {
  bank?: IBanks;
  location?: ILocations;
  category?: ICategoryCollection;
  price?: string[];
  propertyType?: IAssetType;
  page: number | string;
}

const PaginationCompServer = (props: {
  totalPage: number;
  activePage?: number;
  filterData: ILocalFilter;
}) => {
  const { activePage = 1, totalPage, filterData } = props;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const urlSearchQ = params.get("q") ?? "";

  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;

    const newParams = { ...filterData, page: pageValue };
    console.log(newParams, "newParams", filterData, pathname);
    const encodedQuery = setDataInQueryParams(newParams);
    if (pathname === ROUTE_CONSTANTS.AUCTION) {
      router.push(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
      return;
    }
    if (pathname === ROUTE_CONSTANTS.SEARCH) {
      router.replace(
        ROUTE_CONSTANTS.SEARCH + `?q=${urlSearchQ}&page=${pageValue}`
      );
      return;
    }
    // Handle collection pages
    if (pathname.startsWith(ROUTE_CONSTANTS.COLLECTION_PUBLIC)) {
      router.push(pathname + "?page=" + pageValue);
      return;
    }
    router.push(pathname + "?page=" + pageValue);
  };

  return (
    <div className="my-4 ">
      <ReactPaginate
        previousLabel="< previous"
        breakLabel="..."
        nextLabel="next >"
        pageCount={totalPage}
        onPageChange={handlePageChange}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        forcePage={Number(activePage) - 1}
        className="flex justify-center pagination"
      />
    </div>
  );
};

export default PaginationCompServer;
