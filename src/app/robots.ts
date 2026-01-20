import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { shouldPreventIndexing, shouldPreventIndexingByHostname } from "@/shared/SeoUtils";

/**
 * Generates robots.txt file for search engines
 * 
 * CHANGE: Now uses runtime hostname checking with whitelist approach.
 * This robots.txt applies to ALL pages/routes in the application.
 * 
 * Behavior:
 * - Non-production domains (staging, api, etc.): Returns "Disallow: /" (blocks all crawling)
 * - Production domains (www.eauctiondekho.com, eauctiondekho.com): Returns normal rules
 * 
 * Detection priority:
 * 1. Runtime hostname check (from request headers) - most reliable
 * 2. Environment variable check (fallback for backward compatibility)
 */
export default function robots(): MetadataRoute.Robots {
  // Try to get hostname from headers (runtime check)
  let preventIndexing = false;
  try {
    const headersList = headers();
    const hostname = headersList.get("host") || "";
    if (hostname) {
      // Use hostname-based whitelist check (preferred method)
      preventIndexing = shouldPreventIndexingByHostname(hostname);
    } else {
      // Fallback to environment variable check if hostname not available
      preventIndexing = shouldPreventIndexing();
    }
  } catch (error) {
    // If headers() fails (e.g., during build), fallback to env var check
    preventIndexing = shouldPreventIndexing();
  }
  
  // Prevent indexing on non-production domains
  // This blocks ALL pages from being crawled when on staging or other non-production subdomains
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
