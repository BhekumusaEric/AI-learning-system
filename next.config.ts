import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/lesson/[id]': ['./book/**/*'],
    '/dip/lesson/[id]': ['./book/**/*'],
    '/wrp/lesson/[id]': ['./book/**/*'],
    '/admin': ['./book/**/*'],
    '/api/content/grounds': ['./book/**/*'],
    '/api/content/ground/[groundId]': ['./book/**/*'],
    '/api/content/item/[contentId]': ['./book/**/*'],
  },
};

export default nextConfig;
