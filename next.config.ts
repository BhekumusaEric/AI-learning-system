import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/lesson/[id]': ['./book/**/*'],
      '/admin': ['./book/**/*'],
    },
  },
};

export default nextConfig;
