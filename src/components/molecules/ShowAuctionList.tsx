/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import AuctionCard from "../atoms/AuctionCard";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import {
  getDataFromQueryParams,
  setDataInQueryParams,
} from "@/shared/Utilies";
import { REACT_QUERY } from "@/shared/Constants";
import NoDataImage from "../ui/NoDataImage";
import PaginationComp from "../atoms/PaginationComp";
import { useQuery } from "@tanstack/react-query";
import { getAuctionData } from "@/server/actions";

const ShowAuctionList = ({
  searchParams,
  responseData,
  meta,
}: {
  searchParams: any;
  responseData: IAuction[];
  meta: any;
}) => {
  const router = useRouter()
  const params = useSearchParams();

  const [apiResponseData, setApiResponseData] = useState<any>({sendResponse: [], meta: {}})
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterRef = useRef<any>({});

  const getFilterData = () => {
    return {
      category: filterRef.current?.value?.category ?? "",
      bankName: filterRef.current?.value?.bank ?? "",
      reservePrice: filterRef.current?.value?.price ?? "",
      location: filterRef.current?.value?.location ?? "",
      page: currentPage?.toString() ?? "",
    };
  }

  useEffect(() => {
    if (params.get("q")) {
      const data = params.get("q")
      filterRef.current.value = getDataFromQueryParams(data ?? '');
      // console.log(filterRef.current?.value, "queryData");
      setCurrentPage(filterRef.current?.value?.page);
      refetch();
    }
  }, [params.get("q")]);

  const {
    data: auctionData,
    refetch,
  } = useQuery({
    queryKey: [REACT_QUERY.FIND_AUCTION],
    queryFn: async () => {
      const res = (await getAuctionData(getFilterData())) as unknown;
      console.log(res, 'apidata')
      return res ?? [];
    },
    enabled: false,
  });

  useEffect(()=> {
    if (auctionData) {
      setApiResponseData(auctionData);
    }
  }, [auctionData])

  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;
    setCurrentPage(pageValue);
    const newParams = { ...filterRef.current.value, page: pageValue };
    const encodedQuery = setDataInQueryParams(newParams);
    router.push(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
  };

  const handleClick = (data: any) => {
    router.push(
      ROUTE_CONSTANTS.AUCTION_DETAIL + "/" + data?.id + "?q=" + searchParams?.q
    );
  };


  if (apiResponseData?.sendResponse?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-[70vh]">
        <NoDataImage />
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
        totalPage={meta?.pageCount}
        onPageChange={handlePageChange}
        activePage={currentPage}
      />
    </>
  );
};

export default ShowAuctionList;
