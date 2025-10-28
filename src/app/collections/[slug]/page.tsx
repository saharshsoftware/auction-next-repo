import CollectionDetailPage from "@/components/templates/CollectionDetailPage";
import {
  fetchPublicCollectionById,
  fetchPropertiesInCollection,
} from "@/server/actions/favouriteList";
import { Metadata } from "next";
import { IPublicCollection } from "@/types";
import { handleOgImageUrl } from "@/shared/Utilies";

async function getCollectionData(slug: string) {
  const collectionData = await fetchPublicCollectionById({ slug });
  return collectionData;
}

export async function generateMetadata({
  params,
}: {
  params: {slug: string };
}): Promise<Metadata> {
  const {slug } = params;

  try {
    const collectionData = (await getCollectionData(slug)) as IPublicCollection;

    if (!collectionData || !collectionData.attributes) {
      return {
        robots: "noindex, follow",
      };
    }

    const { title, description, imageUrl, name } =
      collectionData.attributes;
    const metaTitle = title || name || "Curated Property Collection | Bank Auction Properties";
    const metaDescription =
      description || 
      (name 
        ? `Explore ${name} - A handpicked collection of bank auction properties. Find residential, commercial and agricultural properties at competitive prices.`
        : "Discover our curated collection of bank auction properties. Browse through verified listings of residential, commercial and agricultural properties available for auction.");
    const ogImage = await handleOgImageUrl(imageUrl || "");

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        type: "website",
        title: metaTitle,
        description: metaDescription,
        images: [{ url: ogImage }],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const { slug } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Fetch collection data and properties in parallel
  // const [collectionData, propertiesResponse] = await Promise.all([
  //   fetchPublicCollectionById({ slug:slug }),
  //   fetchPropertiesInCollection({
  //     listId:slug,
  //     page,
  //     sort: "effectiveAuctionStartTime:asc",
  //   }),
  // ]);

const collectionData = await fetchPublicCollectionById({ slug });
const propertiesResponse = await fetchPropertiesInCollection({
  listId: collectionData?.id,
  page,
  sort: "effectiveAuctionStartTime:asc",
});
console.log("collectionDatapropertiesResponse", propertiesResponse);

  return (
    <CollectionDetailPage
      collectionData={collectionData}
      propertiesData={propertiesResponse?.data || []}
      totalPages={propertiesResponse?.meta?.pagination?.pageCount || 1}
      currentPage={page}
      collectionId={collectionData?.id}
      error={propertiesResponse?.error}
    />
  );
}
