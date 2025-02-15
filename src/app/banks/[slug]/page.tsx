import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchBanksBySlug } from "@/server/actions/banks";
import { IBanks } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

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
    const { name } = bankData;
    return {
      title: `${name} Auction Properties | eAuctionDekho - Residential, Commercial, Vehicle, and Gold`,
      description: `Discover ${name}'s auction properties on eAuctionDekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
      },

      keywords: [
        `${name} auction properties`,
        `${name} flats auctions`,
        `${name} houses for sale`,
        `${name} vehicle auctions`,
        `${name} commercial property auctions`,
        `Agricultural land auctions ${name}`,
        `${name} machinery auctions`,
        `${name} plots for sale`,
        `${name} residential units`,
        `eAuctionDekho ${name} listings`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        title: `${name} Auctions | Explore Bank-Owned Auction Listings - eauctiondekho`,
        description: `Participate in ${name} auctions and gain access to a wide selection of properties, vehicles, and industrial equipment. eauctiondekho provides up-to-date listings to help you make the best investment decisions.`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions-meta-image.jpg`,
          },
        ],
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        card: "summary_large_image",
        title: `${name} Auctions | eauctiondekho Listings`,
        description: `Discover ${name}'s bank-owned properties and more through our detailed and accessible auction listings. Bid now and secure valuable assets at competitive prices with eauctiondekho.`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions-twitter-meta-image.jpg`,
          },
        ],
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
