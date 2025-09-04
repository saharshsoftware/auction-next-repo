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
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
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
import React, { lazy, Suspense } from "react";
import { SEO_BRAND } from "@/shared/seo.constant";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import AuctionResults from "@/components/templates/AuctionResults";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

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
  searchParams,
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
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/banks/${primaryBankSlug}/types/${slugasset}`,
      page: searchParams?.page,
    });

    return {
      title: `${primaryName} ${nameAssetType}s auctions | Find ${nameAssetType} Auctions`,
      description: `Find ${nameAssetType} auctions for ${primaryName} bank. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: canonicalUrl,
      },

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${primaryName} ${nameAssetType}s auctions | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} auctions for ${primaryName} bank. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
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
    popularLocations,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
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

  const getRequiredParameters = () => {
    return {
      bankName: bankData?.name ?? "",
      propertyType: assetTypeData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const key = page?.toString();

  const getBreadcrumbItems = () => {
    return [
      {
        label: "Bank",
        href: ROUTE_CONSTANTS.BANKS,
      },
      {
        label: bankData?.name || "Bank",
        href: `${ROUTE_CONSTANTS.BANKS}/${slug}`,
      },
      {
        label: "Asset",
        href: `${ROUTE_CONSTANTS.ASSETS}`,
      },
      {
        label: assetTypeData?.name || "Type",
        href: `${ROUTE_CONSTANTS.BANKS}/${slug}/types/${slugasset}`,
      },
    ];
  };

  return (
    <section>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
          { name: "Banks", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks` },
          { name: bankNamePrimary || "Bank", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${slug}` },
          { name: assetTypeData?.name || "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${slug}/types/${slugasset}` },
        ]}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedAsset={selectedAsset}
        selectedBank={selectedBank}
      />
      <div className="common-section">
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbItems()}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="grid-col-span-9 ">
            <Suspense key={key} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`${bankNamePrimary} ${assetTypeData?.name} auctions`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
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
