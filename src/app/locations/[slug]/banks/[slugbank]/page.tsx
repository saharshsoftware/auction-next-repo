import AuctionCard from "@/components/atoms/AuctionCard";
import PaginationCompServer from "@/components/atoms/PaginationCompServer";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import { getCategoryBoxCollection } from "@/server/actions";
import { getAssetType, getAuctionsServer } from "@/server/actions/auction";
import { fetchBanks, fetchBanksBySlug } from "@/server/actions/banks";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  getPrimaryBankName,
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import React, { lazy } from "react";

const ShowAuctionList = dynamic(
  () => import("@/components/molecules/ShowAuctionList"),
  {
    ssr: false,
    // loading: () => <p className="text-center">Loading auctions...</p>,
  }
);

async function getSlugData(
  slug: string,
  slugbank: string
): Promise<{ location: ILocations; bank: IBanks }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    fetchBanksBySlug({
      slug: slugbank,
    }) as Promise<IBanks[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    bank: selectedCategory?.[0] as IBanks,
  };
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugbank: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugbank } = params;

  try {
    const { location: locationData, bank: bankData } = await getSlugData(
      slug,
      slugbank
    );

    const { name: nameLocation } = locationData;
    const { name, slug: primaryBankSlug, secondarySlug } = bankData;
    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slugbank
    );
    return {
      title: `${primaryName} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${primaryBankSlug}`,
      },

      keywords: [
        `${primaryName} auction properties in ${nameLocation}`,
        `${primaryName} flat bank auctions in ${nameLocation}`,
        `${primaryName} house bank auctions in ${nameLocation}`,
        `${primaryName} vehicle bank auctions in ${nameLocation}`,
        `${primaryName} commercial property bank auctions in ${nameLocation}`,
        `Agricultural land bank auctions in ${nameLocation}`,
        `${primaryName} machinery bank auctions in ${nameLocation}`,
        `${primaryName} plot bank auctions in ${nameLocation}`,
        `${primaryName} residential unit bank auctions in ${nameLocation}`,
        `eAuctionDekho ${primaryName} listings in ${nameLocation}`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${primaryBankSlug}`,
        title: `${primaryName} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${primaryBankSlug}`,
        card: "summary_large_image",
        title: `${primaryName} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
      },
    };
  } catch (error) {
    console.log("Error fetching metadata:", error);
    return {};
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string; slugbank: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugbank } = params;
  const { location: locationData, bank: bankData } = await getSlugData(
    slug,
    slugbank
  );
  // console.log(locationData, "location-slug");
  const { name, type } = locationData;

  const filterQueryData = {
    location: {
      name,
      type,
    },
    bank: {
      name: bankData?.name,
    },
    page: 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  };

  console.log("filterQueryDataLOcationAndBank", filterQueryData, slug);

  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations, response]: any =
    await Promise.all([
      getAssetType(),
      fetchBanks(),
      getCategoryBoxCollection(),
      fetchLocation(),
      getAuctionsServer({
        location: filterQueryData?.location?.name ?? "",
        locationType: filterQueryData?.location?.type ?? "",
        bankName: bankData?.name ?? "",
        page: filterQueryData?.page?.toString() ?? "1",
      }),
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

  const selectionLocation = locationOptions.find(
    (item) => item.name === locationData?.name
  );

  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);

  const urlFilterdata = {
    location: selectionLocation,
    bank: selectedBank,
    page: filterQueryData?.page,
    price: filterQueryData?.price,
  };
  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
        selectedBank={selectedBank}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <div className="flex flex-col gap-4 w-full">
              {auctionList.length === 0 ? (
                <div className="flex items-center justify-center flex-col h-[70vh]">
                  No data found
                </div>
              ) : (
                <>
                  {auctionList.map((item, index) => (
                    <AuctionCard key={index} item={item} />
                  ))}
                  <PaginationCompServer
                    totalPage={response?.meta?.pageCount}
                    activePage={filterQueryData?.page}
                    filterData={urlFilterdata}
                  />
                </>
              )}
            </div>
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
