/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import AuctionCard from "../atoms/AuctionCard";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import {
  capitalizeFirstLetter,
  convertString,
  getDataFromQueryParams,
  setDataInQueryParams,
} from "@/shared/Utilies";
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from "@/shared/Constants";
import NoDataImage from "../ui/NoDataImage";
import PaginationComp from "../atoms/PaginationComp";
import { useQuery } from "@tanstack/react-query";
import { getAuctionData } from "@/server/actions";
import CustomLoading from "../atoms/Loading";
import { getAuctionDataClient } from "@/services/auction";
import SkeltonAuctionCard from "../skeltons/SkeltonAuctionCard";
import useLocalStorage from "@/hooks/useLocationStorage";

interface IShowAuctionList {
  isCategoryRoute?: boolean;
  isLocationRoute?: boolean;
  isBankRoute?: boolean;
}

const ShowAuctionList = (props: IShowAuctionList) => {
  const {
    isBankRoute = false,
    isCategoryRoute = false,
    isLocationRoute = false,
  } = props;
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
 const currentRoute = usePathname();

  const [apiResponseData, setApiResponseData] = useState<any>({
    sendResponse: [],
    meta: {},
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER, FILTER_EMPTY);
  console.log(auctionFilter, "auctionFilterauctionFilter");

  const filterRef = useRef<any>({
    category: currentRoute.startsWith("/category")
      ? convertString(params?.slug?.toString())
      : "",
    bankName: currentRoute.startsWith("/bank")
      ? auctionFilter?.bank
      : "",
    location: currentRoute.startsWith("/location")
      ? convertString(params?.slug?.toString())
      : "",
  });

  const getFilterData = () => {
    return {
      category: filterRef.current?.category ?? "",
      bankName: filterRef.current?.bankName ?? "",
      reservePrice: filterRef.current?.price ?? "",
      location: filterRef.current?.location ?? "",
      page: currentPage?.toString() ?? "",
    };
  };

  useEffect(() => {
    if (searchParams.get("q")) {
      const data = searchParams.get("q");
      filterRef.current = getDataFromQueryParams(data ?? "");
      // console.log(filterRef.current?.value, "queryData");
      setCurrentPage(filterRef.current?.page);
      refetch();
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
    enabled:
      currentRoute.startsWith("/category") ||
      currentRoute.startsWith("/bank") ||
      currentRoute.startsWith("/location"),
  });

  // useEffect(() => {
  //   if (auctionData) {
  //     setApiResponseData(auctionData);
  //   }
  // }, [auctionData]);

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

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
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
