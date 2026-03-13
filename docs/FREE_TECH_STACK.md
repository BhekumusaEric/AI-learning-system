# IOAI Training Grounds — Free Tech Stack & Hosting Guide

This guide outlines a **completely free** tech stack and hosting setup for building the IOAI Training Grounds platform, based on the UI/UX design in `UI_UX_DESIGN.md`. No paid services or tools are required — everything uses open-source software, free tiers, and community-supported platforms.

---

## 🎯 Overview

The platform is a **static/dynamic web app** with:
- Frontend: Interactive UI for lessons and code editing.
- Code execution: Browser-based Python sandbox.
- Hosting: Free static site hosting with serverless functions.
- Integrations: Free CI/CD and version control.

**Total cost**: $0 (using free tiers and open-source tools).

---

## 🛠️ Recommended Free Tech Stack

### 1. Frontend Framework
- **Next.js** (React-based): Free, open-source framework for building the UI.
  - Handles routing, SSR, and static generation.
  - Install: `npm install next react react-dom`
  - Why free: MIT license, no costs.

- **React**: Core library for components (navigation, editors, etc.).
  - Free, open-source.

### 2. Code Editor & Execution
- **Monaco Editor**: Free, embeddable code editor (same as VS Code).
  - Add via npm: `npm install @monaco-editor/react`
  - Handles syntax highlighting, IntelliSense for Python.

- **Pyodide**: Free, WebAssembly-based Python runtime for browsers.
  - Runs Python code client-side without a server.
  - Load from CDN: `https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js`
  - Execute user code in a sandboxed environment.

### 3. Styling & UI Components
- **Tailwind CSS**: Free utility-first CSS framework.
  - Install: `npm install -D tailwindcss`
  - Matches the design system (colors, spacing) from `UI_UX_DESIGN.md`.

- **Headless UI**: Free React components (e.g., for dropdowns, modals).
  - Install: `npm install @headlessui/react`

### 4. State Management & Persistence
- **Local Storage**: Free (built-in browser API) for progress tracking.
- **Supabase** (free tier): For optional user accounts/progress sync.
  - Free: 500MB database, 50MB file storage, 50,000 monthly active users.
  - Alternative: Firebase free tier (similar limits).

### 5. Build & Development Tools
- **Node.js & npm**: Free, required for Next.js.
- **Git**: Free version control.
- **VS Code**: Free IDE for development.

---

## 🌐 Free Hosting Platforms

### Primary Hosting: Vercel
- **Free tier**: Unlimited static sites, 100GB bandwidth/month, serverless functions.
- **Why it fits**: Perfect for Next.js apps, automatic deployments from GitHub.
- **Setup**: Connect GitHub repo → Deploy automatically on pushes.
- **Domain**: Free subdomain (e.g., `yourapp.vercel.app`), or use custom domain (free via services like Freenom).

### Alternatives
- **Netlify**: Free tier: 100GB bandwidth, 300 build minutes/month, form handling.
  - Great for static sites, supports Next.js.
- **GitHub Pages**: Free for public repos, static sites only (no serverless functions).
  - Use with Next.js export mode for static generation.
- **Render**: Free tier: 750 hours/month for web services, static sites.
  - Good for full-stack if needed.

**Recommendation**: Start with Vercel for its Next.js integration and ease of use.

---

## 🔗 Free Integration Services

### 1. Version Control & Collaboration
- **GitHub**: Free for public repos (unlimited collaborators).
  - Host code, issues, pull requests.
  - Use for the syllabus content (`book/` folder).

### 2. CI/CD (Continuous Integration)
- **GitHub Actions**: Free for public repos (2,000 minutes/month).
  - Automate testing: Run `course_runner.py --student --run-all` on PRs.
  - Deploy to Vercel/Netlify on merges.

### 3. Analytics & Monitoring
- **Vercel Analytics**: Free (built-in with Vercel hosting).
- **Google Analytics**: Free tier (up to 10M hits/month).
- **Sentry**: Free tier (5,000 events/month) for error tracking.

### 4. Content Management
- **GitHub**: Edit Markdown files directly or via PRs.
- **Netlify CMS**: Free, open-source CMS for Markdown content (integrates with Netlify).

### 5. Email & Notifications
- **GitHub Issues**: Free for user feedback.
- **Discord/Webhooks**: Free community channels for support.

---

## 🚀 Getting Started Guide

### Step 1: Set Up Development Environment
1. Install Node.js (free from nodejs.org).
2. Install Git (free from git-scm.com).
3. Clone the repo: `git clone https://github.com/yourusername/ioai-training-grounds.git`
4. Install dependencies: `npm install`

### Step 2: Build the App
1. Start dev server: `npm run dev` (runs on localhost:3000).
2. Implement components based on `UI_UX_DESIGN.md`:
   - Navigation sidebar with parts/chapters.
   - Markdown renderer for pages.
   - Monaco editor for code.
   - Pyodide integration for execution.

### Step 3: Deploy for Free
1. Create a Vercel account (free).
2. Connect your GitHub repo.
3. Deploy: Vercel auto-builds on pushes.
4. Access at `https://yourapp.vercel.app`.

### Step 4: Add CI/CD
1. In GitHub repo, add `.github/workflows/ci.yml`:
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-python@v4
           with: python-version: '3.9'
         - run: python3 course_runner.py --student --run-all
   ```
2. This runs the student mode tests on every push/PR.

---

## ⚠️ Limitations of Free Tiers

- **Bandwidth/Usage**: Vercel/Netlify free tiers have limits (e.g., 100GB/month). Monitor usage.
- **Serverless Functions**: Vercel free: 100GB-hours/month. Avoid heavy computation.
- **Database**: Supabase free: 500MB storage. For progress tracking, use local storage primarily.
- **Custom Domains**: Free subdomains; paid for custom (or use free services like Freenom).
- **Support**: Community forums (no dedicated support).
- **Scalability**: Free tiers may slow down with high traffic; upgrade if needed.

---

## 📚 Resources & Learning

- **Next.js Docs**: nextjs.org/docs
- **Pyodide Guide**: pyodide.org/en/stable/
- **Tailwind CSS**: tailwindcss.com/docs
- **Vercel Docs**: vercel.com/docs
- **Free Hosting Comparison**: Compare at jamstack.org/generators/

---

This stack gets you a fully functional, professional platform at zero cost. Start small, deploy early, and iterate based on user feedback. For questions, check the `SYLLABUS_DEVELOPER_GUIDE.md` or open a GitHub issue.