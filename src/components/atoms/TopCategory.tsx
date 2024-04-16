"use client"
import { fetchLocation } from '@/server/actions';
import { fetchCategoriesTopClient } from '@/services/Home';
import { fetchLocationTopClient } from '@/services/location';
import { REACT_QUERY, SAMPLE_CITY, STRING_DATA } from '@/shared/Constants';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { ILocations } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'

const TopCategory = (props:{isFooter?:boolean}) => {
  const {isFooter=false} = props
    const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
      queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON, "top"],
      queryFn: async () => {
        const res =
          (await fetchCategoriesTopClient()) as unknown as ILocations[];
        console.log(res, "footertop")
        return res ?? [];
      },
    });

      const renderLink = (item: ILocations) => {
        if (item?.route) {
          return (
            <Link
              className={`${isFooter ? "footer-link-custom-class" : ""}`}
              href={item?.route ?? ""}
            >
              {item?.name}
            </Link>
          );
        }
        return item?.name;
      };

    if (isFooter) {
      return (
        <>
          <div className="top-heading-class">{'Categories'}</div>
          {[...(locationOptions ?? [])].map((item, index) => {
            return (
              <div className="" key={index}>
                {renderLink(item)}
              </div>
            );
          })}
          <Link
            className={`${isFooter ? "footer-link-custom-class" : ""}`}
            href={ROUTE_CONSTANTS.E_CATOGRIES_ALL}
          >
            All
          </Link>
        </>
      );
    }

  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.TOP_CATEGORIES}
      </div>
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

export default TopCategory