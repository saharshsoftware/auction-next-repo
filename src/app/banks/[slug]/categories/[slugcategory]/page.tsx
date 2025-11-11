import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import TopAssets from "@/components/atoms/TopAssets";
import TopCities from "@/components/atoms/TopCities";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import { fetchLocation } from "@/server/actions";
import {
  fetchAssetTypes,
  fetchPopularAssetTypes,
} from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { fetchBanks, fetchBanksBySlug } from "@/server/actions/banks";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
  getPrimaryBankName,
  handleOgImageUrl,
  sanitizeCategorySEOH1title,
  sanitizeReactSelectOptionsPage,
  getPopularDataBySortOrder,
  getCategorySpecificAssets,
  getBankBySlug,
  getCategoryBySlug,
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
import { SEO_BRAND } from "@/shared/seo.constant";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import AuctionResults from "@/components/templates/AuctionResults";
import ImageJsonLd from "@/components/atoms/ImageJsonLd";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import ProfilePreferencesToast from "@/components/atoms/ProfilePreferencesToast";

// Add caching functions
const getCategoriesCached = cache(async () => {
  return (await fetchCategories()) as ICategoryCollection[] | null;
});

const getBanksCached = cache(async () => {
  return (await fetchBanks()) as IBanks[] | null;
});


export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugcategory: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugcategory } = params;

  try {

    const [categories, banks] = await Promise.all([
      getCategoriesCached(),
      getBanksCached(),
    ]);

    const categoryData = getCategoryBySlug(categories, slugcategory);
    const bankData = getBankBySlug(banks, slug);

    const { name: nameCategory } = categoryData as ICategoryCollection;

    const { name, slug: primaryBankSlug, secondarySlug } = bankData || {};

    let keywordsAll: string[] = [];
    if (nameCategory) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractOnlyKeywords(allSssetTypeData, nameCategory);
    }
    const sanitizeImageUrl = await handleOgImageUrl(bankData?.imageURL ?? "");
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slug ?? ""
    );
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/banks/${primaryBankSlug}/categories/${slugcategory}`,
      page: searchParams?.page,
    });

    return {
      title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
      description: `Find ${nameCategory} bank auction properties for ${primaryName} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: canonicalUrl,
      },

      keywords: [
        `Bank auction ${nameCategory} auction properties`,
        `flat bank auctions in ${nameCategory}`,
        `house auctions in ${nameCategory}`,
        `vehicle auctions in ${nameCategory}`,
        `commercial property auctions in ${nameCategory}`,
        `agricultural land auctions in ${nameCategory}`,
        `machinery auctions in ${nameCategory}`,
        `plot auctions in ${nameCategory}`,
        `residential unit auctions in ${nameCategory}`,
        `eauctiondekho ${nameCategory} listings`,
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
        description: `Find ${nameCategory} bank auction properties for ${primaryName} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
        description: `Find ${nameCategory} bank auction properties for ${primaryName} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
  params: { slug: string; slugcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugcategory } = params;
  const { page = 1 } = searchParams;
  console.log("filterQueryDataBank&Category");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
  ]: any = await Promise.all([
    fetchAssetType(),
    getBanksCached(),
    getCategoriesCached(),
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

  const categoryData = getCategoryBySlug(rawCategories, slugcategory);
  const bankData = getBankBySlug(rawBanks, slug);

  const filteredAssetsType = getCategorySpecificAssets({
    response: rawAssetTypes,
    params: { slugcategory },
    isBankCategoriesRoute: true,
    isCategoryRoute: false,
  }) as IAssetType[];

  const filterAssets = getPopularDataBySortOrder(filteredAssetsType);

  const popularLocations = getPopularDataBySortOrder(rawLocations);

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );
  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);
  const urlFilterdata = {
    bank: bankData || "",
    category: categoryData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const bankNamePrimary =
    bankData?.secondarySlug === slug
      ? bankData?.secondarySlug?.toUpperCase() ?? (bankData?.name || "")
      : bankData?.name || "";

  const key = page?.toString();

  const getRequiredParameters = () => {
    return {
      bankName: bankData?.name ?? "",
      category: categoryData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `/` },
      { name: "Bank", item: `${ROUTE_CONSTANTS.BANKS}` },
      { name: bankNamePrimary || "Bank", item: `${ROUTE_CONSTANTS.BANKS}/${slug}` },
      { name: "Category", item: `${ROUTE_CONSTANTS.CATEGORY}` },
      { name: categoryData?.name || "Category", item: `${ROUTE_CONSTANTS.BANKS}/${slug}${ROUTE_CONSTANTS.CATEGORY}/${slugcategory}` },
    ];
  };

  return (
    <section>
      {!!(bankData?.imageURL) && (
        <ImageJsonLd
          images={[{
            url: await handleOgImageUrl(bankData?.imageURL ?? ""),
            name: `${bankData?.name} ${categoryData?.name} Auctions`,
            description: `Find ${categoryData?.name} bank auction properties for ${bankData?.name} on eauctiondekho.`,
          }]}
          propertyTitle={`${bankData?.name} ${categoryData?.name} Auctions`}
          propertyDescription={`Find ${categoryData?.name} bank auction properties for ${bankData?.name} on eauctiondekho.`}
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
        selectedCategory={selectedCategory}
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
            <Suspense key={key} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`${bankNamePrimary}  ${categoryData?.name} Property Auctions `}
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
              <TopCities
                locationOptions={popularLocations}
                isBankRoute={true}
                bankSlug={slug}
              />
            </div>
            <div>
              <TopAssets
                assetsTypeData={filterAssets}
                isBankTypesRoute={true}
                bankSlug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
