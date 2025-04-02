import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopAssets from "@/components/atoms/TopAssets";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import {
  fetchBanks,
  getCategoryBoxCollection,
  fetchLocation,
} from "@/server/actions";
import {
  fetchAssetTypeBySlug,
  fetchPopularAssetTypes,
} from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import { RANGE_PRICE } from "@/shared/Constants";
import { sanitizeReactSelectOptionsPage } from "@/shared/Utilies";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { Metadata, ResolvingMetadata } from "next";

async function getSlugData(slug: string) {
  const selectedAsset = (await fetchAssetTypeBySlug({
    slug,
  })) as unknown as IAssetType[];
  return selectedAsset?.[0];
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
    const assetTypeData = await getSlugData(slug);
    console.log(assetTypeData, "asset-type-slug");
    const { name } = assetTypeData;
    // Ensure the image URL is absolute and has a fallback
    const sanitizeImageUrl =
      (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "") +
      (assetTypeData?.imageURL || "default-image.jpg");

    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging

    return {
      title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
      description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
      },
      keywords: [
        `${name}s for sale`,
        `bank auction ${name}s`,
        `bank auction properties`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
        title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types/${slug}`,
        card: "summary_large_image",
        title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  const { slug } = params;
  const { page = 1 } = searchParams;
  const assetTypeData = await getSlugData(slug);
  console.log("filterQueryDataTypes");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    response,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      propertyType: assetTypeData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }),
    fetchPopularAssetTypes(),
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

  const auctionList =
    (response as { sendResponse: IAuction[]; meta: IPaginationData })
      ?.sendResponse ?? [];

  const selectedAsset = assetsTypeOptions.find(
    (item) => item.name === assetTypeData?.name
  );
  const urlFilterdata = {
    propertyType: assetTypeData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedAsset={selectedAsset}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`Bank Auction ${assetTypeData?.pluralizeName} in India`}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
            <TopAssets assetsTypeData={popularAssets} />
          </div>
        </div>
      </div>
    </section>
  );
}
