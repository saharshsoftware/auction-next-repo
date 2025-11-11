import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopBanks from "@/components/atoms/TopBanks";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { fetchBanks, getCategoryBoxCollection } from "@/server/actions";
import { fetchAssetTypeBySlug } from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
  getPopularDataBySortOrder,
  getLocationBySlug,
  getAssetTypeBySlug,
} from "@/shared/Utilies";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { Metadata, ResolvingMetadata } from "next";
import { cache, Suspense } from "react";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import AuctionResults from "@/components/templates/AuctionResults";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import ProfilePreferencesToast from "@/components/atoms/ProfilePreferencesToast";

// Add caching functions
const getLocationsCached = cache(async () => {
  return (await fetchLocation()) as ILocations[] | null;
});

const getAssetTypesCached = cache(async () => {
  return (await fetchAssetType()) as IAssetType[] | null;
});

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugasset: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugasset } = params;

  try {
    const [assetTypes, locations] = await Promise.all([
      getAssetTypesCached(),
      getLocationsCached(),
    ]);
    
    const locationData = getLocationBySlug(locations, slug);
    const assetTypeData = getAssetTypeBySlug(assetTypes, slugasset);

    const { name: nameLocation } = locationData as ILocations;
    const { name: nameAssetType } = assetTypeData as IAssetType;

    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    return {
      title: `Bank Auction ${nameAssetType} in ${nameLocation} | Find ${nameAssetType} Auctions`,
      description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.LOCATION}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}`,
      },

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.LOCATION}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}`,
        title: `${nameAssetType} Bank Auctions in ${nameLocation} | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.LOCATION}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}`,
        card: "summary_large_image",
        title: `${nameAssetType} Bank Auctions in ${nameLocation} | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugasset } = params;
  const { page = 1 } = searchParams;

  console.log("filterQueryDataLOcationAndAssetTypes", slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations
  ]: any = await Promise.all([
    getAssetTypesCached(),
    fetchBanks(),
    fetchCategories(),
    getLocationsCached()
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

  const locationData = getLocationBySlug(rawLocations, slug);
  const assetTypeData = getAssetTypeBySlug(rawAssetTypes, slugasset);

  const { name: nameLocation, type } = locationData || {} as ILocations;
  const { name } = assetTypeData || {} as IAssetType;
  const filterQueryData = {
    location: {
      name: nameLocation,
      type,
    },
    nameAsset: name,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  };
  const popularBanks = getPopularDataBySortOrder(rawBanks);

  const selectionLocation = locationOptions.find(
    (item) => item.name === locationData?.name
  );

  const selectedAsset = assetsTypeOptions.find(
    (item) => item.name === assetTypeData?.name
  );

  const urlFilterdata = {
    location: selectionLocation,
    selectedAsset: selectedAsset,
    page: String(page) || "1",
    price: filterQueryData?.price,
  } as ILocalFilter;

  const getRequiredParameters = () => {
    return {
      location: filterQueryData?.location?.name ?? "",
      locationType: filterQueryData?.location?.type ?? "",
      propertyType: filterQueryData?.nameAsset ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `/` },
      { name: "City", item: `${ROUTE_CONSTANTS.CITIES}` },
      { name: nameLocation || "Location", item: `${ROUTE_CONSTANTS.LOCATION}/${slug}` },
      { name: "Property Type", item: `${ROUTE_CONSTANTS.TYPES}` },
      { name: assetTypeData?.name || "Property Type", item: `${ROUTE_CONSTANTS.LOCATION}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}` },
    ];
  }

  return (
    <section>
      <BreadcrumbJsonLd
        items={getBreadcrumbJsonLdItems()}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
        selectedAsset={selectedAsset}
      />
      <div className="common-section">
        <div className="my-4 block lg:hidden">
          <ProfilePreferencesToast />
        </div>
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbJsonLdItems()}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`Bank Auction ${assetTypeData?.pluralizeName} in ${locationData?.name}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <div className="mb-4">
              <ProfilePreferencesToast />
            </div>
            <div className="mb-4">
              <TopBanks
                bankOptions={popularBanks}
                locationSlug={slug}
                isLocationCategoriesRoute={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
