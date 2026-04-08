# SAAIO Training Grounds

Welcome to the SAAIO Training Grounds, a professional interactive learning platform designed for high-end AI and Python education. This repository contains the complete system, including the integrated curriculum, student tracking, and administrative oversight tools.

## Getting Started

Follow these three simple steps to run the platform on your local machine:

1. **Install Dependencies**: Open your terminal in this folder and run:
   ```bash
   npm install
   ```
2. **Configure Environment**: Copy the provided `.env.example` file to a new file named `.env` and fill in your keys (see the Handover Guide for details).
3. **Run the Platform**: Start the development server with:
   ```bash
   npm run dev
   ```
   *You can now view the platform at: http://localhost:3000*

---

## Documentation Portal

## Reference Materials

For a complete interactive experience, visit the **[Documentation Portal (http://localhost:3000/docs)](http://localhost:3000/docs)**.

| Resource | Description |
|---|---|
| [Admin Guide (HTML)](/manuals/AdminGuide.html) | Guide for program managers |
| [Supervisor Guide (HTML)](/manuals/SupervisorGuide.html) | Guide for stakeholders |
| [Learner Guide (HTML)](/manuals/LearnerGuide.html) | Guide for students |
| [System Architecture](/docs/ARCHITECTURE_GUIDE.md) | Technical system overview |

---

## Project Structure

- **book/** — Contains all the educational content (Markdown format).
- **docs/** — Technical documentation, deployment guides, and user manuals.
- **src/** — The source code for the platform's frontend and backend.
- **postman/** — Pre-configured API collections for testing.

---

## Deployment & Handover

For detailed instructions regarding the AWS EC2 deployment and high-level technical maintenance, please refer to the:
**[Handover Guide (HANDOVER.md)](./HANDOVER.md)**

---

**Professional Grade Educational Infrastructure**  
*Last Updated: 2026-04-08*
