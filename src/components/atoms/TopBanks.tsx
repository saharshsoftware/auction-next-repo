"use client"
import { fetchLocation } from '@/server/actions';
import { fetchBankTopClient } from '@/services/Home';
import { fetchLocationTopClient } from '@/services/location';
import { REACT_QUERY, SAMPLE_CITY, STRING_DATA } from '@/shared/Constants';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { IBanks, ILocations } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'

const TopBanks = (props:{isFooter?:boolean}) => {
  const {isFooter=false} = props
    const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
      queryKey: [REACT_QUERY.AUCTION_BANKS, "top"],
      queryFn: async () => {
        const res = (await fetchBankTopClient()) as unknown as IBanks[];
        console.log(res, "footertop")
        return res ?? [];
      },
    });

      const renderLink = (item: IBanks) => {
        if (item?.route) {
          return (
            <Link
              className={`${isFooter?'link link-primary' :''}`}
              href={item?.route ?? ""}
            >
              {item?.bankName}
            </Link>
          );
        }
        return item?.bankName;
      };

    if (isFooter) {
      return (
        <>
          <div className="top-heading-class">{'Banks'}</div>
          {[...(locationOptions ?? [])].map((item, index) => {
            return (
              <div className="" key={index}>
                {renderLink(item)}
              </div>
            );
          })}
          <Link
            className={`${isFooter ? "link link-primary" : ""}`}
            href={ROUTE_CONSTANTS.E_BANKS_ALL}
          >
            All
          </Link>
        </>
      );
    }

  return (
    <>
      <div className="custom-common-header-class">{STRING_DATA.TOP_CITY}</div>
      {[...(locationOptions ?? [])].map((item, index) => {
        return (
          <div className="custom-common-header-detail-class" key={index}>
            <div className="flex flex-col gap-4 p-4  w-full min-h-12">
              <h2 className="line-clamp-1">{renderLink(item)}</h2>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default TopBanks