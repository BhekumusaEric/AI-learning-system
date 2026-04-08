# IOAI Training Grounds — Architecture & Separation of Concerns Guide

This guide outlines a scalable, maintainable architecture for the IOAI Training Grounds platform, emphasizing **Separation of Concerns (SoC)**. SoC means dividing the system into distinct, loosely coupled layers or modules, each responsible for a specific aspect. This ensures long-term maintainability, easier testing, and scalability.

---

## Why Separation of Concerns Matters

- **Maintainability**: Changes in one area (e.g., UI) don't affect others (e.g., data).
- **Scalability**: Components can be scaled independently (e.g., add more servers for code execution).
- **Testability**: Isolate and test individual concerns.
- **Team Collaboration**: Different teams can work on UI, backend, and content without conflicts.
- **Future-Proofing**: Easy to add features like user accounts, multiplayer coding, or advanced analytics.

---

## High-Level Architecture

The platform follows a **layered architecture** with clear boundaries:

```
┌─────────────────┐
│   Presentation  │  ← UI/UX (React/Next.js)
├─────────────────┤
│   Application   │  ← Business Logic (Hooks, Services)
├─────────────────┤
│     Domain      │  ← Core Logic (Lesson Management, Validation)
├─────────────────┤
│ Infrastructure  │  ← Data & External Services (Supabase, Pyodide)
└─────────────────┘
```

- **Presentation Layer**: Handles user interface and interactions.
- **Application Layer**: Orchestrates workflows (e.g., running code, saving progress).
- **Domain Layer**: Core business rules (e.g., lesson validation, progress tracking).
- **Infrastructure Layer**: External dependencies (databases, APIs, code execution).

### Data Flow Example
1. User clicks "Run Code" (Presentation).
2. Application layer calls code execution service.
3. Domain layer validates input/output.
4. Infrastructure layer runs Pyodide and stores results.

---

## Detailed Layer Breakdown

### 1. Presentation Layer (UI/UX)
**Concern**: User interface, rendering, interactions.

**Technologies**: Next.js, React, Tailwind CSS, Monaco Editor.

**Structure**:
- **Pages**: `/pages` in Next.js (e.g., `/lesson/[id]` for individual pages).
- **Components**: Reusable UI pieces (e.g., `Sidebar.js`, `CodeEditor.js`, `ProgressBar.js`).
- **Hooks**: Custom React hooks for state (e.g., `useLessonProgress`, `useCodeExecution`).

**SoC**: No business logic here — just rendering and event handling. Data comes from hooks/services.

**Scalability**: Use lazy loading for components, optimize with React.memo for large lists.

### 2. Application Layer (Orchestration)
**Concern**: Coordinating actions between layers.

**Technologies**: React Hooks, Context API, or Zustand for state management.

**Structure**:
- **Services**: Functions that call domain/infrastructure (e.g., `lessonService.js`, `progressService.js`).
- **Hooks**: Bridge UI to services (e.g., `useRunCode` hook that calls Pyodide).

**SoC**: Handles "what to do" (e.g., "run code and update progress") but not "how" (implementation details).

**Scalability**: Serverless functions (Vercel API routes) for heavy lifting, like batch processing.

### 3. Domain Layer (Business Logic)
**Concern**: Core rules, validation, algorithms.

**Technologies**: Plain JavaScript/TypeScript (no UI dependencies).

**Structure**:
- **Models**: Data structures (e.g., `Lesson.js`, `UserProgress.js`).
- **Validators**: Functions for checking code/output (e.g., `validateCode.js`).
- **Utils**: Reusable logic (e.g., `markdownParser.js`, `progressCalculator.js`).

**SoC**: Pure functions, no side effects. Easy to unit test.

**Scalability**: Extract to microservices if needed (e.g., a separate validation service).

### 4. Infrastructure Layer (External Dependencies)
**Concern**: Data persistence, external APIs, code execution.

**Technologies**: Supabase/Firebase, Pyodide, Local Storage.

**Structure**:
- **Repositories**: Data access (e.g., `lessonRepository.js` for fetching Markdown).
- **APIs**: Wrappers for external services (e.g., `pyodideWrapper.js`).
- **Storage**: Abstractions for persistence (e.g., `progressStorage.js`).

**SoC**: Abstracts external details — domain layer doesn't know if data comes from local files or a database.

**Scalability**: Swap implementations (e.g., from local storage to Supabase) without changing upper layers.

---

## Key Architectural Patterns

### 1. Component-Based Architecture (Frontend)
- **Why**: React's strength — reusable, testable components.
- **Example**: `CodeEditor` component handles editing, but delegates execution to a service.

### 2. Service Layer Pattern
- **Why**: Centralize business logic calls.
- **Example**: `CodeExecutionService` handles Pyodide setup and error handling.

### 3. Repository Pattern
- **Why**: Abstract data sources.
- **Example**: `LessonRepository` can load from GitHub API or local files.

### 4. Dependency Injection
- **Why**: Make layers testable and swappable.
- **Example**: Pass services as props/hooks to components.

### 5. Event-Driven (Optional)
- **Why**: For complex interactions (e.g., real-time code sharing).
- **Example**: Use WebSockets or Supabase real-time for collaborative features.

---

## 📈 Scalability Considerations

### Short-Term (Free Tier)
- **Static Content**: Host Markdown on CDN (Vercel/Netlify).
- **Client-Side Execution**: Pyodide runs in browser — no server load.
- **Caching**: Use Next.js ISR for lesson pages.

### Medium-Term (Growth)
- **Serverless Functions**: Move heavy logic (e.g., code validation) to Vercel functions.
- **Database**: Upgrade to Supabase paid tier for more users.
- **CDN**: Distribute assets globally.

### Long-Term (High Scale)
- **Microservices**: Split into services (e.g., one for content, one for execution).
- **Containerization**: Use Docker for consistent deployments.
- **Load Balancing**: Distribute traffic across regions.

### Performance Tips
- **Lazy Loading**: Load components/pages on demand.
- **Code Splitting**: Split bundles by route.
- **Caching**: Cache lesson content and user progress.

---

## Adding New Features

### Process
1. **Identify Concern**: Which layer does it belong to?
2. **Design Interface**: Define contracts (e.g., service methods).
3. **Implement**: Start with domain/infrastructure, then application, then presentation.
4. **Test**: Unit tests for each layer, integration tests for flows.

### Example: Adding User Accounts
- **Domain**: `User.js` model, `authValidator.js`.
- **Infrastructure**: Supabase auth integration.
- **Application**: `authService.js`, `useAuth` hook.
- **Presentation**: Login component, protected routes.

### Example: Adding Collaborative Coding
- **Domain**: `Session.js` for shared code.
- **Infrastructure**: WebSocket or Supabase real-time.
- **Application**: `collaborationService.js`.
- **Presentation**: Multi-user editor with cursors.

---

## 🧪 Testing Strategy

- **Unit Tests**: Test each layer in isolation (Jest for React, Mocha for Node).
- **Integration Tests**: Test layer interactions (e.g., service + repository).
- **E2E Tests**: Full user flows (Playwright or Cypress).
- **CI/CD**: Run tests on GitHub Actions for every PR.

---

## 📚 Resources

- **Clean Architecture**: Book by Robert C. Martin.
- **Next.js Docs**: For routing and SSR patterns.
- **React Patterns**: For component organization.
- **Microservices**: If scaling to multiple services.

---

This architecture ensures the platform remains maintainable as it grows. Start with the layered approach, and refactor as needed. For implementation details, see `SYLLABUS_DEVELOPER_GUIDE.md` and `FREE_TECH_STACK.md`.