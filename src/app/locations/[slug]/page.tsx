import { fetchLocationBySlug } from "@/server/actions/location";
import { handleOgImageUrl } from "@/shared/Utilies";
import { ILocations } from "@/types";
import { Metadata, ResolvingMetadata } from "next";

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

    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );

    return {
      title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Explore bank auction properties in ${name} on eAuctionDekho. Find diverse asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/lcoations/${slug}`,
      },

      keywords: [
        `Bank auction property in ${name}`,
        `flat bank auctions in ${name}`,
        `house auctions in ${name}`,
        `vehicle auctions in ${name}`,
        `commercial property auctions in ${name}`,
        `agricultural land auctions in ${name}`,
        `machinery auctions in ${name}`,
        `plot auctions in ${name}`,
        `residential unit auctions in ${name}`,
        `eAuctionDekho ${name} listings`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/lcoations/${slug}`,
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Looking for auctions in ${name}? eauctiondekho offers a detailed list of auctions for properties, vehicles, and more. Start bidding in ${name} and make successful investments with ease.`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}`,
        card: "summary_large_image",
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Join the dynamic auction market in ${name} with eauctiondekho. Discover and bid on a variety of high-quality assets in ${name}, and secure valuable deals today.`,
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
