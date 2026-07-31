# 🎯 Zenith Form — Typeform-style Form Builder SaaS

> **Portfolio Project** built to demonstrate full-stack software engineering depth, end-to-end type safety, monorepo architecture, and clean security practices.

---

## 🌟 Architecture & Tech Stack

Zenith Form is architected as a **pnpm Turborepo Monorepo**:

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons, `shadcn/ui` components.
* **Backend API**: Express.js with `trpc-to-openapi` and `@scalar/express-api-reference`.
* **API & Data Contracts**: tRPC v11 & Zod validation for 100% end-to-end type safety across client and server.
* **Database & ORM**: PostgreSQL with Drizzle ORM (using JSONB for dynamic field schemas & answers).
* **Authentication & Sessions**: Google OAuth 2.0 + Instant Demo Guest Login using HTTP-only JWT cookies.
* **Security & Privacy**: Strict resource ownership checks, salted SHA-256 IP hashing for rate-limiting, CORS origin isolation.

---

## 📁 Repository Structure

```text
zenith-form/
├── apps/
│   ├── api/             # Express API server (tRPC + OpenAPI endpoints)
│   └── web/             # Next.js 16 frontend web application
├── packages/
│   ├── database/        # Drizzle ORM models, migrations, & seed scripts
│   ├── logger/          # Shared logging utility
│   ├── services/        # Decoupled business logic domain services (Form, Field, Response, User)
│   └── trpc/            # Shared tRPC server routers, procedures & client proxies
└── docker-compose.yml   # PostgreSQL database container
```

---

## 🔑 Key Features

1. **Authentication & Instant Demo Access**:
   * Google OAuth 2.0 integration with automatic user profile creation.
   * Instant Guest Demo Login (`demo@zenithform.com`) requiring no credentials.
   * HTTP-only JWT cookies for secure session management.

2. **Form & Field CRUD with Ownership Checks**:
   * Create, update, publish, unpublish, and delete forms.
   * Add, edit, delete, and reorder questions with strict field-level ownership verification.
   * Supports 9 field types: `short_text`, `long_text`, `email`, `number`, `single_select`, `multi_select`, `checkbox`, `rating`, `date`.

3. **Public Response Submission Engine**:
   * Distraction-free Typeform-style step-by-step questionnaire UX.
   * Dynamic per-field validation mirroring backend validation rules.
   * In-memory rate limiting (5 submissions/min per form/IP).
   * Salted SHA-256 IP hashing for privacy-first spam protection.

4. **Analytics & Data Export**:
   * Real-time submission counter and per-field breakdown.
   * Option distribution percentages for choice questions & average rating calculations.
   * One-click CSV export generating downloadable `.csv` files.

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
* Node.js >= 18
* pnpm 9+
* Docker Desktop (for local PostgreSQL database)

### 2. Setup Environment Variables
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

### 3. Start PostgreSQL Database
```bash
docker-compose up -d
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Push Database Schema & Seed Sample Data
```bash
pnpm db:migrate
```

### 6. Run Local Development Server
```bash
pnpm dev
```

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`
* **Interactive Scalar API Docs**: `http://localhost:8000/docs`

---

## 🧪 Demo Credentials

For quick manual testing without configuring Google OAuth keys:
* Open `http://localhost:3000/login`
* Click **Instant Demo Access (Guest Login)**
* Logs in automatically as `demo@zenithform.com` with full creator permissions!

---

## 🔮 Scope Note & Future Improvements

To focus on architectural depth over feature count for job interviews, the following features were deliberately cataloged for future iterations:
* Password-protected & expiration-limited forms.
* Conditional branching logic (skip logic).
* Webhook notifications (Slack/Discord integrations).

---

## 📄 License
MIT License — Free to use.
