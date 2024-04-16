/* eslint-disable @next/next/no-img-element */
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";

const BankCollection = (props: { fetchQuery: string; item: any }) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? '';
  return (
    <>
      <div className="w-full border border-gray-400 rounded-lg shadow p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative w-12 h-12">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="i"
                className="object-contain bg-contain "
              />
            ) : null}
          </div>
          {item?.route ? (
            <Link href={item?.route}>{item?.bankName}</Link>
          ) : (
            <div>{item?.bankName}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default BankCollection;
