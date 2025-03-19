import dynamic from "next/dynamic";
import React, { lazy } from "react";

const ShowAuctionList = dynamic(
  () => import("@/components/molecules/ShowAuctionList"),
  {
    ssr: false,
    // loading: () => <p className="text-center">Loading auctions...</p>,
  }
);

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("(INFO) :: params", params, searchParams);
  return (
    <>
      <ShowAuctionList />
    </>
  );
}

// 15 minutes = 900 seconds
export const revalidate = 900;
