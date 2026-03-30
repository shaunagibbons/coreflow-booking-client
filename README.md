# CoreFlow Booking Client

A React single-page application for a Pilates studio booking system. Users can browse classes, manage bookings, and maintain their profiles through a responsive interface that communicates with a Django REST API backend.

## Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Features](#features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Use of AI in Development](#use-of-ai-in-development)

## Architecture

This frontend is the presentation layer in a three-tier enterprise architecture:

| Layer | Technology | Repository |
|-------|-----------|------------|
| **Presentation** | React SPA (this repo) | `coreflow-booking-client` |
| **Middleware** | Django REST API with JWT auth | `coreflow-booking-api` |
| **Data** | PostgreSQL | Managed by the API layer |

The frontend never accesses the database directly. All data flows through the REST API using Axios with automatic JWT token management and silent token refresh.

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 with TypeScript (strict mode) |
| Build Tool | Vite 6 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios with request/response interceptors |
| Styling | CSS Modules + CSS custom properties (no external UI library) |
| Notifications | react-hot-toast |
| Testing | Vitest, React Testing Library, jsdom |
| Linting | ESLint 9 with TypeScript and React plugins |

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** (included with Node.js)
- The [coreflow-booking-api](https://github.com/your-org/coreflow-booking-api) backend running locally or accessible at a deployed URL

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd coreflow-booking-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `VITE_API_BASE_URL` to the backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application runs at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server on port 5173 |
| `npm run build` | Type-check with TypeScript and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run all tests once with Vitest |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components (Button, Input, Modal, Spinner, Alert, Badge, Pagination)
│   ├── layout/           # Page layout components (Navbar, Layout, PageHeader, Footer)
│   ├── ProtectedRoute    # Route guard — redirects unauthenticated users to login
│   ├── PublicOnlyRoute    # Route guard — redirects authenticated users to dashboard
│   ├── ClassCard          # Class listing card
│   ├── BookingCard        # Booking display card
│   └── ClassFilters       # Class search/filter controls
├── pages/                 # Route-level page components
│   ├── DashboardPage      # Main dashboard (protected)
│   ├── ClassListPage      # Browse classes with filters (protected)
│   ├── ClassDetailPage    # Single class view with booking action (protected)
│   ├── BookingsPage       # User's bookings list (protected)
│   ├── ProfilePage        # Profile editing and password change (protected)
│   ├── LoginPage          # User login (public only)
│   ├── RegisterPage       # User registration (public only)
│   ├── ForgotPasswordPage # Password reset request (public only)
│   ├── ResetPasswordPage  # Password reset confirmation (public only)
│   └── NotFoundPage       # 404 catch-all
├── data/                  # API integration layer
│   ├── api.ts             # Axios instance, token storage, interceptors
│   ├── authService.ts     # Authentication endpoints
│   ├── classService.ts    # Class CRUD endpoints
│   ├── bookingService.ts  # Booking CRUD endpoints
│   └── types.ts           # Shared TypeScript interfaces
├── context/
│   └── AuthContext.tsx     # Global authentication state (React Context)
├── hooks/
│   ├── useApi.ts          # Generic data-fetching hook with loading/error states
│   └── useForm.ts         # Form state management with validation
├── utils/
│   └── errors.ts          # API error parsing utilities
├── styles/
│   └── global.css         # CSS custom properties and base styles
├── test/
│   └── setup.ts           # Vitest setup (imports jest-dom matchers)
├── App.tsx                # Root component with route definitions
└── main.tsx               # Application entry point
```

## Features

### Authentication
- JWT-based login and registration
- Silent access token refresh via Axios response interceptor
- Protected and public-only route guards
- Password reset flow (request via email, confirm with token)

### Class Browsing
- Paginated class listing with filters (date range, location, availability, search)
- Detailed class view showing instructor, schedule, capacity, and booking availability

### Booking Management
- Create bookings from class detail pages
- View upcoming and past bookings with status badges (pending, confirmed, cancelled)
- Cancel bookings with confirmation

### Profile Management
- View and edit personal details (name, phone number)
- Change password

### UI Components
All UI components are built from scratch using CSS Modules — no external component library. The design system uses CSS custom properties defined in `src/styles/global.css` for consistent colours, spacing, and typography across the application.

## Testing

### Framework and Tools

Tests use **Vitest** as the test runner with **React Testing Library** for component rendering and interaction, and **jsdom** as the browser environment.

| Library | Purpose |
|---------|---------|
| `vitest` | Test runner and assertion framework |
| `@testing-library/react` | Component rendering and DOM queries |
| `@testing-library/user-event` | Simulating realistic user interactions |
| `@testing-library/jest-dom` | Custom DOM matchers (`toBeInTheDocument`, `toBeDisabled`, etc.) |
| `jsdom` | Browser-like DOM environment for Node.js |

### Configuration

Test configuration lives in `vitest.config.ts`:
- **Environment:** jsdom
- **Globals:** enabled (no need to import `describe`, `it`, `expect`)
- **Setup file:** `src/test/setup.ts` (loads jest-dom matchers)
- **CSS Modules:** non-scoped class name strategy for testability

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch
```

### Test Coverage

Tests cover the following areas:

**UI Components** — Button, Modal, Badge, and Spinner are tested for rendering, user interaction, prop behaviour, accessibility attributes, and loading/disabled states.

**API Services** — `authService`, `classService`, and `bookingService` are tested by mocking the Axios instance and verifying correct endpoint calls, request payloads, token storage side effects, and response handling.

**Route Guards** — `ProtectedRoute` and `PublicOnlyRoute` are tested for correct redirect behaviour based on authentication state.

**Page Components** — `LoginPage` is tested for form rendering, validation, submission, and error display.

**Utilities** — Error parsing functions are tested for extracting user-friendly messages from various API error response shapes.

### Testing Patterns

- **Component tests** render with `@testing-library/react`, query the DOM by accessible roles and text, and simulate user events with `userEvent`.
- **Service tests** mock the Axios instance using `vi.mock()` and `vi.mocked()`, then assert on call arguments and return values.
- **Route guard tests** wrap components in a mock `AuthContext` provider and `MemoryRouter` to verify navigation behaviour.

## Deployment

The application is deployed to **Render** as a static site.

**Build command:** `npm run build`
**Publish directory:** `dist/`

The `public/_redirects` file contains the SPA routing rule that directs all paths to `index.html`, enabling client-side routing in production.

Environment variables (such as `VITE_API_BASE_URL`) must be configured in the Render dashboard as they are embedded at build time by Vite.

## Use of AI in Development

AI tools (specifically **Claude**, Anthropic's AI assistant) were used during the development of this project to support two areas: **generating test cases** and **building the UI component framework**. All AI-generated output was reviewed, refined, and understood by the developer before being committed to the codebase.

### Test Case Generation

AI was used to accelerate the creation of unit and integration tests across the project. The process followed was:

1. **Prompt with context** — The developer provided AI with the source component or service code and described the testing objectives (e.g., "write tests for the Button component covering all prop variants and user interactions").
2. **Review generated tests** — Each generated test was read and understood to confirm it tested meaningful behaviour rather than implementation details, used correct Testing Library queries (preferring accessible roles over CSS selectors), and matched the project's Vitest configuration.
3. **Refine and adapt** — Tests were adjusted where needed to align with actual component APIs, fix incorrect assumptions, and ensure consistency with the project's mocking patterns (e.g., the shared `vi.mock('@/data/api')` pattern for service tests).
4. **Verify** — All tests were run locally to confirm they passed before committing.

AI assistance was particularly valuable for generating comprehensive edge-case coverage (loading states, disabled states, error responses) and ensuring consistent testing patterns across similar components and services.

### UI Component Framework

AI was used to support the development of the custom UI component library in `src/components/ui/`. The process followed was:

1. **Design specification** — The developer described the required component behaviour, variants, and accessibility requirements (e.g., "create a Button component with primary/secondary/danger/ghost variants, small/medium/large sizes, and a loading state with spinner").
2. **Review generated code** — Each component was reviewed for correct TypeScript typing, semantic HTML usage, accessibility (ARIA attributes, keyboard navigation), and CSS Module integration.
3. **Refine styling and structure** — CSS Module styles were adjusted to match the project's design system (CSS custom properties in `global.css`), and component APIs were refined for consistency across the library.
4. **Integration testing** — Components were tested in context within page-level components to verify they worked correctly within the application's routing and state management.

The same review-and-refine workflow applied to page components, the API service layer, custom hooks (`useApi`, `useForm`), and the authentication context. In every case, the developer maintained full understanding of the code and made deliberate decisions about what to accept, modify, or rewrite.

### Why This Approach

Using AI as a development accelerator — rather than a black-box code generator — allowed the project to maintain:

- **Code consistency** — AI suggestions were guided by established project patterns, and the developer enforced those patterns during review.
- **Developer understanding** — No code was committed without the developer understanding its purpose and mechanics.
- **Quality assurance** — AI-generated tests caught edge cases the developer might have missed, while developer review caught incorrect assumptions the AI made about component APIs or backend response shapes.
