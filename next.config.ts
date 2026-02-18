import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
