import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/sitemaps/sitemap.xml.gz`, // This will rewrite to aws store sitemap
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/sitemap/index.xml`, // This will rewrite to strapi sitemap
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
