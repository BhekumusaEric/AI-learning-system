# Deployment Checklist for AWS Migration

This document lists the information and access required by the DevOps partner (Wonderby) to deploy the SAAIO Training Grounds platform on AWS under the WeThinkCode domain.

## Access Requirements

- [ ] **GitHub/GitLab Access**: Write access to the repository to configure CI/CD pipelines (e.g., GitHub Actions).
- [ ] **AWS IAM User/Role**: Permissions for:
    - **S3**: Create and manage buckets.
    - **CloudFront**: Create and manage distributions.
    - **Lambda**: Deploy and update functions.
    - **EC2**: Launch and manage instances.
    - **Route 53**: Update DNS records for the `wethinkcode.co.za` domain.
    - **ACM**: Request/Renew SSL certificates.

## Project configuration

- [ ] **Build Command**: `npm run build`
- [ ] **Node.js Version**: 20.x or higher (compatible with Next.js 16).
- [ ] **Next.js Output**: Currently set to standard. For Lambda deployment, [OpenNext](https://open-next.js.org/) or [SST](https://sst.dev/) is recommended.

## Environment Variables (.env)

These need to be configured in the AWS Lambda console and the EC2 instance environment.

| Variable Name | Description | Example/Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Found in Supabase Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Found in Supabase Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role (Server-only) | Found in Supabase Settings |
| `NEXT_PUBLIC_API_URL` | URL for the Mobile API (EC2) | e.g., `https://api.saaio.wethinkcode.co.za` |
| `DATABASE_URL` | Connection string for Postgres (if using directly) | Found in Supabase |

## Domain & Network

- [ ] **Production Domain**: e.g., `saaio.wethinkcode.co.za`
- [ ] **Mobile API Subdomain**: e.g., `api.saaio.wethinkcode.co.za`
- [ ] **SSL/TLS**: We recommend using AWS Certificate Manager (ACM) for all subdomains.

## Service Mapping

- **Frontend & App APIs**: AWS Lambda + Amazon S3 + CloudFront.
- **Mobile Backend**: AWS EC2 (running `mobile-api-server.js`).
- **Media/Assets**: Amazon S3.
