import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/admin",
  assetPrefix: "/admin",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
