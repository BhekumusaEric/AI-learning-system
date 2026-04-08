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

## Automated Deployment Suite

For an automated, guided deployment today, you can use the built-in scripts located in `scripts/deploy/`.

1. **Setup Environment**: Automatically generates your production `.env` file by prompting for mandatory keys.
   ```bash
   bash scripts/deploy/setup_env.sh
   ```
2. **Master Deploy**: Orchestrates the environment setup and pushes the latest code to EC23. **Build Command**: 
   ```bash
   npm install
   npm run build
   # The standalone entry point for deployment is:
   pm2 start .next/standalone/server.js --name "saaio-grounds"
   ```

---

## Security Mandates (CRITICAL)

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

## Reference Materials

For a complete interactive experience, visit the **[Documentation Portal (http://localhost:3000/docs)](http://localhost:3000/docs)**.

| Resource | Description |
|---|---|
| [Admin Guide (HTML)](/manuals/AdminGuide.html) | Guide for program managers |
| [Supervisor Guide (HTML)](/manuals/SupervisorGuide.html) | Guide for stakeholders |
| [Learner Guide (HTML)](/manuals/LearnerGuide.html) | Guide for students |
| [System Architecture](/docs/ARCHITECTURE_GUIDE.md) | Technical system overview |

---

**Prepared by Antigravity AI Engine**  
*Handover Date: 2026-04-08*
