"use client";
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from "@/shared/Constants";
import { ILocations } from "@/types";
import Link from "next/link";
import React from "react";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useFilterStore } from "@/zustandStore/filters";

const getIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
    >
      <path
        fill="currentColor"
        d="M117.18 188.74a12 12 0 0 1 0 17l-5.12 5.12A58.26 58.26 0 0 1 70.6 228a58.62 58.62 0 0 1-41.46-100.08l34.75-34.75a58.64 58.64 0 0 1 98.56 28.11a12 12 0 1 1-23.37 5.44a34.65 34.65 0 0 0-58.22-16.58l-34.75 34.75A34.62 34.62 0 0 0 70.57 204a34.41 34.41 0 0 0 24.49-10.14l5.11-5.12a12 12 0 0 1 17.01 0M226.83 45.17a58.65 58.65 0 0 0-82.93 0l-5.11 5.11a12 12 0 0 0 17 17l5.12-5.12a34.63 34.63 0 1 1 49 49l-34.81 34.7A34.39 34.39 0 0 1 150.61 156a34.63 34.63 0 0 1-33.69-26.72a12 12 0 0 0-23.38 5.44A58.64 58.64 0 0 0 150.56 180h.05a58.28 58.28 0 0 0 41.47-17.17l34.75-34.75a58.62 58.62 0 0 0 0-82.91"
      />
    </svg>
  );
};

const AllCities = (props: { data: ILocations[] }) => {
  const { data: locationOptions } = props;
  const { setFilter: setAuctionFilter } = useFilterStore();

  const handleLinkClick = (location: ILocations) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      location: {
        ...location,
        label: location?.name,
        value: location?.id,
      } as any,
    });
  };

  return (
    <div className="common-section my-8">
      {/* {JSON.stringify(locationOptions)} */}
      <div className="flex flex-col gap-8">
        {locationOptions?.map((stateObj: any) => {
          const { name, slug, type, cities } = stateObj;
          return (
            <div
              key={slug}
              className="state-section flex flex-col gap-2 border border-blue-400 rounded shadow p-2"
            >
              <Link
                className={`state-name hover:text-gray-400 flex items-center justify-start gap-2`}
                href={`${ROUTE_CONSTANTS.LOCATION}/${slug}`}
                onClick={() => handleLinkClick(stateObj)}
              >
                <span>{name}</span>
                <span>{getIcon()}</span>
              </Link>
              <div className="grid grid-cols-12 gap-4">
                {cities?.map((cityObj: any) => {
                  return (
                    <div
                      key={cityObj?.slug}
                      className="lg:col-span-3 md:col-span-4 col-span-6 "
                    >
                      <p>
                        <Link
                          className={`text-blue-600 text-sm-xs`}
                          href={`${ROUTE_CONSTANTS.LOCATION}/${cityObj?.slug}`}
                          onClick={() => handleLinkClick(cityObj)}
                          prefetch={false}
                        >
                          {cityObj?.name}
                        </Link>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllCities;
