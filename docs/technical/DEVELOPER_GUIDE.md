# Developer Guide: SAAIO Training Grounds

Welcome to the technical implementation guide for the SAAIO Training Grounds. This document provides a comprehensive overview of the architecture, development environment, and deployment workflows.

## System Architecture

The ecosystem utilizes a **Hybrid Cloud Architecture** that integrates high-performance cloud processing with robust student data persistence.

### Next.js Core Application
- **Frontend**: Built with React 19 and Vanilla CSS.
- **Backend API**: Serverless App Router for optimized compute distribution.
- **State Management**: Local browser storage for instantaneous student progress feedback.
- **Source of Truth**: PostgreSQL (Supabase) for cross-session data consistency.

### Mobile and Edge API
- **Host Environment**: AWS EC2 instance running Express.js.
- **Functionality**: Minimalist, low-latency API handling for mobile progress synchronization and notification delivery.

---

## Development Environment Setup

### Prerequisites
- **Runtime**: Node.js v20+
- **Database**: PostgreSQL (Supabase)
- **SMTP**: Resend API Service Account

### Installation Workflow
1. **Repository Synchronization**:
   ```bash
   git clone https://github.com/BhekumusaEric/AI-learning-system.git
   ```
2. **Dependency Management**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   - Create a `.env.local` file in the root directory.
   - Populate variables for `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY`.
4. **Development Execution**:
   ```bash
   npm run dev
   ```

---

## Data Schema Overview

All persistent data is managed within the **Supabase** ecosystem.

### Core Entities
- **Cohorts**: Table `cohorts` stores naming, location, and global platform associations.
- **Learners**: Segregated tables (`saaio_students`, `dip_students`, `wrp_students`) maintain unique profiles and authentication hashes.
- **Progress Matrix**: JSONB columns store lesson completion states and assessment scores per platform.

---

## Deployment Procedures

### Frontend and Web API
- Hosted on **Vercel** for automatic scaling and distribution.
- Automatic deployments are triggered upon merging changes to the `main` branch.

### Mobile Services
- Deployed to **AWS EC2** using `pm2` for continuous execution.
- Reference the separate `docs/ec2_api_setup.md` for specific command-line instructions during the migration phase.

---

> [!NOTE]
> **Administrative Security**: All administrative endpoints verify the `admin_session` cookie against the `ADMIN_PASSWORD` defined in the environment. For local testing, ensure the cookie is present before initiating administrative requests.
