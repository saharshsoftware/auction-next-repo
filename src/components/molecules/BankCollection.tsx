/* eslint-disable @next/next/no-img-element */
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";

const BankCollection = (props: { fetchQuery: string; item: any }) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";
  return (
    <>
      <Link className="z-20 text-center" href={`/bank/${item?.slug}`}>
        <div className="w-full p-4 border border-gray-400 rounded-lg shadow min-h-24">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative ">
              <img
                src={imageUrl}
                alt="i"
                className="object-contain bg-contain w-28 h-28"
              />
            </div>
            {item?.name}
          </div>
        </div>
      </Link>
    </>
  );
};

export default BankCollection;
