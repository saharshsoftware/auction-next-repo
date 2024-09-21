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
    ],
  },
  async redirects() {
    return [
      {
        source: "/banks",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/e-auction-banks`,
        permanent: true,
      },
      {
        source: "/asset-types",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/e-auction-assets`,
        permanent: true,
      },
      {
        source: "/locations",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/e-auction-in-cities`,
        permanent: true,
      },
      {
        source: "/categories",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/e-auction-categories`,
        permanent: true,
      },
      {
        source: "/auctions",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/find-auctions`,
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
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
        source: "/asset-types/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/asset-types/sitemap/index.xml`,
      },
      {
        source: "/asset-types/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/asset-types/:slug*/sitemap.xml`,
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
};
export default nextConfig;
