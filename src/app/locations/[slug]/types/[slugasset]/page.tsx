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
import { fetchPopularBanks } from "@/server/actions/banks";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
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
import { Suspense } from "react";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import AuctionResults from "@/components/templates/AuctionResults";

async function getSlugData(
  slug: string,
  slugasset: string
): Promise<{ location: ILocations; assetType: IAssetType }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    fetchAssetTypeBySlug({
      slug: slugasset,
    }) as Promise<IAssetType[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    assetType: selectedCategory?.[0] as IAssetType,
  };
}

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
    const { location: locationData, assetType: assetTypeData } =
      await getSlugData(slug, slugasset);

    const { name: nameLocation } = locationData;
    const { name: nameAssetType } = assetTypeData;

    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    return {
      title: `Bank Auction ${nameAssetType} in ${nameLocation} | Find ${nameAssetType} Auctions`,
      description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
      },

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
        title: `${nameAssetType} Bank Auctions in ${nameLocation} | Find ${nameAssetType} Auctions`,
        description: `Find ${nameAssetType} in ${nameLocation} for auction. Also find flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}`,
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

  const { location: locationData, assetType: assetTypeData } =
    await getSlugData(slug, slugasset);

  const { name: nameLocation, type } = locationData;
  const { name } = assetTypeData;
  const filterQueryData = {
    location: {
      name: nameLocation,
      type,
    },
    nameAsset: name,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  };

  console.log("filterQueryDataLOcationAndAssetTypes", filterQueryData, slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    popularBanks,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    fetchPopularBanks(),
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

  return (
    <section>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
          { name: "Locations", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations` },
          { name: nameLocation || "Location", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}` },
          { name: name || "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/types/${slugasset}` },
        ]}
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
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`Bank Auction ${assetTypeData?.pluralizeName} in ${locationData.name}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <TopBanks
              bankOptions={popularBanks}
              locationSlug={slug}
              isLocationCategoriesRoute={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
