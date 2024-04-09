/* eslint-disable @next/next/no-img-element */
"use client";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Image from "next/image";
import React from "react";
interface ICategroyCollection {
  item: any;
  fetchQuery: string;
  key: string;
}

const CategoryCollection = (props: ICategroyCollection) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item);
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative w-12 h-12">
            <img
              src={imageUrl}
              alt="category_image"
              // fill={true}
              className="object-contain bg-contain "
            />
          </div>
          <div>{item?.totalNotices}</div>
          <div>{item?.name}</div>
        </div>
      </div>
    </>
  );
};

export default CategoryCollection;
