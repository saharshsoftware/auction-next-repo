import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/manage-alert",
          "/manage-filter",
          "/manage-list",
          "/settings",
        ],
      },
    ],
    sitemap: `https://www.eauctiondekho.com/sitemap.xml`,
  };
}
