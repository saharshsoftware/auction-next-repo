import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { fetchLocationBySlug } from "@/server/actions/location";
import { ILocations } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

async function getSlugData(slug: string) {
  const selectedLocation = (await fetchLocationBySlug({
    slug,
  })) as unknown as ILocations[];
  return selectedLocation?.[0];
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
    const locationData = await getSlugData(slug);
    // console.log(locationData, "location-slug");
    const { name } = locationData;
    return {
      title: `Auctions in ${name} | Find Local Deals - eauctiondekho`,
      description: `Discover auctions in ${name} with eauctiondekho. Browse comprehensive listings of properties, vehicles, and machinery available for auction in ${name}. Secure the best deals in your local area or state today.`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
      },

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/${slug}-auctions`,
        title: `Explore Auctions in ${name} | eauctiondekho`,
        description: `Looking for auctions in ${name}? eauctiondekho offers a detailed list of auctions for properties, vehicles, and more. Start bidding in ${name} and make successful investments with ease.`,
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
        description: `Join the dynamic auction market in ${name} with eauctiondekho. Discover and bid on a variety of high-quality assets in ${name}, and secure valuable deals today.`,
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
