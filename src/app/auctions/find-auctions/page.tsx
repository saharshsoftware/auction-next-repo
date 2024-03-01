import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Find auction with amazing deals",
};

export default function Page() {
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
