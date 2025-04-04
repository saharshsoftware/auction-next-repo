import { fetchBanks, fetchLocation, getAuctionDetail } from "@/server/actions";
import { Metadata, ResolvingMetadata } from "next";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import AuctionDetail from "@/components/templates/AuctionDetail";
import { fetchAssetType, fetchCategories } from "@/server/actions/auction";
import { sanitizeReactSelectOptionsPage } from "@/shared/Utilies";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import AuctionDetailRelatedBubbles from "@/components/templates/AuctionDetailRelatedBubbles";
import AddToWishlist from "@/components/templates/AddToWishlist";
import { cookies } from "next/headers";
import { COOKIES } from "@/shared/Constants";
import { fetchFavoriteList } from "@/server/actions/favouriteList";

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

    if (!blogData || !slug) return {};
    // Check if the data is available before destructuring

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
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value || null; // Replace with your actual cookie name

  const auctionDetail = (await getAuctionDetail({ slug })) as IAuction;
  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations]: any =
    await Promise.all([
      fetchAssetType(),
      fetchBanks(),
      fetchCategories(),
      fetchLocation(),
    ]);

  let faviouriteList: any[] = [];
  if (token) {
    const res = await fetchFavoriteList();
    faviouriteList =
      res?.map((item: any) => ({
        value: item.id,
        label: item.name,
      })) || [];
  }

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

  const bankData = bankOptions.find(
    (data: any) => data.name === auctionDetail?.bankName
  ) as IBanks;
  const locationData = locationOptions.find(
    (data: any) => data.name === auctionDetail?.city
  ) as ILocations;

  const renderWishlistComponent = () => {
    if (token) {
      return (
        <AddToWishlist
          auctionData={auctionDetail}
          faviouriteList={faviouriteList}
          isAuthenticated={token ? true : false}
        />
      );
    }
  };
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
            <div className="lg:col-span-8 col-span-full ">
              <AuctionDetail auctionDetail={auctionDetail} />
            </div>
            <div className="lg:col-span-4 col-span-full">
              {renderWishlistComponent()}
            </div>
          </div>
          <div className="flex justify-center">
            <AuctionDetailRelatedBubbles
              auctionDetailStoredata={auctionDetail}
              auctionDetailData={auctionDetail}
              bankData={bankData}
              locationData={locationData}
            />
          </div>
        </div>
      </section>
    </>
  );
}
