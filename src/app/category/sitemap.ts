import { getCategoryBoxCollection } from "@/server/actions";
import { ICategoryCollection } from "@/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = (await getCategoryBoxCollection()) ?? [];
  const blogEntries: MetadataRoute.Sitemap = response.map((bank: ICategoryCollection) => ({
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/category/${bank?.slug}/sitemap.xml`,
    lastModified: new Date(bank?.updatedAt ?? ""),
    changeFrequency: "daily",
    priority: 0.8,
  }));
  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/category/sitemap.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
