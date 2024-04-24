import { fetchBanks } from "@/server/actions";
import { IBanks } from "@/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = (await fetchBanks()) ?? [];
  const blogEntries: MetadataRoute.Sitemap = response.map((bank: IBanks) => ({
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/${bank?.slug}/sitemap.xml`,
    lastModified: new Date(bank?.updatedAt ?? ""),
    changeFrequency: "daily",
    priority: 0.8,
  }));
  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks/sitemap.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
