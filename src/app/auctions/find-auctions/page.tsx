import React from "react";
import type { Metadata } from "next";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import {
  getDataFromQueryParamsMethod,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import {
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
} from "@/server/actions/auction";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import AuctionCard from "@/components/atoms/AuctionCard";
import RecentData from "@/components/molecules/RecentData";
import { fetchBanks, fetchLocation } from "@/server/actions";
import PaginationCompServer from "@/components/atoms/PaginationCompServer";

export const metadata: Metadata = {
  title: "Search Results | eauctiondekho",
  description:
    "Explore tailored auction listings based on your search criteria. Find the best properties, vehicles, and more across India. Update your search to refine results and discover ideal auction deals on eauctiondekho.",
  keywords: [
    "auction search",
    "properties search",
    "vehicles auction",
    "machinery auction",
    "India auction",
    "eauctiondekho",
  ],
  robots: "noindex, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
  },

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
    title: "Custom Search Results | eauctiondekho",
    description:
      "Find auctions that match your needs with eauctiondekho. From residential properties to commercial equipment, our search helps you locate the best auctions tailored to your preferences.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search-meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
    card: "summary_large_image",
    title: "Explore Search Results on eauctiondekho",
    description:
      "Use eauctiondekho to tailor your auction search across various categories and locations. Refine and browse through listings to capture the best deals available in India.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search-twitter-meta-image.jpg`,
      },
    ],
  },
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // return null;

  const filterQueryData = getDataFromQueryParamsMethod(
    Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q ?? ""
  );
  console.log("filterQueryData", { filterQueryData });
  const rawAssetTypes = (await getAssetType()) as unknown as IAssetType[];
  const rawBankOptions = (await fetchBanks()) as unknown as IBanks[];
  const rawCategoryOptions =
    (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
  const rawLocationOptions = (await fetchLocation()) as unknown as ILocations[];

  const assetsTypeOptions = sanitizeReactSelectOptionsPage(
    rawAssetTypes ?? []
  ) as IAssetType[];
  const categoryOptions = sanitizeReactSelectOptionsPage(
    rawCategoryOptions ?? []
  ) as ICategoryCollection[];
  const bankOptions = sanitizeReactSelectOptionsPage(
    rawBankOptions ?? []
  ) as IBanks[];
  const locationOptions = sanitizeReactSelectOptionsPage(
    rawLocationOptions ?? []
  ) as ILocations[];

  const response = (await getAuctionsServer({
    category: filterQueryData.category?.name ?? "",
    bankName: filterQueryData?.bank?.name ?? "",
    location: filterQueryData?.location?.name ?? "",
    propertyType: filterQueryData?.propertyType?.name ?? "",
    reservePrice: filterQueryData?.price ?? [],
    locationType: filterQueryData?.location?.type ?? "",
    keyword: "",
    page: filterQueryData?.page?.toString() ?? "1",
  })) as {
    sendResponse: IAuction[];
    meta: any;
  };

  const auctionList = response?.sendResponse ?? [];

  // return <FindAuctionServer />;
  const renderer = () => {
    if (auctionList.length === 0) {
      return (
        <div className="flex items-center justify-center flex-col h-[70vh]">
          No data found
        </div>
      );
    }
    return (
      <>
        {auctionList.map((item, index) => (
          <React.Fragment key={index}>
            <AuctionCard item={item} />
          </React.Fragment>
        ))}

        {auctionList.length > 0 && (
          <PaginationCompServer
            totalPage={response?.meta?.pageCount}
            activePage={filterQueryData?.page}
          />
        )}
      </>
    );
  };

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
      />
      <div className={`common-section`}>
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <div className={`flex flex-col gap-4 w-full `}>{renderer()}</div>
          </div>
          <div className="lg:col-span-4 col-span-full">
            <RecentData />
          </div>
        </div>
      </div>
    </section>
  );
}

// 15 minutes = 900 seconds
export const revalidate = 900;
