import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
  outputFileTracingIncludes: {
    '/lesson/[id]': ['./book/**/*'],
    '/dip/lesson/[id]': ['./book/**/*'],
    '/admin': ['./book/**/*'],
    '/api/content/grounds': ['./book/**/*'],
    '/api/content/ground/[groundId]': ['./book/**/*'],
    '/api/content/item/[contentId]': ['./book/**/*'],
  },
};

export default nextConfig;
