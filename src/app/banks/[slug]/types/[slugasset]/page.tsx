import { fetchAssetTypeBySlug } from "@/server/actions/assetTypes";
import { fetchBanksBySlug } from "@/server/actions/banks";
import { getPrimaryBankName, handleOgImageUrl } from "@/shared/Utilies";
import { IAssetType, IBanks } from "@/types";
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
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return null;
}
