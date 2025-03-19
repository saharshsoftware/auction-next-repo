import React, { lazy } from "react";

const ShowAuctionList = lazy(
  () => import("@/components/molecules/ShowAuctionList")
);

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
        <ShowAuctionList />
      </section>
    </>
  );
}
