import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import { getCategoryBoxCollectionBySlug } from "@/server/actions/auction";
import { getAssetTypeClient } from "@/services/auction";
import { extractKeywords } from "@/shared/Utilies";
import { ICategoryCollection } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

async function getSlugData(slug: string) {
  const selectedCategory = (await getCategoryBoxCollectionBySlug({
    slug,
  })) as unknown as ICategoryCollection[];
  return selectedCategory?.[0];
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
    const categoryData = await getSlugData(slug);
    const { name, subCategories } = categoryData;
    let keywordsAll: string[] = [];
    if (name) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractKeywords(allSssetTypeData, "bank auction", name);
    }
    return {
      title: `${name} Bank Auction Properties in India | eAuctionDekho`,
      description: `Find ${name} bank auction properties on eAuctionDekho. Find diverse asset types including <asset types comma separated list>. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
      },
      keywords: [`${name} bank auction properties`, ...keywordsAll],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        title: `Explore Top ${name} Auctions Across India | eauctiondekho`,
        description: `Bid on and win ${subCategories} at auctions across India. eauctiondekho offers updated listings to help you find the best auction deals available. Start bidding today!`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions-meta-image.jpg`,
          },
        ],
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        card: "summary_large_image",
        title: `${name} Auctions in India | eauctiondekho Listings`,
        description: `Looking for your next ${subCategories}? Check out our comprehensive listings of ${name} auctions across India. Find and bid on ${subCategories} with eauctiondekho.`,
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
