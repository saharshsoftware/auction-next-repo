import { fetchAssetTypes } from "@/server/actions/assetTypes";
import { getCategoryBoxCollectionBySlug } from "@/server/actions/auction";
import { fetchBanksBySlug } from "@/server/actions/banks";
import {
  extractOnlyKeywords,
  getPrimaryBankName,
  handleOgImageUrl,
} from "@/shared/Utilies";
import { IBanks, ICategoryCollection } from "@/types";
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
  return null;
}
