import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchBanksBySlug } from "@/server/actions/banks";
import { fetchLocationBySlug } from "@/server/actions/location";
import { handleOgImageUrl } from "@/shared/Utilies";
import { IBanks, ILocations } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

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
    const { name: nameBank } = bankData;
    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );

    return {
      title: `${nameBank} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Discover ${nameBank}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${slugbank}`,
      },

      keywords: [
        `${nameBank} auction properties in ${nameLocation}`,
        `${nameBank} flat bank auctions in ${nameLocation}`,
        `${nameBank} house bank auctions in ${nameLocation}`,
        `${nameBank} vehicle bank auctions in ${nameLocation}`,
        `${nameBank} commercial property bank auctions in ${nameLocation}`,
        `Agricultural land bank auctions in ${nameLocation}`,
        `${nameBank} machinery bank auctions in ${nameLocation}`,
        `${nameBank} plot bank auctions in ${nameLocation}`,
        `${nameBank} residential unit bank auctions in ${nameLocation}`,
        `eAuctionDekho ${nameBank} listings in ${nameLocation}`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${slugbank}`,
        title: `${nameBank} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${nameBank}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${slugbank}`,
        card: "summary_large_image",
        title: `${nameBank} Auction Properties in ${nameLocation} | Explore Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${nameBank}'s auction properties in ${nameLocation} on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
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
  console.log("(INFO) :: params", params, searchParams);
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
