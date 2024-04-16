import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Find auction with amazing deals",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <ShowAuctionList isBankRoute={true} />
    </>
  );
}
