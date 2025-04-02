import page from "@/app/page";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopBanks from "@/components/atoms/TopBanks";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { fetchBanks } from "@/server/actions";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { fetchPopularBanks } from "@/server/actions/banks";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
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

async function getSlugData(
  slug: string,
  slugcategory: string
): Promise<{ location: ILocations; category: ICategoryCollection }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    getCategoryBoxCollectionBySlug({
      slug: slugcategory,
    }) as Promise<ICategoryCollection[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    category: selectedCategory?.[0] as ICategoryCollection,
  };
}

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
    const { location: locationData, category: categoryData } =
      await getSlugData(slug, slugcategory);

    const { name: nameLocation } = locationData;
    const { name: nameCategory } = categoryData;

    let keywordsAll: string[] = [];
    if (nameCategory) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractOnlyKeywords(allSssetTypeData, nameCategory);
    }
    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging

    return {
      title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
      description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${slugcategory}`,
      },

      keywords: [
        `${nameCategory} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/categories/${slugcategory}`,
        title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
        description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/categories/${slugcategory}`,
        card: "summary_large_image",
        title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
        description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
  const { location: locationData, category: categoryData } = await getSlugData(
    slug,
    slugcategory
  );

  const { name: nameLocation, type } = locationData;
  const { name: nameCategory } = categoryData;

  console.log("filterQueryDataLOcationAndCategories", slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    response,
    popularBanks,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      location: nameLocation ?? "",
      locationType: type ?? "",
      category: nameCategory ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }),
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

  const auctionList =
    (response as { sendResponse: IAuction[]; meta: IPaginationData })
      ?.sendResponse ?? [];

  const selectionLocation = locationOptions.find(
    (item) => item.name === locationData?.name
  );

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );

  const urlFilterdata = {
    location: selectionLocation,
    category: selectedCategory,
    page: String(page) || "1",
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;
  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
        selectedCategory={selectedCategory}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`${categoryData.name} Bank Properties in  ${locationData.name}`}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
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
