/**
 * SEO Utility Functions
 * 
 * CHANGE: Added environment-based detection to prevent staging from being indexed.
 * This prevents search engines from indexing staging.eauctiondekho.com which was
 * competing with the production site.
 */

export const PRIMARY_CANONICAL_ORIGIN = "https://www.eauctiondekho.com";

/**
 * Keep production canonicals on the preferred HTTPS + www origin while still
 * allowing localhost and non-production environments to use their own host.
 */
export function getCanonicalBaseUrl(baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL): string {
  if (!baseUrl) return PRIMARY_CANONICAL_ORIGIN;

  try {
    const url = new URL(baseUrl);
    if (
      url.hostname === "eauctiondekho.com" ||
      url.hostname === "www.eauctiondekho.com"
    ) {
      return PRIMARY_CANONICAL_ORIGIN;
    }

    return url.origin;
  } catch {
    return PRIMARY_CANONICAL_ORIGIN;
  }
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
 * Get robots directive value based on environment check.
 * 
 * This function checks the environment and returns the appropriate robots directive.
 * Use this in generateMetadata functions to ensure meta tags match the X-Robots-Tag header set by middleware.
 * 
 * @returns "noindex, nofollow" for staging environments, "index, follow" for production
 */
export async function getRobotsDirective(): Promise<"index, follow" | "noindex, nofollow"> {
  const preventIndexing = shouldPreventIndexing();
  return preventIndexing ? "noindex, nofollow" : "index, follow";
}
