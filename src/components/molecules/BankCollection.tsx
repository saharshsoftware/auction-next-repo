/* eslint-disable @next/next/no-img-element */
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import React from "react";

const BankCollection = (props: { fetchQuery: string; item: any }) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? '';
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative w-12 h-12">
            {imageUrl ? <img
              src={imageUrl}
              alt="category_image"
              // fill={true}
              className="object-contain bg-contain "
            />: null}
          </div>
          <div>{item?.bankName}</div>
      </div>
      </div>
    </>
  );
};

export default BankCollection;
