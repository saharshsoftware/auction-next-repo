import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import CategorySpecificAssets from "@/components/atoms/CategorySpecificAssets";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import TopCategory from "@/components/atoms/TopCategory";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import { fetchBanks, fetchLocation } from "@/server/actions";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  fetchPopularAssets,
  fetchPopularCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { getAssetTypeClient } from "@/services/auction";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
  getCategorySpecificAssets,
  sanitizeCategorySEOH1title,
  sanitizeCategorytitle,
  sanitizeReactSelectOptionsPage,
  handleOgImageUrl,
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
import { SEO_BRAND } from "@/shared/seo.constant";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import AuctionResults from "@/components/templates/AuctionResults";
import ImageJsonLd from "@/components/atoms/ImageJsonLd";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

async function getSlugData(slug: string) {
  const selectedCategory = (await getCategoryBoxCollectionBySlug({
    slug,
  })) as unknown as ICategoryCollection[];
  return selectedCategory?.[0];
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
    const categoryData = await getSlugData(slug);
    const { name, subCategories } = categoryData;
    let keywordsAll: string[] = [];
    if (name) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractOnlyKeywords(allSssetTypeData, name);
    }
    const logoUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
    console.log("Name", { name });
    const sanitizeTitle = sanitizeCategorytitle(name ?? "");
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/categories/${slug}`,
      page: searchParams?.page,
    });

    return {
      title: sanitizeTitle,
      description: `Find ${name} bank auction properties on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: { canonical: canonicalUrl },
      keywords: [
        `${name} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: sanitizeTitle,
        description: `Find ${name} bank auction properties on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: logoUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: sanitizeTitle,
        description: `Find ${name} bank auction properties on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
  const categoryData = await getSlugData(slug);

  console.log("filterQueryDataBank");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    popularCategories,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    fetchPopularCategories(),
    fetchPopularAssets(),
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

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );
  const urlFilterdata = {
    category: selectedCategory,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const filteredAssetsType =
    (getCategorySpecificAssets({
      response: popularAssets,
      params: { slug },
      isBankCategoriesRoute: false,
      isCategoryRoute: true,
    }) as IAssetType[]) || [];

  const getRequiredParameters = () => {
    return {
      category: categoryData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  // We do not upload images for categories; intentionally use the site logo
  const logoUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
  const categoryImageUrl = logoUrl;

  const getBreadcrumbItems = () => {
    return [
      {
        label: "Category",
        href: ROUTE_CONSTANTS.CATEGORY,
      },
      {
        label: categoryData?.name ?? "Category",
        href: `${ROUTE_CONSTANTS.CATEGORY}/${slug}`,
      },
    ];
  };

    return (
    <section>
      {!!categoryImageUrl && (
        <ImageJsonLd
          images={[{
            url: categoryImageUrl,
            name: `${categoryData?.name} Bank Auction Properties`,
            description: `Find ${categoryData?.name} bank auction properties on eauctiondekho.`,
          }]}
          propertyTitle={`${categoryData?.name} Bank Auction Properties`}
          propertyDescription={`Find ${categoryData?.name} bank auction properties on eauctiondekho.`}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
          { name: "Categories", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories` },
          { name: categoryData?.name ?? "Category", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}` },
        ]}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedCategory={selectedCategory}
      />
      <div className="common-section">
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbItems()}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`${sanitizeCategorySEOH1title(
                  categoryData?.name || ""
                )} `}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <div className="mb-4">
              <TopCategory categoryOptions={popularCategories} />
            </div>
            <div>
              <CategorySpecificAssets
                assetsTypeData={filteredAssetsType}
                isCategoryRoute={true}
                categorySlug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
