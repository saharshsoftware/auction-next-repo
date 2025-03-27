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
  page: number;
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

  // Function to decode data from query parameters
  const getDataFromQueryParamsMethod = () => {
    const queryParam = params.get("q");

    if (queryParam) {
      const decodedData = atob(queryParam);
      console.log("decodedData", decodedData);
      return JSON.parse(decodedData);
    }
    return null;
  };

  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;

    const newParams = { ...filterData, page: pageValue };
    console.log(newParams, "newParams", filterData);
    const encodedQuery = setDataInQueryParams(newParams);
    router.push(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
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
        forcePage={activePage - 1}
        className="flex justify-center pagination"
      />
    </div>
  );
};

export default PaginationCompServer;
