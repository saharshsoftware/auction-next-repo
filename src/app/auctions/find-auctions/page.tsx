import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { Metadata } from "next";
import React, { Suspense } from "react";

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
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
      <ShowAuctionList />
      </Suspense>
      </section>
    </>
  );
}
