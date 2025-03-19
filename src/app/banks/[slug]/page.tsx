import { fetchBanksBySlug } from "@/server/actions/banks";
import { getPrimaryBankName, handleOgImageUrl } from "@/shared/Utilies";
import { IBanks } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import React, { lazy } from "react";

const ShowAuctionList = dynamic(
  () => import("@/components/molecules/ShowAuctionList"),
  {
    ssr: false,
    loading: () => <p className="text-center">Loading auctions...</p>,
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
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
