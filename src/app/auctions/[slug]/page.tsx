import {
  fetchBanks,
  fetchLocation,
  getAuctionDetail,
  getCategoryBoxCollection,
} from "@/server/actions";
import { Metadata, ResolvingMetadata } from "next";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import NotFound from "@/app/not-found";
import AuctionDetail from "@/components/templates/AuctionDetail";
import { getAssetType, getAuctionsServer } from "@/server/actions/auction";
import { sanitizeReactSelectOptionsPage, selectedBank } from "@/shared/Utilies";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";

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
  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations]: any =
    await Promise.all([
      getAssetType(),
      fetchBanks(),
      getCategoryBoxCollection(),
      fetchLocation(),
    ]);

  // Type assertions are no longer necessary if functions return correctly typed data
  const assetsTypeOptions = sanitizeReactSelectOptionsPage(
    rawAssetTypes
  ) as IAssetType[];
  const categoryOptions = sanitizeReactSelectOptionsPage(
    rawCategories
  ) as ICategoryCollection[];
  const bankOptions = sanitizeReactSelectOptionsPage(rawBanks) as IBanks[];
  const locationOptions = sanitizeReactSelectOptionsPage(
    rawLocations
  ) as ILocations[];

  return (
    <>
      <section>
        <FindAuctionServer
          categories={categoryOptions}
          assets={assetsTypeOptions}
          banks={bankOptions}
          locations={locationOptions}
        />
        <div className="common-section">
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="lg:col-span-8 col-span-full">
              <AuctionDetail auctionDetail={auctionDetail} />
            </div>
          </div>
          <div className="lg:col-span-4 col-span-full">
            <RecentData />
          </div>
        </div>
      </section>
    </>
  );
}
