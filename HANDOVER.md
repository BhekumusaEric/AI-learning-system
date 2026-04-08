# Project Handover: SAAIO Training Grounds

This document provides the high-level technical transition and maintenance instructions for the SAAIO Training Grounds platform, scheduled for AWS EC2 deployment tomorrow.

## Executive Summary

The SAAIO Training Grounds is a high-fidelity, dual-pane learning environment designed for professional Python training. It features an automated onboarding pipeline, a glassmorphic interactive user tour, and deep integration with Supabase for persistent progress tracking.

### Infrastructure Requirements
- **Frontend/Backend**: Next.js (App Router)
- **Database**: Supabase (PostgreSQL + RLS)
- **Email Service**: Resend (API-bound)
- **Monitoring**: PM2 (for EC2 Node.js process)
- **Reverse Proxy**: Nginx (with SSL termination)

---

## Deployment Strategy (EC2)

The platform is designed to be hosted on a single **t3.micro** or **t3.small** instance under **Amazon Linux 2023**.

1. **Environment Config**: Refer to the [.env.example](./.env.example) in the root directory. This must be populated with production keys before build.
2. **Setup Instructions**: Follow the detailed [EC2 Configuration Guide](./docs/ec2_api_setup.md) for Nginx and PM2 setup.
3. **Build Command**: 
   ```bash
   npm install
   npm run build
   pm2 start npm --name "saaio-grounds" -- start
   ```

---

## 🔒 Security Mandates (CRITICAL)

> [!CAUTION]
> **IAM Key Rotation**: The AWS Access Keys provided during development were briefly exposed in the local Git history (now scrubbed). For production, you **MUST** generate fresh IAM credentials with limited `execute-api` permissions.

- **Admin Password**: Ensure `ADMIN_PASSWORD` in `.env` is a high-entropy secret.
- **SSL**: Deployment should **only** occur over HTTPS via Nginx and Let's Encrypt.
- **Secrets**: Do **not** commit the `.env` file to your remote repository.

---

## Maintenance & Updates

### 1. Adding/Editing Lessons
All curriculum content is stored as Markdown in the `book/` directory.
- **Structure**: `book/[part]/[chapter]/[page].md`
- **Updates**: Modify any file and trigger a rebuild for changes to reflect on the platform.

### 2. Monitoring User Progress
Admins can monitor real-time engagement and progress through the [Admin Dashboard](https://your-domain.com/admin). Use the credentials defined in Supabase/Auth.

### 3. User Onboarding
The automated pipeline fetches student applications from the external IDC endpoint. Access this via the **Onboarding** tab in the Admin table.

---

## 📚 Reference Materials

| Resource | Description |
|---|---|
| [Admin Guide (HTML)](./docs/manuals/html/AdminGuide.html) | Guide for program managers |
| [Supervisor Guide (HTML)](./docs/manuals/html/SupervisorGuide.html) | Guide for stakeholders |
| [Learner Guide (HTML)](./docs/manuals/html/LearnerGuide.html) | Guide for students |
| [API Reference](./docs/system_architecture.md) | Technical system overview |

---

**Prepared by Antigravity AI Engine**  
*Handover Date: 2026-04-08*
