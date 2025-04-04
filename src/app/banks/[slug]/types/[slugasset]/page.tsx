import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import TopAssets from "@/components/atoms/TopAssets";
import TopCities from "@/components/atoms/TopCities";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { getCategoryBoxCollection, fetchLocation } from "@/server/actions";
import {
  fetchAssetTypeBySlug,
  fetchPopularAssetTypes,
} from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import { fetchBanks, fetchBanksBySlug } from "@/server/actions/banks";
import { fetchPopularLocations } from "@/server/actions/location";
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

async function getSlugData(
  slug: string,
  slugasset: string
): Promise<{ assetType: IAssetType; bank: IBanks }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    fetchBanksBySlug({
      slug,
    }) as Promise<IBanks[]>,
    fetchAssetTypeBySlug({
      slug: slugasset,
    }) as Promise<IAssetType[]>,
  ]);
  return {
    assetType: selectedLocation?.[0] as IAssetType,
    bank: selectedCategory?.[0] as IBanks,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const { slug, slugasset } = params;

  try {
    const { assetType: assetTypeData, bank: bankData } = await getSlugData(
      slug,
      slugasset
    );

    const { name: nameAssetType } = assetTypeData;
    const { name, slug: primaryBankSlug, secondarySlug } = bankData;
    const sanitizeImageUrl = await handleOgImageUrl(bankData?.imageURL ?? "");
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slug ?? ""
    );
    return {
      title: `${primaryName} ${nameAssetType}s auctions | Find ${nameAssetType} Auctions`,
      description: `Find ${nameAssetType} auctions for ${primaryName} bank. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/types/${slugasset}`,
      },

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/types/${slugasset}`,
        title: `${primaryName} ${nameAssetType}s auctions | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} auctions for ${primaryName} bank. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/types/${slugasset}`,
        card: "summary_large_image",
        title: `${primaryName} ${nameAssetType}s auctions | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} auctions for ${primaryName} bank. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugasset } = params;
  const { page = 1 } = searchParams;
  const { assetType: assetTypeData, bank: bankData } = await getSlugData(
    slug,
    slugasset
  );
  console.log("filterQueryDataBank&Types");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    response,
    popularLocations,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      bankName: bankData?.name ?? "",
      propertyType: assetTypeData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }),
    fetchPopularLocations(),
    fetchPopularAssetTypes(),
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

  const selectedAsset = assetsTypeOptions.find(
    (item) => item.name === assetTypeData?.name
  );
  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);
  const urlFilterdata = {
    bank: bankData,
    propertyType: assetTypeData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const bankNamePrimary =
    bankData?.secondarySlug === slug
      ? bankData?.secondarySlug?.toUpperCase() ?? (bankData?.name || "")
      : bankData?.name || "";

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedAsset={selectedAsset}
        selectedBank={selectedBank}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`${bankNamePrimary} ${assetTypeData?.name} auctions`}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
            <div className="mb-4">
              <TopCities
                locationOptions={popularLocations}
                isBankRoute={true}
                bankSlug={slug}
              />
            </div>
            <div>
              <TopAssets
                assetsTypeData={popularAssets}
                isBankTypesRoute={true}
                bankSlug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
