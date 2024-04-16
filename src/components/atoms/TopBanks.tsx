"use client"
import useLocalStorage from '@/hooks/useLocationStorage';
import { fetchLocation } from '@/server/actions';
import { fetchBankTopClient } from '@/services/Home';
import { fetchLocationTopClient } from '@/services/location';
import { COOKIES, FILTER_EMPTY, REACT_QUERY, SAMPLE_CITY, STRING_DATA } from '@/shared/Constants';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { IBanks, ILocations } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'

const TopBanks = (props:{isFooter?:boolean}) => {
  const {isFooter=false} = props
    const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER,FILTER_EMPTY);

    const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
      queryKey: [REACT_QUERY.AUCTION_BANKS, "top"],
      queryFn: async () => {
        const res = (await fetchBankTopClient()) as unknown as IBanks[];
        console.log(res, "footertop")
        return res ?? [];
      },
    });

    const handleFilter = (item: IBanks) => {
      "use client"
      const filter = { bank: item?.bankName };
      console.log(filter)
      // debugger;
      setAuctionFilter?.(filter);
    };

      const renderLink = (item: IBanks) => {
        if (item?.route) {
          return (
            <Link
              className={`${isFooter ? "footer-link-custom-class" : ""}`}
              href={item?.route ?? ""}
              >
              <span
                onClick={()=>handleFilter(item)}
              >

              {item?.bankName}
              </span>
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
            className={`${isFooter ? "footer-link-custom-class" : ""}`}
            href={ROUTE_CONSTANTS.E_BANKS_ALL}
          >
            All
          </Link>
        </>
      );
    }

  return (
    <>
      <div className="custom-common-header-class">{STRING_DATA.TOP_BANKS}</div>
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