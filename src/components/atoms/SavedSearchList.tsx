"use client";
import { fetchSavedSearch } from "@/services/auction";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { ISavedSearch } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const SavedSearchList = () => {
  const { data: savedSearchData, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.SAVED_SEARCH],
    queryFn: async () => {
      const res = (await fetchSavedSearch()) as unknown as ISavedSearch[];
      return res ?? [];
    },
  });

  if (fetchStatus === "fetching") {
    return (
      <div className="flex flex-col gap-2">
        <label className={`flex justify-start items-center w-full `}>
          <div className="skeleton h-4 w-32 "></div>
        </label>
        <div className="flex flex-wrap gap-4 items-center">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="border bg-gray-200 min-w-fit text-sm text-gray-800 shadow px-2 py-1 rounded-lg border-brand-color "
            >
              <div className="skeleton h-4 w-24 "></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderer = () => {
    if (savedSearchData?.length === 0) {
      return null;
    }
    return (
      <>
        <div className="flex flex-col gap-2 w-full">
          <label className={`flex justify-start items-center w-full `}>
            <span className="text-sm text-gray-900">Saved search </span>
          </label>
          <div className="flex flex-wrap gap-4 items-center">
            {savedSearchData?.map((item: ISavedSearch, index) => {
              return (
                <Link
                  href={{
                    pathname: ROUTE_CONSTANTS.AUCTION,
                    query: { q: item?.filter },
                  }}
                  className="border bg-gray-200 min-w-fit text-sm text-gray-800 shadow px-2 py-1 rounded-lg border-brand-color "
                  key={index}
                >
                  {item?.name}
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // console.log(savedSearchData, "savedSearchData");
  return <>{renderer()}</>;
};

export default SavedSearchList;
