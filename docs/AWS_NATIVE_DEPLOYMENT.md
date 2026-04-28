# AWS Native Deployment Guide (SST Ion)

This guide details the high-fidelity deployment architecture of the SAAIO Training Grounds on AWS. By moving from Supabase to native AWS services (RDS, CloudFront, Lambda), we achieve 100% data ownership and professional-grade infrastructure.

## 🏗 Architecture Overview

The platform uses a Serverless-first architecture managed by **SST Ion**.

```mermaid
graph TD
    User([User Browser]) --> CF[Amazon CloudFront CDN]
    CF -->|Static Assets| S3[Amazon S3 Bucket]
    CF -->|API / Dynamic Rendering| Lambda[AWS Lambda Function]
    Lambda --> RDS[(Amazon RDS PostgreSQL)]
    RDS -.->|SSL Enforcement| Lambda
```

### Key Components

| Component | Service | Role |
| :--- | :--- | :--- |
| **Edge Network** | CloudFront | Global distribution and SSL termination. |
| **Compute** | AWS Lambda | Handles Next.js SSR, Middleware, and API routes. |
| **Storage** | Amazon S3 | Hosts pre-rendered static HTML, JS, CSS, and public assets. |
| **Database** | Amazon RDS | Managed PostgreSQL instance (Native RDS). |
| **Infra as Code** | SST Ion | Orchestrates the entire stack via `sst.config.ts`. |

---

## 🔒 RDS Connectivity & SSL (CRITICAL)

To ensure secure communication between AWS Lambda and Amazon RDS, the system enforces SSL.

### 1. The Global Bundle
Amazon RDS uses a specific certificate bundle to verify connections. We use the **Global Bundle** from AWS Trust Store.
- **File**: `global-bundle.pem` (located in the root of the project).
- **Update Source**: `https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem`

### 2. Lambda Integration
In a Serverless environment, the Lambda function needs access to this certificate. This is handled in `sst.config.ts` using the `copyFiles` parameter:

```typescript
copyFiles: [
  { from: "global-bundle.pem", to: "global-bundle.pem" }
]
```

### 3. Database Client
The application uses the `postgres.js` native client in `src/lib/db.ts`. The configuration automatically detects the production environment and applies the certificate.

---

## 🚀 Deployment Workflow

### Prerequisites
- **Node.js**: v20 or newer (managed via `nvm`).
- **AWS Credentials**: Access Key ID and Secret Access Key with Administrator permissions.

### Commands

#### 1. Configure Environment
Export your AWS credentials in your terminal:
```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="eu-north-1"
```

#### 2. Deploy to Production
Run the SST deployment command:
```bash
npx sst deploy --stage production
```

### Deployment Stages
- **Default**: Temporary development environments.
- **Production**: The stable, CloudFront-backed environment.

---

## 📝 Environment Variables

The following variables must be configured in `sst.config.ts` under the `SaaioWeb` environment section:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | RDS Connection String | `postgres://user:password@hostname:5432/postgres` |
| `NEXTAUTH_SECRET` | Secret for session encryption | `openssl rand -hex 32` |
| `NEXTAUTH_URL` | The CloudFront URL | `https://dy53b7j1euf9d.cloudfront.net` |
| `NODE_ENV` | Environment flag | `production` |

---

## 🛠 Maintenance & Troubleshooting

- **503 Errors**: Often caused by Lambda failing to connect to RDS. Check if `global-bundle.pem` is present in the deployment and that RDS **Public Access** is enabled.
- **Database Migrations**: Run scripts from your local machine using the same `global-bundle.pem` for verification (see `scratch/test_rds_connection.js`).
- **Logs**: Use `npx sst logs` to tail live production logs from the terminal.

---

**Prepared by Antigravity AI Engine**  
*Last Updated: 2026-04-19*
