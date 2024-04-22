/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import AuctionCard from "../atoms/AuctionCard";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import {
  convertString,
  getDataFromQueryParams,
  setDataInQueryParams,
} from "@/shared/Utilies";
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from "@/shared/Constants";
import PaginationComp from "../atoms/PaginationComp";
import { useQuery } from "@tanstack/react-query";
import { getAuctionDataClient } from "@/services/auction";
import SkeltonAuctionCard from "../skeltons/SkeltonAuctionCard";
import useLocalStorage from "@/hooks/useLocationStorage";

const ShowAuctionList = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentRoute = usePathname();

  const [apiResponseData, setApiResponseData] = useState<any>({
    sendResponse: [],
    meta: {},
  });

  const [hasKeywordSearchValue, setHasKeywordSearchValue] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER, FILTER_EMPTY);
  console.log(auctionFilter, "auctionFilterauctionFilter");

  const filterRef = useRef<any>({
    category: currentRoute.startsWith("/category")
      ? convertString(params?.slug?.toString())
      : "",
    bank: currentRoute.startsWith("/bank")
      ? auctionFilter?.bank?.slug?.toString()
      : "",
    location: currentRoute.startsWith("/location")
      ? convertString(params?.slug?.toString())
      : "",
  });

  const getFilterData = () => {
    const filterData = {
      category: filterRef.current?.category?.name ?? auctionFilter?.category?.name ?? "",
      bankName:
        filterRef.current?.bank?.name ?? auctionFilter?.bank?.name ?? "",
      reservePrice: filterRef.current?.price ?? "",
      location:
        filterRef.current?.location?.name ?? auctionFilter?.location?.name ?? "",
      locationType:
        filterRef.current?.location?.type ?? auctionFilter?.location?.type ?? "",
      propertyType:
        filterRef.current?.propertyType?.name ?? auctionFilter?.propertyType?.name ?? "",
      keyword: filterRef.current?.keyword ?? "",
      page: currentPage?.toString() ?? "",
    };
    console.log(filterData, "filterDAta")
    return filterData;
  };

  useEffect(() => {
    if (searchParams.get("q")) {
      const data = searchParams.get("q");
      filterRef.current = getDataFromQueryParams(data ?? "");
      setCurrentPage(filterRef.current?.page);
      refetch();
      // console.log(filterRef.current?.value, "queryData");

      if (filterRef.current?.keyword)  {
        setHasKeywordSearchValue(filterRef.current?.keyword)
        return;
      }
      setHasKeywordSearchValue('')
    }
  }, [searchParams.get("q")]);

  const {
    data: auctionData,
    fetchStatus,
    refetch,
  } = useQuery({
    queryKey: [REACT_QUERY.FIND_AUCTION],
    queryFn: async () => {
      const res = (await getAuctionDataClient(getFilterData())) as unknown;
      console.log(res, "apidata");
      setApiResponseData(res);
      return res ?? [];
    },
    enabled: true
});


  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;
    setCurrentPage(pageValue);
    const newParams = { ...filterRef.current, page: pageValue };
    const encodedQuery = setDataInQueryParams(newParams);
    router.replace(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
  };

  const handleClick = (data: any) => {
    const paramsValue = searchParams.get("q")? `?q=${searchParams.get("q")}`: '';
    router.push(`${ROUTE_CONSTANTS.AUCTION_DETAIL}/${data?.slug}`);
  };

  // console.log("fetchStatus", fetchStatus);
  if (fetchStatus === "fetching") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <SkeltonAuctionCard />
      </div>
    );
  }

  if (apiResponseData?.sendResponse?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-[70vh]">
        {/* <NoDataImage /> */}
        No data found
      </div>
    );
  }

  const renderKeywordSearchContainer = () => {
    if (hasKeywordSearchValue) {
      console.log(apiResponseData, "apiResponseData");
      return (
        <div className="text-sm ">
          {" "}
          {apiResponseData?.meta?.total} results of {hasKeywordSearchValue}
        </div>
      );
    }
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {renderKeywordSearchContainer()}
        {apiResponseData?.sendResponse?.map((item: IAuction, index: number) => {
          return (
            <div className="w-full" key={index}>
              <AuctionCard item={item} handleClick={handleClick} />
            </div>
          );
        })}
      </div>
      <PaginationComp
        totalPage={apiResponseData?.meta?.pageCount}
        onPageChange={handlePageChange}
        activePage={currentPage}
      />
    </>
  );
};

export default ShowAuctionList;
