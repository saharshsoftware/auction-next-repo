/* eslint-disable @next/next/no-img-element */
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";

const BankCollection = (props: { fetchQuery: string; item: any }) => {
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? '';
  return (
    <>
      <div className="w-full p-4 border border-gray-400 rounded-lg shadow min-h-20">
        <div className="text-sm text-center">{item?.name}</div>
      </div>
    </>
  );
};

export default BankCollection;
