import { getAuctionDetail } from "@/server/actions";
import { Metadata, ResolvingMetadata } from "next";
import { IAuction } from "@/types";
import NotFound from "@/app/not-found";
import AuctionDetail from "@/components/templates/AuctionDetail";

async function getAuctionDetailData(slug: string) {
  const res = await getAuctionDetail({ slug });
  return res;
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
    const blogData = (await getAuctionDetailData(slug)) as IAuction;

    const { title, description } = blogData;

    return {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}`,
        title,
        description,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}/meta-image.jpg`,
          },
        ],
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}`,
        card: "summary_large_image",
        title,
        description,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}/twitter-meta-image.jpg`,
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
  const { slug } = params;
  const auctionDetail = (await getAuctionDetail({ slug })) as IAuction;

  if (auctionDetail) {
    return <AuctionDetail auctionDetail={auctionDetail} />;
  }
  if (auctionDetail == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
