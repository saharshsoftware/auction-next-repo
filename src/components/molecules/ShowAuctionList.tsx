/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { lazy, useEffect, useMemo, useRef, useState } from "react";
import { debounce, isEqual } from "lodash";
// import AuctionCard from "../atoms/AuctionCard";
// const AuctionCard = lazy(() => import("../atoms/AuctionCard"));

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import { getDataFromQueryParams, setDataInQueryParams } from "@/shared/Utilies";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import PaginationComp from "../atoms/PaginationComp";
import SkeltonAuctionCard from "../skeltons/SkeltonAuctionCard";
import useModal from "@/hooks/useModal";
import SavedSearchModal from "../ modals/SavedSearchModal";
import { getCookie } from "cookies-next";
import { useFilterStore } from "@/zustandStore/filters";
import RenderH1SeoHeader from "../atoms/RenderH1SeoHeader";
import LoginComp from "../templates/LoginComp";
import CustomModal from "../atoms/CustomModal";
import { getAuctionDataClient, noticeSearch } from "@/services/auction";
import { useAuctionStore } from "@/zustandStore/auctionStore";
import dynamic from "next/dynamic";

// Don't change this it may affect Largest Contentful Paint (LCP) score
const AuctionCard = dynamic(() => import("../atoms/AuctionCard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex items-center justify-center">
      <SkeltonAuctionCard />
    </div>
  ),
});
const ShowAuctionList = () => {
  const { filter, prevParams, setPrevParams } = useFilterStore();
  const { setFilter } = useFilterStore();
  const {
    auctionList,
    page,
    setAuctions,
    setPage,
    resetAuctions,
    paginationData,
    setPaginationData,
    setIsLoading,
    isLoading,
  } = useAuctionStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchQ = searchParams.get("q") ?? "";
  const urlSearchPage = searchParams.get("page") ?? 1;
  const pathname = usePathname();

  const { showModal, openModal, hideModal } = useModal();
  const {
    showModal: showModalLogin,
    openModal: openModalLogin,
    hideModal: hideModalLogin,
  } = useModal();

  const [hasKeywordSearchValue, setHasKeywordSearchValue] =
    useState<string>("");
  const isLoadingRef = useRef(false);
  const notAuctionSearchRoute = pathname !== ROUTE_CONSTANTS.SEARCH;
  // Memoizing filter params to prevent unnecessary re-renders
  const filterParams = useMemo(
    () => ({
      category: filter.category?.name ?? "",
      bankName: filter?.bank?.name ?? "",
      location: filter?.location?.name ?? "",
      propertyType: filter?.propertyType?.name ?? "",
      reservePrice: filter?.price ?? [],
      locationType: filter?.location?.type ?? "",
      keyword: "",
      page: page.toString(),
    }),
    [
      filter.category?.name,
      filter?.bank?.name,
      filter?.location?.name,
      filter?.propertyType?.name,
      filter?.price,
      filter?.location?.type,
      page,
    ]
  );

  // Fetch auction data function
  const fetchAuctionData = async (params: any, isSearchApiCall?: boolean) => {
    console.log("FETCHING_API:  ");
    console.table({
      prevParams,
      params,
    });
    if (isEqual(prevParams, params) && !isSearchApiCall) {
      console.log("(INFO):: Same params, skipping API call");
      return;
    }
    if (isLoadingRef.current && !isSearchApiCall) {
      console.log("(INFO):: Already loading, skipping API call");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      let res;
      console.log("(INFO):: params", params);
      if (pathname !== ROUTE_CONSTANTS.SEARCH) {
        res = await getAuctionDataClient(params);
      } else {
        console.log("urlSearchQ", { urlSearchQ, urlSearchPage });
        res = await noticeSearch({
          searchParams: urlSearchQ ?? "",
          page: Number(urlSearchPage),
        });
      }
      setAuctions(res.sendResponse);
      setPaginationData(res.meta);
      setPrevParams(params);
    } catch (error) {
      console.error("Error fetching auction data:", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  // Inside the component
  const debouncedFetchAuctionDataRef = useRef(debounce(fetchAuctionData, 1000));

  useEffect(() => {
    debouncedFetchAuctionDataRef.current(filterParams);
    return () => {
      debouncedFetchAuctionDataRef.current.cancel();
    };
    // fetchAuctionData(filterParams);
  }, [filterParams]);

  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;
    if (pathname === ROUTE_CONSTANTS.SEARCH) {
      router.replace(
        ROUTE_CONSTANTS.SEARCH + `?q=${urlSearchQ}&page=${pageValue}`
      );
      return;
    }
    setPage(pageValue);
    const newParams = { ...filter, page: pageValue };
    const encodedQuery = setDataInQueryParams(newParams);
    router.replace(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
  };

  useEffect(() => {
    const query = urlSearchQ;
    console.log("queryEffect", query);
    if (query) {
      if (pathname !== ROUTE_CONSTANTS.SEARCH) {
        const data = query;
        const result = getDataFromQueryParams(data ?? "") as any;
        setFilter(result);

        if (result?.keyword) {
          setHasKeywordSearchValue(result?.keyword);
          return;
        }
        setHasKeywordSearchValue("");
      } else {
        console.log("hits, search api");
        fetchAuctionData(filterParams, true);
      }
    }
  }, [urlSearchQ, urlSearchPage]);

  const handleClick = (data: any) => {
    const paramsValue = searchParams.get("q")
      ? `?q=${searchParams.get("q")}`
      : "";
    router.push(`${ROUTE_CONSTANTS.AUCTION_DETAIL}/${data?.slug}`);
  };

  const renderAuctionlist = () => {
    if (isLoading) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center">
          <SkeltonAuctionCard />
        </div>
      );
    } else if (auctionList.length === 0) {
      return (
        <div className="flex items-center justify-center flex-col h-[70vh]">
          No data found
        </div>
      );
    } else {
      return auctionList.map((item: IAuction, index: number) => {
        return (
          <React.Fragment key={index}>
            <AuctionCard item={item} handleClick={handleClick} />
          </React.Fragment>
        );
      });
    }
  };

  const renderKeywordSearchContainer = () => {
    if (hasKeywordSearchValue) {
      return (
        <div className="text-sm ">
          {auctionList.length} results of {hasKeywordSearchValue}
        </div>
      );
    }
    return null;
  };

  const handleSaveSearchClick = () => {
    const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
    if (token) {
      showModal();
      return;
    }
    showModalLogin();
  };

  const renderSavedSearchButton = () => {
    const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
    if (urlSearchQ && pathname !== ROUTE_CONSTANTS.SEARCH) {
      return (
        <div
          className={"max-w-fit link link-primary"}
          onClick={handleSaveSearchClick}
        >
          {"Save this search".toUpperCase()}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setPage(1);
  }, []);

  return (
    <div className={``}>
      {openModalLogin ? (
        <CustomModal
          openModal={openModalLogin}
          modalHeading={STRING_DATA.LOGIN}
          customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
        >
          <div className="w-full">
            <LoginComp isAuthModal={true} closeModal={hideModalLogin} />
          </div>
        </CustomModal>
      ) : null}
      {openModal ? (
        <SavedSearchModal openModal={openModal} hideModal={hideModal} />
      ) : null}

      <RenderH1SeoHeader total={paginationData?.total} isLoading={isLoading} />
      <div className={`flex flex-col gap-4 w-full `}>
        {renderKeywordSearchContainer()}
        {!isLoading && renderSavedSearchButton()}
        {renderAuctionlist()}
      </div>
      {!isLoading && auctionList.length > 0 && (
        <PaginationComp
          totalPage={paginationData?.pageCount}
          onPageChange={handlePageChange}
          activePage={notAuctionSearchRoute ? page : Number(urlSearchPage)}
        />
      )}
    </div>
  );
};

export default ShowAuctionList;
