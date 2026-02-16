/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  staticPageGenerationTimeout: 1000,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dwqz7qa945k06.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.giphy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "auction-dekho.s3.ap-south-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "newscrapperstest.s3.ap-south-1.amazonaws.com",
        port: "",
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}`,
        permanent: true,
      },
      {
        source: "/e-auction-banks",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks`,
        permanent: true,
      },
      {
        source: "/e-auction-assets",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/assets`,
        permanent: true,
      },
      {
        source: "/e-auction-in-cities",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities`,
        permanent: true,
      },
      {
        source: "/e-auction-categories",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories`,
        permanent: true,
      },
      {
        source: "/auctions",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/find-auctions`,
        permanent: true,
      },
      {
        source: "/assets",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/types`,
        permanent: true,
      },
      {
        source: "/lcoations/:slug",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/:slug`,
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml.gz",
        destination: `https://auction-dekho.s3.ap-south-1.amazonaws.com/sitemaps/sitemap.xml.gz`,
      },
      {
        // Matches any file in /sitemaps/ that ends with .xml.gz
        source: "/sitemaps/:slug(.*\\.xml\\.gz)",
        destination:
          "https://auction-dekho.s3.ap-south-1.amazonaws.com/sitemaps/:slug",
      },
      {
        source: "/categories/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/sitemap/index.xml`,
      },
      {
        source: "/locations/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/sitemap/index.xml`,
      },
      {
        source: "/banks/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banks/sitemap/index.xml`,
      },
      {
        source: "/types/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/types/sitemap/index.xml`,
      },
      {
        source: "/types/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/types/:slug*/sitemap.xml`,
      },
      {
        source: "/banks/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banks/:slug*/sitemap.xml`,
      },
      {
        source: "/categories/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/:slug*/sitemap.xml`,
      },
      {
        source: "/locations/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/:slug*/sitemap.xml`,
      },
    ];
  },
  /**
   * HTTP Headers configuration
   * 
   * CHANGE: Added X-Robots-Tag header to prevent staging indexing.
   * This header applies to ALL routes/pages in the application.
   * 
   * What changed:
   * - Changed source from "/" to "/:path*" to cover ALL routes (not just homepage)
   * - Added environment-based detection to set "noindex, nofollow" on staging
   * - Production behavior unchanged: "index, follow" header
   * 
   * How it works:
   * - ALL pages/routes receive the X-Robots-Tag HTTP header
   * - Staging: Header is "noindex, nofollow" (prevents indexing)
   * - Production: Header is "index, follow" (allows indexing)
   * 
   * This works together with robots.txt and meta robots tag for
   * comprehensive protection. HTTP headers are the strongest signal.
   */
  async headers() {
    // CHANGE: Added X-Robots-Tag header to prevent staging indexing
    // Uses same logic as shouldPreventIndexing() in src/shared/SeoUtils.ts
    // Check explicit environment variable first (most reliable)
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
    let preventIndexing = environment === "staging";
    
    // Fallback: Check if domain URL contains "staging" (backward compatibility)
    if (!preventIndexing) {
      const domainBaseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "";
      preventIndexing = domainBaseUrl.toLowerCase().includes("staging");
    }
    
    const robotsTag = preventIndexing ? "noindex, nofollow" : "index, follow";
    
    // CHANGE: Changed from "/" to "/:path*" to apply to ALL routes
    // This ensures every page gets the X-Robots-Tag header
    return [
      {
        source: "/:path*", // Matches all routes (/, /about, /auctions/123, etc.)
        headers: [
          {
            key: "X-Robots-Tag",
            value: robotsTag,
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true, // Enables CSS optimization
  },
};
export default nextConfig;
