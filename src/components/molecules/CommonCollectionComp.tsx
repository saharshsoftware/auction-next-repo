"use client"
import useLocalStorage from '@/hooks/useLocationStorage';
import { COOKIES, FILTER_EMPTY } from '@/shared/Constants';
import { getAuctionFilterRequiredKey, sanitizeStrapiImageUrl } from '@/shared/Utilies';
import Link from 'next/link';
import React from 'react'
import ImageTag from '../ui/ImageTag';

const CommonCollectionComp = (props: any) => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );
  
  const { item = "", fetchQuery } = props;
  const handleLinkClick = (item: any) => {
    const collectionFilterKey = getAuctionFilterRequiredKey(fetchQuery);
    // console.log(collectionFilterKey, "collectionFilterKey");
    setAuctionFilter({
      ...FILTER_EMPTY,
      [collectionFilterKey]: { ...item, label: item?.name, value: item?.id },
    });
  };
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";

  return (
    <>
      <Link
        className="z-20 text-center"
        href={`/${fetchQuery}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div
          className="w-full p-4 min-h-28"
          // onClick={() => handleLinkClick(item)}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {/* border border-gray-400 shadow overflow-hidden */}
            <div className="relative rounded-full w-20 h-20 flex items-center justify-center m-auto ">
              <ImageTag imageUrl={imageUrl} alt={"i"} />
            </div>
            <span className="text-center text-sm">{item?.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CommonCollectionComp