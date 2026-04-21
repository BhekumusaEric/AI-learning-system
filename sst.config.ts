/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "saaio-platform",
      // Retain resources in production, remove in other stages (staging, dev)
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // 1. Configure the Website
    const site = new sst.aws.Nextjs("SaaioWeb", {
      path: ".",
      environment: {
        // SECURE: No more hardcoded passwords in code. 
        // These are injected from GitHub Secrets during deployment.
        DATABASE_URL: process.env.DATABASE_URL || "",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-prod",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
        NODE_ENV: "production",
      },
      // Include the SSL certificate in the Lambda package
      copyFiles: [
        { from: "global-bundle.pem", to: "global-bundle.pem" }
      ],
      // Region alignment with RDS
      region: "eu-north-1",
    });

    return {
      url: site.url,
    };
  },
});
