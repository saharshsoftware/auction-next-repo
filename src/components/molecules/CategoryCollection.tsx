/* eslint-disable @next/next/no-img-element */
"use client";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
interface ICategroyCollection {
  item: any;
  fetchQuery?: string;
  key?: string;
}

const CategoryCollection = (props: ICategroyCollection) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item);

  return (
    <>
      <div className="w-full border border-gray-400 rounded-lg shadow p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative w-12 h-12">
            <img
              src={imageUrl}
              alt="i"
              className="object-contain bg-contain "
            />
          </div>
          <div>{item?.totalNotices}</div>
          <Link href={`/category/${item?.slug}`}>{item?.name}</Link>
        </div>
      </div>
    </>
  );
};

export default CategoryCollection;
