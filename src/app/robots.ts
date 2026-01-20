import { MetadataRoute } from "next";
import { shouldPreventIndexing } from "@/shared/SeoUtils";

/**
 * Generates robots.txt file for search engines
 * 
 * CHANGE: Now conditionally blocks all crawling on staging environment.
 * This robots.txt applies to ALL pages/routes in the application.
 * 
 * Behavior:
 * - Staging: Returns "Disallow: /" for all user agents (blocks all crawling)
 * - Production: Returns normal rules with allowed/disallowed paths
 */
export default function robots(): MetadataRoute.Robots {
  const preventIndexing = shouldPreventIndexing();
  
  // Prevent indexing on staging environment
  // This blocks ALL pages from being crawled when on staging
  if (preventIndexing) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"], // Blocks all routes
        },
      ],
    };
  }
  
  // Production environment - allow indexing with restrictions
  // Original behavior preserved - no changes to production indexing
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
    sitemap: `https://www.eauctiondekho.com/sitemap.xml.gz`,
  };
}
