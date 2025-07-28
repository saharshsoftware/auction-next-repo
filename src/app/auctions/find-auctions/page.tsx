import React from "react";
import type { Metadata } from "next";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import {
  getDataFromQueryParamsMethod,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
} from "@/server/actions/auction";
import { fetchBanks, fetchLocation } from "@/server/actions";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import RecentData from "@/components/molecules/RecentData";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import { IPaginationData } from "@/zustandStore/auctionStore";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import AuctionHeaderSaveSearch from "@/components/atoms/AuctionHeaderSaveSearch";
import TopCities from "@/components/atoms/TopCities";
import { fetchPopularLocations } from "@/server/actions/location";

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
  // Extract and sanitize search query
  const filterQueryData = getDataFromQueryParamsMethod(
    Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q ?? ""
  );

  console.log("filterQueryData", filterQueryData);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    response,
    popularLocations,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      category: filterQueryData?.category?.name ?? "",
      bankName: filterQueryData?.bank?.name ?? "",
      location: filterQueryData?.location?.name ?? "",
      propertyType: filterQueryData?.propertyType?.name ?? "",
      reservePrice: filterQueryData?.price ?? [],
      locationType: filterQueryData?.location?.type ?? "",
      page: filterQueryData?.page?.toString() ?? "1",
      serviceProvider: filterQueryData?.serviceProvider ?? "",
    }),
    fetchPopularLocations(),
  ]);

  // Type assertions are no longer necessary if functions return correctly typed data
  const assetsTypeOptions = sanitizeReactSelectOptionsPage(
    rawAssetTypes
  ) as IAssetType[];
  const categoryOptions = sanitizeReactSelectOptionsPage(
    rawCategories
  ) as ICategoryCollection[];
  const bankOptions = sanitizeReactSelectOptionsPage(rawBanks) as IBanks[];
  const locationOptions = sanitizeReactSelectOptionsPage(
    rawLocations
  ) as ILocations[];

  const auctionList =
    (response as { sendResponse: IAuction[]; meta: IPaginationData })
      ?.sendResponse ?? [];

  const selectedBank = bankOptions.find(
    (item) => item.name === filterQueryData?.bank?.name
  );
  const selectedLocation = locationOptions.find(
    (item) => item.name === filterQueryData?.location?.name
  );
  const selectedCategory = categoryOptions.find(
    (item) => item.name === filterQueryData?.category?.name
  );
  const selectedAssetType = assetsTypeOptions.find(
    (item) => item.name === filterQueryData?.propertyType?.name
  );

  console.log("selectedLocationselectedLocation", selectedLocation);
  const urlFilterdata = {
    location: selectedLocation,
    bank: selectedBank,
    page: filterQueryData?.page,
    price: filterQueryData?.price,
    category: selectedCategory,
    propertyType: selectedAssetType,
  } as ILocalFilter;

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedBank={selectedBank}
        selectedLocation={selectedLocation}
        selectedCategory={selectedCategory}
        selectedAsset={selectedAssetType}
        selectedPrice={filterQueryData?.price}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderSaveSearch />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={
                filterQueryData?.page ? Number(filterQueryData?.page) : 1
              }
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
            <TopCities locationOptions={popularLocations} />
          </div>
        </div>
      </div>
    </section>
  );
}
