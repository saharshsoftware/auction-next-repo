"use client";
import { fetchSavedSearch } from "@/services/auction";
import { REACT_QUERY } from "@/shared/Constants";
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
  // console.log(savedSearchData, "savedSearchData");
  return (
    <div className="flex flex-col gap-2 w-full items-start">
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
              className="border border-gray-500 min-w-fit text-sm text-gray-800 shadow px-2 py-1"
              key={index}
            >
              {item?.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SavedSearchList;
