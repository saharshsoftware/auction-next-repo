// import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import AuctionCard from "@/components/atoms/AuctionCard";
import PaginationCompServer from "@/components/atoms/PaginationCompServer";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import { getCategoryBoxCollection, fetchLocation } from "@/server/actions";
import { getAssetType, getAuctionsServer } from "@/server/actions/auction";
import { fetchBanks, fetchBanksBySlug } from "@/server/actions/banks";
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
async function getSlugData(slug: string) {
  const selectedBank = (await fetchBanksBySlug({
    slug,
  })) as unknown as IBanks[];
  return selectedBank?.[0];
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  try {
    const bankData = await getSlugData(slug);
    // console.log(bankData, "bank-slug");
    const { name, slug: primaryBankSlug, secondarySlug } = bankData;
    const sanitizeImageUrl = await handleOgImageUrl(bankData?.imageURL ?? "");
    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slug ?? ""
    );
    return {
      title: `${primaryName} Auction Properties | eAuctionDekho - Residential, Commercial, Vehicle, and Gold`,
      description: `Discover ${primaryName}'s auction properties on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}`,
      },

      keywords: [
        `${primaryName} auction properties`,
        `${primaryName} flats auctions`,
        `${primaryName} houses for sale`,
        `${primaryName} vehicle auctions`,
        `${primaryName} commercial property auctions`,
        `Agricultural land auctions ${primaryName}`,
        `${primaryName} machinery auctions`,
        `${primaryName} plots for sale`,
        `${primaryName} residential units`,
        `eAuctionDekho ${primaryName} listings`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}`,
        title: `${primaryName} Auction Properties | eAuctionDekho - Residential, Commercial, Vehicle, and Gold`,
        description: `Discover ${primaryName}'s auction properties on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}`,
        card: "summary_large_image",
        title: `${primaryName} Auction Properties | eAuctionDekho - Residential, Commercial, Vehicle, and Gold`,
        description: `Discover ${primaryName}'s auction properties on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
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
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const bankData = await getSlugData(slug);

  const filterQueryData = {
    bank: {
      name: bankData?.name,
    },
    page: 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  };

  console.log("filterQueryDataBank", filterQueryData, slug);

  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations, response]: any =
    await Promise.all([
      getAssetType(),
      fetchBanks(),
      getCategoryBoxCollection(),
      fetchLocation(),
      getAuctionsServer({
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

  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);
  const urlFilterdata = {
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
