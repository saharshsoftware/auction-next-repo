import { fetchAssetTypeBySlug } from "@/server/actions/assetTypes";
import { fetchLocationBySlug } from "@/server/actions/location";
import { handleOgImageUrl } from "@/shared/Utilies";
import { IAssetType, ILocations } from "@/types";
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
  slugasset: string
): Promise<{ location: ILocations; assetType: IAssetType }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    fetchAssetTypeBySlug({
      slug: slugasset,
    }) as Promise<IAssetType[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    assetType: selectedCategory?.[0] as IAssetType,
  };
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugasset: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugasset } = params;

  try {
    const { location: locationData, assetType: assetTypeData } =
      await getSlugData(slug, slugasset);

    const { name: nameLocation } = locationData;
    const { name: nameAssetType } = assetTypeData;

    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    return {
      title: `Bank Auction ${nameAssetType} in ${nameLocation} | eAuctionDekho`,
      description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
      },

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
        title: `Bank Auction ${nameAssetType} in ${nameLocation} | eAuctionDekho`,
        description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
        card: "summary_large_image",
        title: `Bank Auction ${nameAssetType} in ${nameLocation} | eAuctionDekho`,
        description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  console.log("(INFO) :: params", params, searchParams);
  return (
    <>
      <ShowAuctionList />
    </>
  );
}

// 15 minutes = 900 seconds
export const revalidate = 900;
