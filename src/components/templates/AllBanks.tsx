/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { fetchBanksClient } from '@/services/bank';
import { COOKIES, FILTER_EMPTY, REACT_QUERY } from '@/shared/Constants';
import { groupAndSortBanks, groupByState } from '@/shared/Utilies';
import { IBanks, ILocations } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
import SkeltopAllBanks from '../skeltons/SkeltopAllBanks';
import useLocalStorage from '@/hooks/useLocationStorage';

const AllBanks = () => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (bank: IBanks) => {
    setAuctionFilter({ ...FILTER_EMPTY, bank });
  };
    const {
      data: bankData,
      fetchStatus
    } = useQuery({
      queryKey: [REACT_QUERY.AUCTION_BANKS],
      queryFn: async () => {
        const res = (await fetchBanksClient()) as unknown as IBanks[];
        const updatedData = groupAndSortBanks(res);
        console.log(updatedData, "res");
        return updatedData ?? [];
      },
    });

  if (fetchStatus === 'fetching') {
    return (
      <div className='common-section my-8'>
        <SkeltopAllBanks />
      </div>
    )
  }
  return (
    <div className="common-section my-8">
      <div className="flex flex-col gap-8">
        {bankData?.map(([letter, banks])=> (
          <div
            key={letter}
            className="rounded shadow p-2 flex flex-col border border-blue-400 gap-4"
          >
            <h2 className="font-semibold text-2xl">{letter}</h2>
            <ul className="grid grid-cols-12 gap-4">
              {banks.map((bank: IBanks) => {
                return (
                  <li
                    key={bank?.slug}
                    className="lg:col-span-3 md:col-span-4 col-span-6"
                  >
                    <p>
                      <Link
                        className={`text-blue-600`}
                        href={`/bank/${bank?.slug}`}
                        onClick={() => handleLinkClick(bank)}
                      >
                        {bank?.name}
                      </Link>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBanks;