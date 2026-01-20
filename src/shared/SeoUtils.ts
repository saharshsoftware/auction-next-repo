/**
 * SEO Utility Functions
 * 
 * CHANGE: Added environment-based detection to prevent staging from being indexed.
 * This prevents search engines from indexing staging.eauctiondekho.com which was
 * competing with the production site.
 */

import { headers } from "next/headers";

/**
 * Whitelist of production domains allowed for indexing.
 * Only these domains will be indexed by search engines.
 */
const ALLOWED_PRODUCTION_DOMAINS: readonly string[] = [
  "www.eauctiondekho.com",
  "eauctiondekho.com",
] as const;

/**
 * Check if indexing should be prevented based on hostname using whitelist approach.
 * 
 * This function uses a whitelist to explicitly allow only production domains.
 * All other subdomains (staging, api, etc.) will be blocked from indexing.
 * 
 * @param hostname - The hostname to check (e.g., "staging.eauctiondekho.com")
 * @returns true if indexing should be prevented (hostname NOT in whitelist)
 */
export function shouldPreventIndexingByHostname(hostname: string): boolean {
  if (!hostname) {
    return true; // Prevent indexing if no hostname provided
  }
  const normalizedHostname = hostname.toLowerCase().trim();
  // Check if hostname is in the allowed production domains whitelist
  return !ALLOWED_PRODUCTION_DOMAINS.includes(normalizedHostname);
}

/**
 * Check if the current environment should prevent indexing
 * 
 * Detection priority:
 * 1. NEXT_PUBLIC_ENVIRONMENT=staging (most reliable - set in staging env)
 * 2. Domain URL contains "staging" (fallback for backward compatibility)
 * 3. Default: Allow indexing (production)
 * 
 * @returns true if staging environment is detected (prevents indexing)
 */
export function shouldPreventIndexing(): boolean {
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
 * Get robots directive value based on runtime hostname check.
 * 
 * This function checks the actual request hostname at runtime and returns
 * the appropriate robots directive. Use this in generateMetadata functions
 * to ensure meta tags match the X-Robots-Tag header set by middleware.
 * 
 * @returns "noindex, nofollow" for non-production domains, "index, follow" for production
 */
export async function getRobotsDirective(): Promise<"index, follow" | "noindex, nofollow"> {
  try {
    const headersList = headers();
    const hostname = headersList.get("host") || "";
    if (hostname) {
      const preventIndexing = shouldPreventIndexingByHostname(hostname);
      return preventIndexing ? "noindex, nofollow" : "index, follow";
    }
  } catch (error) {
    // If headers() fails (e.g., during build), default to allowing indexing
    // This ensures production builds work correctly
  }
  // Default to allowing indexing (production behavior)
  return "index, follow";
}
