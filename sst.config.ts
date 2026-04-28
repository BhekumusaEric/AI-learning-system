/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "saaio-platform",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // NOTE: Custom domain idc-curriculum.wethinkco.de is temporarily disabled 
    // while waiting for CNAME validation from the WeThinkCode_ DNS team.
    // Certificate ARN: arn:aws:acm:us-east-1:774525420097:certificate/c847a25e-e7ad-4331-a150-c6ccfb264dd3

    // Configure the Website in the Cape Town (af-south-1) region 
    // using the default CloudFront URL for immediate unblocking.
    const site = new sst.aws.Nextjs("SaaioWeb", {
      path: ".",
      /* domain: {
        name: "idc-curriculum.wethinkco.de",
        cert: "arn:aws:acm:us-east-1:774525420097:certificate/c847a25e-e7ad-4331-a150-c6ccfb264dd3",
      }, */
      environment: {
        DATABASE_URL: "postgres://bhntshwcjc025:EricKelvin2025@saaio-db-capetown.c9u046kgwwaf.af-south-1.rds.amazonaws.com:5432/postgres",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "7f9e39690b8644b089fc4db3ba4b2291",
        NEXTAUTH_URL: "https://d1dgrcvw7jhb89.cloudfront.net",
        NODE_ENV: "production",
        WTC_EMAIL_API_KEY: process.env.WTC_EMAIL_API_KEY || "",
      },
      copyFiles: [
        { from: "global-bundle.pem", to: "global-bundle.pem" }
      ],
      region: "af-south-1",
    });

    return {
      url: site.url,
    };
  },
});
