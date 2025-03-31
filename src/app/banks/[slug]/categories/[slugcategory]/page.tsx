import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { fetchLocation } from "@/server/actions";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import {
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
): Promise<{ bank: IBanks; category: ICategoryCollection }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    getCategoryBoxCollectionBySlug({
      slug: slugcategory,
    }) as Promise<ICategoryCollection[]>,
    fetchBanksBySlug({
      slug,
    }) as Promise<IBanks[]>,
  ]);
  return {
    bank: selectedLocation?.[0] as IBanks,
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
    const { category: categoryData, bank: bankData } = await getSlugData(
      slug,
      slugcategory
    );

    const { name: nameCategory } = categoryData;

    const { name, slug: primaryBankSlug, secondarySlug } = bankData;

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
    return {
      title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
      description: `Find ${nameCategory} bank auction properties for ${primaryName} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/categories/${slugcategory}`,
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
        `eAuctionDekho ${nameCategory} listings`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/categories/${slugcategory}`,
        title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
        description: `Find ${nameCategory} bank auction properties for ${primaryName} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${primaryBankSlug}/categories/${slugcategory}`,
        card: "summary_large_image",
        title: `${primaryName} ${nameCategory} Property Auctions | Find Auctions`,
        description: `Find ${nameCategory} bank auction properties for ${primaryName} on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
  const { category: categoryData, bank: bankData } = await getSlugData(
    slug,
    slugcategory
  );
  console.log("filterQueryDataBank&Category");

  // Fetch data in parallel
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations, response]: any =
    await Promise.all([
      getAssetType(),
      fetchBanks(),
      getCategoryBoxCollection(),
      fetchLocation(),
      getAuctionsServer({
        bankName: bankData?.name ?? "",
        category: categoryData?.name ?? "",
        page: String(page) || "1",
        reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
      }),
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

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );
  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);
  const urlFilterdata = {
    bank: bankData,
    category: categoryData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const bankNamePrimary =
    bankData?.secondarySlug === slug
      ? bankData?.secondarySlug?.toUpperCase() ?? (bankData?.name || "")
      : bankData?.name || "";

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedCategory={selectedCategory}
        selectedBank={selectedBank}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`${bankNamePrimary}  ${categoryData?.name} Property Auctions `}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
            <RecentData />
          </div>
        </div>
      </div>
    </section>
  );
}
