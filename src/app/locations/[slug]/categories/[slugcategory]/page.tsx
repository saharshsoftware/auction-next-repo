import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import { getCategoryBoxCollectionBySlug } from "@/server/actions/auction";
import { fetchLocationBySlug } from "@/server/actions/location";
import { extractKeywords } from "@/shared/Utilies";
import { ICategoryCollection, ILocations } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

async function getSlugData(
  slug: string,
  slugcategory: string
): Promise<{ location: ILocations; category: ICategoryCollection }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    getCategoryBoxCollectionBySlug({
      slug: slugcategory,
    }) as Promise<ICategoryCollection[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    category: selectedCategory?.[0] as ICategoryCollection,
  };
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugcategory: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugcategory } = params;

  try {
    const { location: locationData, category: categoryData } =
      await getSlugData(slug, slugcategory);

    const { name: nameLocation } = locationData;
    const { name: nameCategory } = categoryData;

    let keywordsAll: string[] = [];
    if (nameCategory) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractKeywords(
        allSssetTypeData,
        "bank auction",
        nameCategory
      );
    }
    return {
      title: `${nameCategory} Bank Auction Properties in ${nameLocation} | eAuctionDekho`,
      description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eAuctionDekho. Find diverse asset types including <asset types comma separated list>. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
      },

      keywords: [`${nameCategory} bank auction properties`, ...keywordsAll],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        title: `Explore Auctions in ${nameLocation} | eauctiondekho`,
        description: `Looking for auctions in ${nameLocation}? eauctiondekho offers a detailed list of auctions for properties, vehicles, and more. Start bidding in ${nameLocation} and make successful investments with ease.`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions-meta-image.jpg`,
          },
        ],
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        card: "summary_large_image",
        title: `${nameLocation} Auctions in India | eauctiondekho Listings`,
        description: `Join the dynamic auction market in ${nameLocation} with eauctiondekho. Discover and bid on a variety of high-quality assets in ${nameLocation}, and secure valuable deals today.`,
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
  params: { slug: string; slugcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("(INFO) :: params", params, searchParams);
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
