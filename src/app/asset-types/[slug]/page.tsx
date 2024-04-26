import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import React from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
