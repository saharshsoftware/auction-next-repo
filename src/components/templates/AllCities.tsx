"use client"
import { fetchLocationClient } from '@/services/location';
import { REACT_QUERY } from '@/shared/Constants';
import { groupByState } from '@/shared/Utilies';
import { ILocations } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
import SkeltopAllCities from '../skeltons/SkeltopAllCities';

const renderLink = (item: ILocations) => {
  return (
      <Link className={`text-blue-600`} href={`/location/${item?.slug}`}>
        {item?.name}
      </Link>
    );
  }

function renderStatesAndCities(resultArray:any) {
  return (
    <div className='flex flex-col gap-8'>
      {/* Map through each state in the result array */}
      {resultArray?.map((stateObj:any) => {
        const {
          name, slug, type, cities
        } = stateObj;
        return (
          <div key={slug} className="state-section flex flex-col gap-2">
            <Link className={`state-name`} href={`/location/${slug}`}>
              {name}
            </Link>
            <div className="grid grid-cols-12 gap-4">
              {cities?.map((cityObj: any) => {
                return (
                  <div
                    key={cityObj?.slug}
                    className="lg:col-span-3 md:col-span-4 col-span-6 "
                  >
                    <p>{renderLink(cityObj)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const AllCities = () => {
    const {
      data: locationOptions,
      fetchStatus
    } = useQuery({
      queryKey: [REACT_QUERY.AUCTION_LOCATION],
      queryFn: async () => {
        const res = (await fetchLocationClient()) as unknown as ILocations[];
        const updatedData = groupByState(res);
        console.log(updatedData, "res");
        return updatedData ?? [];
      },
    });

  if (fetchStatus === 'fetching') {
    return (
    <div className="common-section my-8 min-h-[70vh] flex items-center justify-center">

    <SkeltopAllCities />
    </div>)
  }
  return (
    <div className="common-section my-8">
      {renderStatesAndCities(locationOptions)}
    </div>
  );
}

export default AllCities