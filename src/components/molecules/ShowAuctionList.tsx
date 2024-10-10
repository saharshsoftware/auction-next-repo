/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import AuctionCard from "../atoms/AuctionCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import {
  getDataFromQueryParams,
  getPathType,
  setDataInQueryParams,
} from "@/shared/Utilies";
import { COOKIES, REACT_QUERY } from "@/shared/Constants";
import PaginationComp from "../atoms/PaginationComp";
import { useQuery } from "@tanstack/react-query";
import { getAuctionDataClient, noticeSearch } from "@/services/auction";
import SkeltonAuctionCard from "../skeltons/SkeltonAuctionCard";
import useModal from "@/hooks/useModal";
import SavedSearchModal from "../ modals/SavedSearchModal";
import { getCookie } from "cookies-next";
import { useFilterStore } from "@/zustandStore/filters";
import NoDataImage from "../ui/NoDataImage";

const ShowAuctionList = () => {
  const filterData = useFilterStore((state) => state.filter) as any;
  const { setFilter } = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // This will give the path without the slug

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

  const fetchDataQuery = async () => {
    if (pathname !== ROUTE_CONSTANTS.SEARCH) {
      return await getAuctionDataClient(getFilterData());
    }
    return await noticeSearch({ searchParams: searchParams.get("q") ?? "" });
  };

  const {
    data: auctionData,
    fetchStatus,
    refetch,
  } = useQuery<any>({
    queryKey: [REACT_QUERY.FIND_AUCTION, filterData],
    queryFn: async () => {
      const res = (await fetchDataQuery()) as unknown;
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
    if (searchParams.get("q") && pathname !== ROUTE_CONSTANTS.SEARCH) {
      const data = searchParams.get("q");
      const result = getDataFromQueryParams(data ?? "") as any;
      // filterRef.current = result;
      setFilter(result);
      setCurrentPage(result?.page);

      if (result?.keyword) {
        setHasKeywordSearchValue(result?.keyword);
        return;
      }
      setHasKeywordSearchValue("");
    } else {
      console.log("hits, search api");
      refetch();
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
    if (searchParams.get("q") && token && pathname !== ROUTE_CONSTANTS.SEARCH) {
      return (
        <div className={"max-w-fit link link-primary"} onClick={showModal}>
          {"Save this search".toUpperCase()}
        </div>
      );
    }
    return null;
  };

  const renderH1HeaderSEO = () => {
    if (pathname === ROUTE_CONSTANTS.SEARCH) {
      return (
        <h1 className="custom-h1-class break-words my-4">
          {`${
            auctionData?.meta?.total ?? 0
          } result found for ${searchParams.get("q")}`}
        </h1>
      );
    }
    if (
      pathname &&
      getPathType?.(pathname) &&
      filterData?.[getPathType?.(pathname) ?? ""]?.name
    ) {
      return (
        <h1 className="custom-h1-class break-words my-4">
          {`Find Auction Properties for ${
            filterData?.[getPathType?.(pathname) ?? ""]?.name
          }`}
        </h1>
      );
    }
    console.log(
      "No data found",
      filterData?.[getPathType?.(pathname) ?? ""]?.name
    );

    return "";
  };

  return (
    <>
      {openModal ? (
        <SavedSearchModal openModal={openModal} hideModal={hideModal} />
      ) : null}
      {renderH1HeaderSEO()}
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
      {auctionData?.meta?.pageCount ? (
        <PaginationComp
          totalPage={auctionData?.meta?.pageCount}
          onPageChange={handlePageChange}
          activePage={currentPage}
        />
      ) : null}
    </>
  );
};

export default ShowAuctionList;
