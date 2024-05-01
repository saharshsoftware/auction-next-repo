"use client"
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
import useLocalStorage from "@/hooks/useLocationStorage";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import { IBanks } from "@/types";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const BankCollection = (props: { fetchQuery?: string; item: any }) => {
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (bank: IBanks) => {
    setAuctionFilter({ ...FILTER_EMPTY, bank: {...bank, label: bank?.name, value: bank?.id} });
  };
  const { item = "" } = props;
  const imageUrl = sanitizeStrapiImageUrl(item) ?? "";
  return (
    <>
      <Link
        className="z-20 text-center"
        href={`${ROUTE_CONSTANTS.BANKS}/${item?.slug}`}
        onClick={() => handleLinkClick(item)}
      >
        <div className="w-full p-4 min-h-28">
          <div className="flex flex-col items-center justify-center gap-2">
            {/* border border-gray-400 shadow overflow-hidden */}
            <div className="relative rounded-full w-20 h-20 flex items-center justify-center m-auto ">
              <ImageTag imageUrl={imageUrl} alt={"i"} />
            </div>
            <span className="text-center">{item?.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BankCollection;
