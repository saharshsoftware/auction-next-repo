/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import AuctionCard from "../atoms/AuctionCard";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import { getDataFromQueryParams, setDataInQueryParams } from "@/shared/Utilies";
import { COOKIES, REACT_QUERY } from "@/shared/Constants";
import PaginationComp from "../atoms/PaginationComp";
import { useQuery } from "@tanstack/react-query";
import { getAuctionDataClient } from "@/services/auction";
import SkeltonAuctionCard from "../skeltons/SkeltonAuctionCard";
import useModal from "@/hooks/useModal";
import SavedSearchModal from "../ modals/SavedSearchModal";
import { getCookie } from "cookies-next";
import { useFilterStore } from "@/zustandStore/filters";

const ShowAuctionList = () => {
  const filterData = useFilterStore((state) => state.filter);
  const { setFilter } = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showModal, openModal, hideModal } = useModal();

  const [hasKeywordSearchValue, setHasKeywordSearchValue] =
    useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const getFilterData = () => {
    const modifiedfilterData = {
      category: filterData.category?.name ?? "",
      bankName: filterData?.bank?.name ?? "",
      location: filterData?.location?.name ?? "",
      propertyType: filterData?.propertyType?.name ?? "",
      reservePrice: [filterData?.price?.[0] - 0, filterData?.price?.[1] - 0],
      locationType: filterData?.location?.type ?? "",
      keyword: "",
      page: currentPage?.toString() ?? "",
    };
    // console.log("Sending data ....", modifiedfilterData);
    return modifiedfilterData;
  };

  const {
    data: auctionData,
    fetchStatus,
    refetch,
  } = useQuery<any>({
    queryKey: [REACT_QUERY.FIND_AUCTION, filterData],
    queryFn: async () => {
      const res = (await getAuctionDataClient(getFilterData())) as unknown;
      return res ?? [];
    },
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (filterData) {
      console.log("API HIT 🚀 with", filterData);
      refetch();
    }
  }, [filterData]);

  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;
    setCurrentPage(pageValue);
    const newParams = { ...filterData, page: pageValue };
    const encodedQuery = setDataInQueryParams(newParams);
    router.replace(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
  };

  // const debouncedRefetch = debounce(refetch, 500); // Adjust debounce time as per your requirement

  useEffect(() => {
    if (searchParams.get("q")) {
      const data = searchParams.get("q");
      const result = getDataFromQueryParams(data ?? "");
      // filterRef.current = result;
      setFilter(result);
      setCurrentPage(result?.page);

      if (result?.keyword) {
        setHasKeywordSearchValue(result?.keyword);
        return;
      }
      setHasKeywordSearchValue("");
    }
  }, [searchParams.get("q")]);

  const handleClick = (data: any) => {
    const paramsValue = searchParams.get("q")
      ? `?q=${searchParams.get("q")}`
      : "";
    router.push(`${ROUTE_CONSTANTS.AUCTION_DETAIL}/${data?.slug}`);
  };

  if (fetchStatus === "fetching") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <SkeltonAuctionCard />
      </div>
    );
  }

  if (auctionData?.sendResponse?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-[70vh]">
        {/* <NoDataImage /> */}
        No data found
      </div>
    );
  }

  const renderKeywordSearchContainer = () => {
    if (hasKeywordSearchValue) {
      console.log(auctionData, "apiResponseData");
      return (
        <div className="text-sm ">
          {" "}
          {auctionData?.meta?.total} results of {hasKeywordSearchValue}
        </div>
      );
    }
    return null;
  };

  const renderSavedSearchButton = () => {
    const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
    if (searchParams.get("q") && token) {
      return (
        <div className={"max-w-fit link link-primary"} onClick={showModal}>
          {"Save this search".toUpperCase()}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {openModal ? (
        <SavedSearchModal openModal={openModal} hideModal={hideModal} />
      ) : null}
      <div className="flex flex-col gap-4 w-full">
        {renderKeywordSearchContainer()}
        {renderSavedSearchButton()}
        {auctionData?.sendResponse?.map((item: IAuction, index: number) => {
          return (
            <div className="w-full" key={index}>
              <AuctionCard item={item} handleClick={handleClick} />
            </div>
          );
        })}
      </div>
      <PaginationComp
        totalPage={auctionData?.meta?.pageCount}
        onPageChange={handlePageChange}
        activePage={currentPage}
      />
    </>
  );
};

export default ShowAuctionList;
