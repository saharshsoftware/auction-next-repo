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
import { fetchAssetType, fetchCategories, fetchIsInterestedNotice } from "@/server/actions/auction";
import { sanitizeReactSelectOptionsPage } from "@/shared/Utilies";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import AuctionDetailRelatedBubbles from "@/components/templates/AuctionDetailRelatedBubbles";
import AddToWishlist from "@/components/templates/AddToWishlist";
import { cookies } from "next/headers";
import { COOKIES } from "@/shared/Constants";
import { fetchFavoriteList } from "@/server/actions/favouriteList";
import { AuctionDetailPage } from "@/components/templates/AuctionDetail2";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

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

    if (!blogData || !slug) return {
      robots: "noindex, follow",
    };
    // Check if the data is available before destructuring

    const { title, description } = blogData;

    // Get property images for meta tags
    let metaImages: string[] = [];
    if (blogData?.noticeImageURLs && Array.isArray(blogData.noticeImageURLs)) {
      const cloudfrontBase = process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "";
      metaImages = blogData.noticeImageURLs
        .slice(0, 4) // Limit to first 4 images for social media
        .map(path => `${cloudfrontBase}/${path.startsWith('/') ? path.slice(1) : path}`);
    }

    // Fallback to default image if no property images
    const fallbackImage = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
    const socialImages = metaImages.length > 0 ? metaImages : [fallbackImage];

    return {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}`,
        title,
        description,
        images: socialImages.map(url => ({ url })),
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/${slug}`,
        card: "summary_large_image",
        title,
        description,
        images: socialImages.map(url => ({ url })),
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
  const userData = cookieStore.get(COOKIES.AUCTION_USER_KEY)?.value ?
    JSON.parse(cookieStore.get(COOKIES.AUCTION_USER_KEY)?.value ?? "")
    : null;

  const auctionDetail = (await getAuctionDetail({ slug })) as IAuction;
  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations,]: any =
    await Promise.all([
      fetchAssetType(),
      fetchBanks(),
      fetchCategories(),
      fetchLocation(),
    ]);

  let faviouriteList: any[] = [];
  let isInterested = false;
  if (token) {
    const [favoriteResponse, userInterestResponse] = await Promise.all([
      fetchFavoriteList(),
      fetchIsInterestedNotice({
        noticeId: auctionDetail?.id,
        userId: userData?.id,
      }),
    ]);

    // Format favorite list
    faviouriteList = favoriteResponse?.map((item: any) => ({
      value: item.id,
      label: item.name,
    })) || [];

    // Determine if the user is interested
    isInterested = Array.isArray(userInterestResponse?.data) && userInterestResponse.data.length > 0;

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

  const getBreadcrumbItems = () => {
    return [
      {
        name: "Home",
        item: "/",
      },
      {
        name: "Auctions",
        item: ROUTE_CONSTANTS.AUCTION,
      },
      {
        name: auctionDetail?.title || "Auction Details",
        item: `${ROUTE_CONSTANTS.AUCTION_SLASH}/${slug}`, // Current page URL
        isActive: true,
      },
    ];
  };

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
        <div className="lg:px-32 px-2">
          {/* Breadcrumb Navigation */}
          <div className="pt-4">
            <Breadcrumb 
              items={getBreadcrumbItems()}
            />
          </div>
          <div className="grid grid-cols-12 gap-4 pb-4">
            <div className="grid-col-span-9">
              <AuctionDetailPage auctionDetail={auctionDetail} slug={slug} isInterested={isInterested} />
            </div>
            <div className="grid-col-span-3">
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
