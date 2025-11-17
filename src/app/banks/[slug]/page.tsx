// import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import TopCities from "@/components/atoms/TopCities";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import AuctionResults from "@/components/templates/AuctionResults";
import { getCategoryBoxCollection, fetchLocation } from "@/server/actions";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import { fetchBanks, fetchBanksBySlug } from "@/server/actions/banks";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  getPrimaryBankName,
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
  buildCanonicalUrl,
  getPopularDataBySortOrder,
  getBankBySlug,
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
import ImageJsonLd from "@/components/atoms/ImageJsonLd";
import { SEO_BRAND } from "@/shared/seo.constant";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import ProfilePreferencesToast from "@/components/atoms/ProfilePreferencesToast";

// Add caching functions
const getBanksCached = cache(async () => {
  return (await fetchBanks()) as IBanks[] | null;
});

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
    const banks = await getBanksCached();
    const bankData = getBankBySlug(banks, slug);
    // console.log(bankData, "bank-slug");
    const { name, slug: primaryBankSlug, secondarySlug } = bankData || {} as IBanks;
    const sanitizeImageUrl = await handleOgImageUrl(bankData?.imageURL ?? "");
    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slug ?? ""
    );
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/banks/${primaryBankSlug}`,
      page: searchParams?.page,
    });

    return {
      title: `${primaryName} Auction Properties | Find - Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Discover ${primaryName}'s auction properties on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: canonicalUrl,
      },

      keywords: [
        `${primaryName} auction properties`,
        `${primaryName} flats auctions`,
        `${primaryName} houses for sale`,
        `${primaryName} vehicle auctions`,
        `${primaryName} commercial property auctions`,
        `Agricultural land auctions ${primaryName}`,
        `${primaryName} machinery auctions`,
        `${primaryName} plots for sale`,
        `${primaryName} residential units`,
        `eauctiondekho ${primaryName} listings`,
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${primaryName} Auction Properties | Find - Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: `${primaryName} Auction Properties | Find - Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
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

  console.log("filterQueryDataBank", slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations
  ]: any = await Promise.all([
    fetchAssetType(),
    getBanksCached(),
    fetchCategories(),
    fetchLocation()
  ]);

  const bankData = getBankBySlug(rawBanks, slug);

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

  const popularLocations = getPopularDataBySortOrder(rawLocations);

  const getRequiredParameters = () => {
    return {
      bankName: bankData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);
  const urlFilterdata = {
    bank: selectedBank,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const bankImageUrl = await handleOgImageUrl(bankData?.imageURL ?? "");

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `/` },
      { name: "Bank", item: `${ROUTE_CONSTANTS.BANKS}` },
      { name: bankData?.name ?? "Bank", item: `${ROUTE_CONSTANTS.BANKS}/${slug}` },
    ];
  };

  return (
    <section>
      {!!bankImageUrl && (
        <ImageJsonLd
          images={[{
            url: bankImageUrl,
            name: `${bankData?.name} Auction Properties`,
            description: `Discover ${bankData?.name}'s auction properties on eauctiondekho.`,
          }]}
          propertyTitle={`${bankData?.name} Auction Properties`}
          propertyDescription={`Discover ${bankData?.name}'s auction properties on eauctiondekho.`}
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
        selectedBank={selectedBank}
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
                heading={`${bankData?.name} Auction Properties`}
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
            <TopCities
              locationOptions={popularLocations}
              isBankRoute={true}
              bankSlug={slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
