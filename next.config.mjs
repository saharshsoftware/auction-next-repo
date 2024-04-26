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
        source: "/asset-types/sitemap.xml",
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
