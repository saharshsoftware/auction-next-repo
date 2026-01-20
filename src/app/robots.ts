import { MetadataRoute } from "next";

/**
 * Check if the current environment should prevent indexing
 * 
 * CHANGE: Added environment-based detection to prevent staging from being indexed.
 * This prevents search engines from indexing staging.eauctiondekho.com which was
 * competing with the production site.
 * 
 * Detection priority:
 * 1. NEXT_PUBLIC_ENVIRONMENT=staging (most reliable - set in staging env)
 * 2. Domain URL contains "staging" (fallback for backward compatibility)
 * 3. Default: Allow indexing (production)
 * 
 * @returns true if staging environment is detected (prevents indexing)
 */
function shouldPreventIndexing(): boolean {
  // Check explicit environment variable first (most reliable)
  // Set NEXT_PUBLIC_ENVIRONMENT=staging in your staging environment
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
  if (environment === "staging") {
    return true;
  }
  
  // Fallback: Check if domain URL contains "staging" (backward compatibility)
  // This allows detection even if NEXT_PUBLIC_ENVIRONMENT is not set
  const domainBaseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "";
  if (domainBaseUrl.toLowerCase().includes("staging")) {
    return true;
  }
  
  // Default: Allow indexing (production)
  return false;
}

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
