# SAAIO Platform: Infrastructure Handover & Migration Plan

**Date:** April 29, 2026  
**Prepared for:** Fen & Wandaboy (WeThinkCode_ DevOps)  
**Project:** SAAIO / Digital Inclusion Program (DIP) Migration  

---

## 1. Executive Summary
The SAAIO platform has been modernized into a native AWS architecture using **Next.js** and **SST (Ion)**. The platform is currently deployed in a staging environment in the **Cape Town (af-south-1)** region. The goal of this handover is to transition the infrastructure and data to the official WeThinkCode_ AWS Organization.

## 2. Technical Stack
- **Framework:** Next.js 14+ (App Router)
- **Deployment Tool:** [SST Ion](https://sst.dev/) (Terraform/Pulumi-based IaC)
- **Primary Database:** Amazon RDS PostgreSQL (db.t3.micro)
- **CDN/Edge:** Amazon CloudFront
- **Compute:** AWS Lambda (via OpenNext)
- **Storage:** Amazon S3 (Assets)
- **Email:** WeThinkCode_ Internal Email API

---

## 3. Infrastructure as Code (IaC)
The entire infrastructure is defined in `sst.config.ts`. 

### Key Components:
- **Site Component:** `sst.aws.Nextjs` handles the Lambda, S3, and CloudFront orchestration.
- **Region:** Hardcoded to `af-south-1` to ensure data residency and low latency for South African students.
- **SSL Support:** The RDS connection requires `global-bundle.pem` (included in the repository root) for secure connectivity.

---

## 4. Database Configuration
The platform has successfully migrated from Supabase to **Native RDS**.

### RDS Instance Details:
- **Engine:** PostgreSQL 16+
- **Security:** Public access is currently enabled for administrative purposes but should be restricted to VPC-only in the official account.
- **Schema:** 
    - `saaio_students` (Primary ID: `student_id`)
    - `dip_students` (Primary ID: `login_id`)
    - `saaio_progress` (Tracks lesson completion)
    - `cohorts`, `supervisors`, `invite_links`

### Data Migration:
We have a battle-tested migration script located at:  
`scripts/full-migration-supabase-to-rds.js`  
This script performs schema mapping (e.g., `full_name` -> `name`) and can be used to seed the new production database from the staging environment.

---

## 5. Required Environment Variables
To deploy in the new environment, the following secrets must be configured:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string for the official RDS instance. |
| `NEXTAUTH_SECRET` | Used for session encryption (JWT). |
| `NEXTAUTH_URL` | The final production URL (e.g., https://idc-curriculum.wethinkco.de). |
| `WTC_EMAIL_API_KEY` | API Key for the `api.lms.wethinkco.de` endpoint. |
| `NODE_ENV` | Must be set to `production`. |

---

---

## 6. DNS & SSL Requirements (Critical Details)
The platform is ready for the official domain: **`idc-curriculum.wethinkco.de`**. During initial attempts, we encountered blockers related to cross-region validation.

### ⚠️ Critical Requirement: ACM Certificate Location
- **Requirement:** For CloudFront distributions, the ACM Certificate **MUST** be provisioned in the **`us-east-1` (N. Virginia)** region. 
- **Reason:** CloudFront is a global service; certificates in `af-south-1` (Cape Town) will NOT be visible to the distribution.
- **Action:** Fen/Wandaboy must provide a Certificate ARN from `us-east-1`.

### DNS Configuration Steps:
1. **Validation:** If using DNS validation, ensure the `_x.wethinkco.de` CNAME record is added to the Route 53 zone or the external DNS provider.
2. **CloudFront Mapping:** Once the deployment is run with the `domain` block enabled in `sst.config.ts`, AWS will provide a CloudFront Distribution URL (e.g., `dxxxxx.cloudfront.net`).
3. **CNAME Record:** 
    - **Host:** `idc-curriculum`
    - **Value:** `[CloudFront-Distribution-URL]`
4. **Alternative (A-Record):** If using Route 53 for the target zone, use an **Alias A-Record** pointing directly to the CloudFront distribution.

### sst.config.ts Update Pattern:
```typescript
domain: {
  name: "idc-curriculum.wethinkco.de",
  cert: "arn:aws:acm:us-east-1:774525420097:certificate/XXXX", // Must be us-east-1
},
```

---

## 7. Known Dependencies
- **Supabase:** Still used for **Real-time Chat** and **WRP Games**. We recommend maintaining the legacy Supabase project or migrating these to **AWS AppSync / IoT Core** in Phase 2.
- **Email API:** Currently using `https://api.lms.wethinkco.de/email/email`.

---

## 8. Migration Steps (Proposed)
1. **Step 1:** DevOps provisions a fresh RDS PostgreSQL instance in `af-south-1`.
2. **Step 2:** Provide the developer with the new `DATABASE_URL` and `ACM ARN`.
3. **Step 3:** Developer runs the data sync script to populate the new RDS.
4. **Step 4:** Run `npx sst deploy --stage prod` within the official AWS account.
5. **Step 5:** Final DNS switchover.

---
**Handover Status:** Green / Ready for Migration.
