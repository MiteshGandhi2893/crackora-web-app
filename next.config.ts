import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"], // ✅ serve modern formats — cuts image size 40-60%
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "api.crackora.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  headers: async () => [
    // ✅ Next.js static chunks have content hashes — safe to cache forever
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    // ✅ Public folder assets (images, fonts, icons)
    {
      source: "/public/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400", // 1 day — adjust if assets change often
        },
      ],
    },
    // ✅ HTML pages — always revalidate so users get fresh content
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;