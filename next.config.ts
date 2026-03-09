import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/public/**",
      },
    ],
    domains: ["api.crackora.com"],
  },
  /* config options here */
};

export default nextConfig;
