import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import { getCategoryBoxCollectionBySlug } from "@/server/actions/auction";
import { getAssetTypeClient } from "@/services/auction";
import { extractOnlyKeywords } from "@/shared/Utilies";
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
      keywordsAll = extractOnlyKeywords(allSssetTypeData, name);
    }
    const sanitizeImageUrl =
      (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "") + categoryData?.imageURL;

    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging
    return {
      title: `${name} Bank Auction Properties in India | eAuctionDekho`,
      description: `Find ${name} bank auction properties on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}`,
      },
      keywords: [
        `${name} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}`,
        title: `Explore Top ${name} Auctions Across India | eauctiondekho`,
        description: `Bid on and win ${subCategories} at auctions across India. eauctiondekho offers updated listings to help you find the best auction deals available. Start bidding today!`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}`,
        card: "summary_large_image",
        title: `${name} Auctions in India | eauctiondekho Listings`,
        description: `Looking for your next ${subCategories}? Check out our comprehensive listings of ${name} auctions across India. Find and bid on ${subCategories} with eauctiondekho.`,
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
