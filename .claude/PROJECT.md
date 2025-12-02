# Hire Me, Wonderful AI - Project Overview

> **Last Updated:** 2025-12-02
> **Status:** Active Development
> **Version:** 0.1.0

## Quick Start for AI Agents

**Read these files in order:**
1. `.claude/PROJECT.md` (this file) - Project overview
2. `.claude/ARCHITECTURE.md` - System architecture & data flows
3. `.claude/CURRENT_STATE.md` - What's implemented vs planned
4. `.claude/PROMPTS.md` - AI evaluation prompts (critical for screening logic)
5. `.claude/CONVENTIONS.md` - Code style & patterns

---

## What This Project Does

**Hire Me, Wonderful AI** is an AI-powered candidate screening system that:

1. **Ingests** LinkedIn profile data (JSON from Apify scraper)
2. **Enriches** company information using Tavily search API
3. **Evaluates** candidates using Claude Opus 4.5 against CTO criteria
4. **Presents** PASS/REJECT decisions with reasoning in a dashboard

### The Problem It Solves

Manual screening of 100+ LinkedIn candidates for CTO positions takes 20-30 hours. This tool reduces that to 2-3 hours with 90%+ accuracy.

### Target User

**Dvir** - Developer & Hiring Manager at Wonderful AI, screening Local CTO candidates for global expansion.

---

## The CTO Role Being Hired For

Wonderful AI needs **Local CTOs** who:
- Are technical leaders from day one (60% still coding)
- Lead sales engineering and build teams
- Present AI architecture to enterprise customers
- Must be hands-on with AI/ML technologies
- High EQ, charismatic, customer-facing

**This is NOT a pure executive role.** We reject "executive drift" candidates.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5+ |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 with PG adapter |
| Validation | Zod schemas |
| Styling | Tailwind CSS |
| AI Provider | OpenRouter (Claude Opus 4.5) |
| Search API | Tavily |
| Deployment | Vercel |

---

## Key Directories

```
/
├── .claude/          # AI agent context (YOU ARE HERE)
├── app/              # Next.js pages & API routes
├── components/       # React components
├── lib/              # Business logic
│   ├── ai/agents/    # AI evaluation agents
│   ├── schemas/      # Zod validation schemas
│   ├── enrichment/   # Tavily API integration
│   └── workflows/    # Screening orchestration
├── prisma/           # Database schema
├── docs/             # Legacy documentation (being consolidated)
└── scripts/          # Utility scripts
```

---

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...
```

**Important:** Shell environment variables override `.env` file. If you get auth errors, run:
```bash
unset DATABASE_URL DIRECT_URL OPENROUTER_API_KEY
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start dev server (must unset shell env vars first)
unset DATABASE_URL DIRECT_URL && npm run dev
```

---

## Database

Uses Supabase PostgreSQL with these models:
- `ScreeningSession` - Batch screening jobs
- `CandidateEvaluation` - Individual candidate results
- `Country` - Geographic grouping
- `CompanyCache` - Cached Tavily results (30-day TTL)
- `SessionError` - Error logging

See `prisma/schema.prisma` for full schema.

---

## Current Status

See `.claude/CURRENT_STATE.md` for detailed implementation status.

**Working:**
- Database connection & models
- Candidate upload & screening workflow
- AI evaluation with Claude Opus 4.5
- Results dashboard with filtering
- Country management

**In Progress:**
- Design system refresh
- UI polish

**Not Started:**
- Unit/integration tests
- Export functionality
- Manual override system
