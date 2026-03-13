import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/lesson/[id]': ['./book/**/*'],
    '/admin': ['./book/**/*'],
  },
};

export default nextConfig;
