import { fetchAssetTypeBySlug } from "@/server/actions/assetTypes";
import { IAssetType } from "@/types";
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
  const selectedBank = (await fetchAssetTypeBySlug({
    slug,
  })) as unknown as IAssetType[];
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
    const assetTypeData = await getSlugData(slug);
    console.log(assetTypeData, "asset-type-slug");
    const { name } = assetTypeData;
    // Ensure the image URL is absolute and has a fallback
    const sanitizeImageUrl =
      (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "") +
      (assetTypeData?.imageURL || "default-image.jpg");

    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging

    return {
      title: `Bank Auction ${name} in India | eAuctionDekho`,
      description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
      },

      keywords: [
        `<Asset Type> for sale`,
        `bank auction ${name}`,
        `bank auction properties`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
        title: `Bank Auction ${name} in India | eAuctionDekho`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
        card: "summary_large_image",
        title: `Bank Auction ${name} in India | eAuctionDekho`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  return (
    <>
      <ShowAuctionList />
    </>
  );
}

// 15 minutes = 900 seconds
export const revalidate = 900;
