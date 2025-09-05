/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: "/types",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/assets`,
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
        source: "/types/sitemap.xml",
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
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
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
