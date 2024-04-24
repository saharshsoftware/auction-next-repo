/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // {
      //   source: "/blog/:path*/",
      //   destination: "https://example.com/blog/:path*/",
      // },
    ];
  },
};

export default nextConfig;
