import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // COOP/COEP required for SharedArrayBuffer (pyodide input() support)
        // Only apply to DIP and SAAIO lesson routes — NOT WRP (which embeds YouTube)
        source: '/(lesson|dip/lesson)/:path*',
        headers: [
          // { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      {
        // Override: WRP pages live under /lesson/ but embed YouTube — strip COEP
        source: '/lesson/:path(page1_welcome_and_mindfulness|page2_verbal_communication|page2b_spin_the_wheel|page3_mock_interview|page4_written_communication|page5_email_practice|page6_linkedin_personal_brand|page6b_buzzword_bingo|page7_resume_building|page7b_cv_builder|page8_interview_readiness|page8b_spot_the_mistake|page9_live_quiz)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },
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
