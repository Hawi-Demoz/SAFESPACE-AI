# SafeSpace AI - Digital Violence Early-Warning & Survivor Support System

## Overview

SafeSpace AI is a comprehensive web application designed to protect women and girls from digital violence through real-time harm detection, secure evidence collection, and survivor support resources. The system provides AI-powered toxicity detection, encrypted evidence storage, analytics dashboards, and access to safety resources and emergency support services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application uses a **modern React-based single-page application (SPA)** architecture:

- **React 19** with TypeScript for type-safe component development
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- **Framer Motion** for animations and transitions
- **Tailwind CSS v4** for utility-first styling with custom design tokens
- **Shadcn/UI** component library built on Radix UI primitives for accessible, customizable components

**Design Decisions:**
- Chose Wouter over React Router for its minimal bundle size and simple API, critical for performance on potentially low-bandwidth connections
- TanStack Query handles all API communication with automatic retries, caching, and background refetching to ensure data consistency
- Component-driven architecture with reusable UI primitives from Shadcn/UI to maintain design consistency
- Dark mode as default with calming purple/lilac color scheme designed for trauma-informed UX

### Backend Architecture

The backend follows an **Express.js REST API** pattern:

- **Express.js** HTTP server with TypeScript
- **RESTful API endpoints** for toxicity analysis, evidence storage, analytics, and resources
- **In-memory storage abstraction** via `IStorage` interface for database operations
- **Simple keyword-based ML classifier** for toxicity detection (proof-of-concept implementation)

**Design Decisions:**
- Storage abstraction layer (`IStorage` interface) allows swapping between in-memory and persistent database implementations without changing business logic
- Synchronous toxicity detection using weighted keyword matching and pattern analysis enables offline capability and zero-latency responses
- Express middleware pattern for request logging and error handling
- Separation of routes, storage, and ML logic into distinct modules for maintainability

**Toxicity Detection Algorithm:**
The system uses a rule-based classifier with:
- Category-specific keyword dictionaries (harassment, threats, sexual coercion, hate, identity attacks, manipulation)
- Context amplifiers and mitigators for confidence scoring
- Weighted scoring system with configurable thresholds
- Real-time analysis without external API dependencies

### Data Storage

**Database:** PostgreSQL via Neon serverless

**ORM:** Drizzle ORM with TypeScript schema definitions

**Schema Design:**
- `evidence` table: Stores encrypted content with metadata (type, size, timestamps)
- `analytics` table: Daily aggregated metrics (toxic/safe counts, category breakdowns)
- `resources` table: Support resources with categorization (emergency, education, support)

**Design Decisions:**
- Client-side encryption for evidence before transmission (zero-knowledge architecture)
- JSONB columns for flexible metadata and category statistics storage
- Date-based partitioning strategy for analytics to enable efficient time-range queries
- Serial primary keys for simplicity; could migrate to UUIDs for distributed systems

**Encryption Strategy:**
- Evidence content encrypted client-side using simulated AES (demo uses base64 encoding with marker)
- Production implementation would use Web Crypto API (`crypto.subtle.encrypt`) with AES-GCM
- Encryption keys managed client-side only (zero-knowledge principle)

### Authentication & Authorization

**Current State:** No authentication implemented (hackathon MVP scope)

**Planned Architecture:**
- Session-based authentication with `express-session` and `connect-pg-simple`
- User accounts for personalized evidence lockers and analytics
- Role-based access control for admin resource management

### Browser Extension Architecture

**Basic Chrome/Firefox Extension** (Manifest V3 compatible):

- `content.js`: Content script for page scanning and real-time detection
- `popup.html`: Quick action interface for reporting and evidence capture
- Minimal permissions (`activeTab`, `scripting`, `storage`)

**Design Decisions:**
- Manifest V3 compliance for Chrome Web Store approval
- Content scripts run in isolated context for security
- Periodic scanning (5-second intervals) balances detection speed with performance
- Proof-of-concept uses simple keyword matching; production would integrate with backend ML API

### Build System

**Development:**
- Vite for fast HMR and development server
- esbuild for server-side bundling
- Concurrent client/server development via separate npm scripts

**Production:**
- Client build outputs to `dist/public`
- Server bundles to single `dist/index.cjs` file with allowlisted dependencies
- Static file serving for SPA with fallback to `index.html`

**Design Decisions:**
- Bundling frequently-used server dependencies reduces cold start times (important for serverless deployment)
- Vite provides superior DX with instant HMR and optimized production builds
- Custom plugins for Replit-specific functionality (error overlay, dev banner, meta image updates)