"use client"
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import useLocalStorage from "@/hooks/useLocationStorage";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import { IBanks } from "@/types";

const BankCollection = (props: { fetchQuery?: string; item: any }) => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (bank: IBanks) => {
    setAuctionFilter({ ...FILTER_EMPTY, bank });
  };
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";
  return (
    <>
      <Link
        className="z-20 text-center"
        href={`/bank/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div className="w-full p-4 border border-gray-400 rounded-lg shadow min-h-28">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative ">
              <ImageTag
                imageUrl={imageUrl}
                alt={"i"}
                customClass="object-contain bg-contain w-28 h-28"
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
