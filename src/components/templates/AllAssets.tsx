"use client";
import { FILTER_EMPTY } from "@/shared/Constants";
import { IAssetType } from "@/types";
import React from "react";
import Link from "next/link";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import ImageTag from "../ui/ImageTag";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useFilterStore } from "@/zustandStore/filters";

const AllAssets = (props: { data: IAssetType[] }) => {
  const { data: assetsType } = props;
  const { setFilter } = useFilterStore();

  const handleLinkClick = (propertyType: IAssetType) => {
    setFilter({
      ...FILTER_EMPTY,
      propertyType: {
        ...propertyType,
        label: propertyType?.name,
        value: propertyType?.id,
      } as any,
    });
  };

  return (
    <div className="common-section my-8">
      <div className="grid grid-cols-12 gap-4">
        {assetsType?.map((item: IAssetType) => {
          const imageUrl = sanitizeStrapiImageUrl(item);
          return (
            <div
              key={item?.slug}
              className="lg:col-span-3 md:col-span-4 col-span-full"
            >
              <Link
                href={`${ROUTE_CONSTANTS.TYPES}/${item?.slug}`}
                onClick={() => handleLinkClick(item)}
                prefetch={false}
              >
                <div className="w-full border border-gray-400 rounded-lg shadow p-4">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* <div className="relative w-12 h-12">
                      <ImageTag
                        imageUrl={imageUrl}
                        alt={"i"}
                        customClass="object-contain bg-contain "
                      />
                    </div> */}
                    <div>{item?.totalNotices}</div>
                    {item?.name}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllAssets;
