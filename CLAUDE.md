# Hire Me - Wonderful AI

AI-powered candidate screening tool for Local CTO positions.

## Quick Context

- **Tech Stack:** Next.js 14, TypeScript, Prisma 7, PostgreSQL (Supabase), OpenRouter (Claude Opus 4.5)
- **Purpose:** Screen LinkedIn profiles against Wonderful AI's CTO requirements
- **Status:** MVP functional, UI polish needed

## Before Starting Work

Read the relevant documentation in `.claude/`:

| File | When to Read |
|------|--------------|
| `PROJECT.md` | First time working on this project |
| `CURRENT_STATE.md` | To see what's working and known issues |
| `ARCHITECTURE.md` | When working on data flows or integrations |
| `PROMPTS.md` | When modifying AI evaluation logic |
| `CONVENTIONS.md` | Before writing code |
| `ROADMAP.md` | To understand priorities |
| `CHANGELOG.md` | To see recent changes |

## Critical: Environment Variables

Shell environment variables override `.env` file. If you get database auth errors:

```bash
unset DATABASE_URL DIRECT_URL OPENROUTER_API_KEY
```

Then restart the dev server.

## Key Files

- `lib/ai/agents/final-decision.ts` - Main AI evaluation logic
- `lib/prisma.ts` - Database client
- `prisma/schema.prisma` - Database schema
- `app/api/screenings/route.ts` - Main API endpoint

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npx prisma studio # Database GUI
```
