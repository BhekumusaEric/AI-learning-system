# Unified Training Grounds Platform

A native AWS-hosted educational platform providing integrated curriculum delivery, student tracking, and administrative oversight for multiple organizational entities. This system handles high-scale interactive learning across three distinct programs.

---

## Organizational Structure

This repository serves as a unified core for two primary organizations, each maintaining distinct platform ownership and educational objectives:

### 1. SAAIO (South African AI Opportunity)
SAAIO provides the primary AI and Python foundations curriculum. This platform is designed for deep-tech upskilling, featuring integrated code execution environments (Pyodide) and milestone tracking.

### 2. WeThinkCode_
WeThinkCode_ owns and manages the following specialized programs within the system:
*   **Digital Inclusion Program (DIP)**: Focused on foundational digital literacy and community upskilling.
*   **Work Readiness Program (WRP)**: Focused on final-stage career preparation and industry integration.

---

## Live Access

The production environment is hosted on Amazon CloudFront. Access the specific program portals via the links below:

*   **SAAIO Portal**: [https://dy53b7j1euf9d.cloudfront.net/saaio/login](https://dy53b7j1euf9d.cloudfront.net/saaio/login)
*   **DIP Portal**: [https://dy53b7j1euf9d.cloudfront.net/dip/login](https://dy53b7j1euf9d.cloudfront.net/dip/login)
*   **WRP Portal**: [https://dy53b7j1euf9d.cloudfront.net/wrp/login](https://dy53b7j1euf9d.cloudfront.net/wrp/login)
*   **Administrative Dashboard**: [https://dy53b7j1euf9d.cloudfront.net/saaio/admin](https://dy53b7j1euf9d.cloudfront.net/saaio/admin)

---

## Technical Architecture

The platform has been migrated from legacy services to a high-fidelity, native Amazon Web Services (AWS) ecosystem:

*   **Database**: Amazon RDS (PostgreSQL) with strict SSL enforcement.
*   **Backend**: Next.js (Serverless) deployed via AWS Lambda.
*   **Infrastructure**: Managed via Serverless Stack (SST) and OpenNext.
*   **Messaging**: Integrated Resend API for transactional student verification and notifications.

For detailed architectural diagrams, refer to the [Architecture Guide](docs/ARCHITECTURE_GUIDE.md).

---

## Getting Started

### Prerequisites
*   Node.js 20.x or higher
*   AWS CLI configured (for infrastructure management)
*   Amazon RDS SSL Root Certificate (`global-bundle.pem`)

### Local Development
1.  **Clone the repository and install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Configuration**:
    Configure your `.env` file with the required database and authentication secrets. Refer to `docs/AWS_NATIVE_DEPLOYMENT.md` for specific key requirements.
3.  **Launch the Development Server**:
    ```bash
    npm run dev
    ```
    The local environment will be accessible at `http://localhost:3000`.

---

## CI/CD and Deployment

The project utilizes a multi-stage GitHub Actions pipeline for strictly validated deployments:
*   **Validation**: Automated linting and TypeScript type-checking.
*   **Smoke Testing**: Automated infrastructure health and database connectivity checks.
*   **Automated Deployment**: Native AWS deployment via SST to `staging` and `production` environments.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*© 2026 Bhekumusa Eric Ntshwenya. All Rights Reserved.*
