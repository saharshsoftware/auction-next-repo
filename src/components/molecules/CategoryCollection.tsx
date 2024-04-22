/* eslint-disable @next/next/no-img-element */
"use client";
import useLocalStorage from "@/hooks/useLocationStorage";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
interface ICategroyCollection {
  item: any;
  fetchQuery?: string;
  key?: string;
  handleLinkClick?:(e:any)=>void;
}

const CategoryCollection = (props: ICategroyCollection) => {
  const { item = "", handleLinkClick=()=>{} } = props;
  const imageUrl = sanitizeStrapiImageUrl(item);

  return (
    <>
      <Link href={`/category/${item?.slug}`} onClick={() => handleLinkClick(item)}>
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
            {item?.name}
          </div>
        </div>
      </Link>
    </>
  );
};

export default CategoryCollection;
