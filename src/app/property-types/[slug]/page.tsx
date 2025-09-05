import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopAssets from "@/components/atoms/TopAssets";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
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
import { Suspense } from "react";
import { SEO_BRAND } from "@/shared/seo.constant";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import AuctionResults from "@/components/templates/AuctionResults";
import ImageJsonLd from "@/components/atoms/ImageJsonLd";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Breadcrumb from "@/components/atoms/Breadcrumb";

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
    const logoUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;

    console.log("Generated Image URL:", { logoUrl }); // Debugging

    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/types/${slug}`,
      page: searchParams?.page,
    });

    return {
      title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
      description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: { canonical: canonicalUrl },

      keywords: [
        `${name}s for sale`,
        `bank auction ${name}s`,
        `bank auction properties`,
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: logoUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: `Bank Auction ${name}s in India | Find ${name}s Auctions`,
        description: `Find ${name} in bank auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: logoUrl,
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
  const logoUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
  console.log("filterQueryDataTypes");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
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

  const selectedAsset = assetsTypeOptions.find(
    (item) => item.name === assetTypeData?.name
  );
  const urlFilterdata = {
    propertyType: assetTypeData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const getRequiredParameters = () => {
    return {
      propertyType: assetTypeData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
      { name: "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.TYPES}` },
      { name: assetTypeData?.name ?? "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.PROPERTY_TYPES}/${slug}` },
    ];
  };

    return (
    <section>
      {!!logoUrl && (
        <ImageJsonLd
          images={[{
            url: logoUrl,
            name: `Bank Auction ${assetTypeData?.name} in India`,
            description: `Find ${assetTypeData?.name} in bank auction on eauctiondekho.`,
          }]}
          propertyTitle={`Bank Auction ${assetTypeData?.name} in India`}
          propertyDescription={`Find ${assetTypeData?.name} in bank auction on eauctiondekho.`}
        />
      )}
      <BreadcrumbJsonLd
        items={getBreadcrumbJsonLdItems()}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedAsset={selectedAsset}
      />
      <div className="common-section">
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbJsonLdItems().slice(1)}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`Bank Auction ${assetTypeData?.pluralizeName} in India`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <TopAssets assetsTypeData={popularAssets} />
          </div>
        </div>
      </div>
    </section>
  );
}
