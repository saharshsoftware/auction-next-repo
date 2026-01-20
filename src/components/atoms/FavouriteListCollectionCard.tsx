"use client";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import { FILTER_EMPTY } from "@/shared/Constants";
import { IFavouriteList } from "@/types";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useFilterStore } from "@/zustandStore/filters";

interface IFavouriteListCollectionCardProps {
  item: IFavouriteList;
}

const FavouriteListCollectionCard = ({ item }: IFavouriteListCollectionCardProps) => {
  const { setFilter: setAuctionFilter } = useFilterStore();

  const handleLinkClick = (category: IFavouriteList) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      category: {
        ...category,
        label: category?.name,
        value: category?.id,
      },
    });
  };

  const imageUrl = sanitizeStrapiImageUrl({ imageURL: item?.imageUrl }) ?? "";

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md active:shadow-lg transition-shadow duration-200 bg-white border border-gray-200">
      {/* Image Section */}
      <div className="relative w-full aspect-[5/3] overflow-hidden bg-gray-100 flex-shrink-0">
        <ImageTag
          imageUrl={imageUrl}
          alt={item?.name}
          customClass="w-full h-full object-cover"
          entityName={item?.name}
          entityType="collection"
        />
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-5 h-[140px] sm:h-[150px] md:h-[160px] justify-between">
      <div className="flex-1 flex flex-col">
  <h3 className="...">{item?.name}</h3>
  <div className="flex-1 flex flex-col justify-start min-h-[2.5rem] sm:min-h-[3rem]">
    {item?.description ? (
      <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 leading-relaxed">
        {item.description}
      </p>
    ) : (
      <div className="h-[2.5rem] sm:h-[3rem]"></div>
    )}
  </div>
</div>
        
        {/* Explore Link */}
        <div className="pt-2 sm:pt-3 border-t border-gray-100">
          <Link
            href={`${ROUTE_CONSTANTS.COLLECTION_PUBLIC}/${item?.slug}`}
            prefetch={false}
            onClick={() => handleLinkClick(item)}
            className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium text-brand-color hover:text-blue-700 transition-colors duration-200 group"
          >
            <span>Explore</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavouriteListCollectionCard;

