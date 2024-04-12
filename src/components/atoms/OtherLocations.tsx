"use client";
import { fetchLocation } from "@/server/actions";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { ILocations } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CustomLoading from "./Loading";

const OtherLocations = () => {
  const { data: locationOptions, isLoading } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocation()) as unknown as ILocations[];
      return res ?? [];
    },
  });


  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <CustomLoading />
      </div>
    );
  }
  console.log(locationOptions, "locationOptions");
  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.OTHER_LOCATIONS}
      </div>

      {locationOptions?.map((item, index) => {
        return (
          <div className="custom-common-header-detail-class" key={index}>
            <div className="flex flex-col gap-4 p-4  w-full min-h-12">
              <h2 className="custom-h2-class line-clamp-1">{item?.name}</h2>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OtherLocations;
