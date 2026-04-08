# Onboarding Pipeline: Simple Guide

The **Onboarding Pipeline** is a tool that automates the process of turning student applications into active accounts. It replaces manual data entry with a single-click "activation" flow.

## How to use it

1.  **Open the Admin Panel**: Log in as an admin and go to the dashboard.
2.  **Go to "Onboarding"**: Click the **Onboarding** tab at the top.
3.  **Fetch Data**: The list of applications from the AWS API will load automatically.
4.  **Review the Groups**: Students are grouped by their **Program** and **Location** (e.g., *Work Readiness - Johannesburg*).
5.  **Activate Cohort**: 
    - Click the **Activate Cohort** button on a group.
    - Confirm the action.
    - **What happens next**: The system creates a new cohort, registers all students, and sends them their login details via email instantly.

## ⚠️ Important Features

### 1. Duplicate Handling
If a student has applied more than once with the same email, they will be moved to a **"Duplicates Flagged"** section. 
- You can still onboard them, but it’s a warning to check if they already have an account.

### 2. Automatic Cohort Naming
When you activate a group, the cohort is named automatically using the format:  
`City - Date` (e.g., `Pretoria - 2026-04-07`).

### 3. Immediate Login Delivery
As soon as you click activate, the students receive a professional email with:
- Their unique **Login ID**
- A secure **Password**
- A link to the login page.

## 🛠 Under the Hood (Technical)

- **Source API**: Data is fetched from an external AWS API Gateway.
- **Security**: Authentication is handled via the `X-Origin-Verify` header.
- **Architecture**:
    - `src/lib/applications.ts`: Handles the grouping and cleaning of data.
    - `/api/admin/applications`: Fetches the remote data.
    - `/api/admin/onboard`: Creates the database records and triggers emails via **Resend**.

---

*This pipeline is designed to reduce manual labor so you can focus on training rather than data entry!*
