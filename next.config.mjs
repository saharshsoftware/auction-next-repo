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
        source: "/category/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/sitemap/index.xml`,
      },
      {
        source: "/location/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/sitemap/index.xml`,
      },
      {
        source: "/bank/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banks/sitemap/index.xml`,
      },
      {
        source: "/category/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/sitemap.xml`,
      },
      {
        source: "/bank/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banks/:slug*/sitemap.xml`,
      },
      {
        source: "/category/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/:slug*/sitemap.xml`,
      },
      {
        source: "/location/:slug*/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/:slug*/sitemap.xml`,
      },
    ];
  },
};

export default nextConfig;
