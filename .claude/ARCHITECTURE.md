# System Architecture

> **Last Updated:** 2025-12-02

## High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Dashboard  │  │   Upload    │  │  Screening  │  │   Results   │     │
│  │   (/)       │  │  (/upload)  │  │    View     │  │  (/results) │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           API ROUTES (app/api/)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │ /api/screenings │  │ /api/candidates │  │  /api/countries │          │
│  │   - POST create │  │   - GET list    │  │   - GET/POST    │          │
│  │   - GET list    │  │                 │  │   - [id] CRUD   │          │
│  │   - [id]/start  │  │                 │  │                 │          │
│  │   - [id]/export │  │                 │  │                 │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC (lib/)                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    lib/workflows/screening.ts                    │    │
│  │  Main orchestrator: validates → enriches → evaluates → saves    │    │
│  └────────────────────────────────┬────────────────────────────────┘    │
│                                   │                                      │
│           ┌───────────────────────┼───────────────────────┐             │
│           ▼                       ▼                       ▼             │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐        │
│  │ lib/schemas/   │    │ lib/enrichment │    │ lib/ai/agents/ │        │
│  │ - linkedin.ts  │    │ - tavily.ts    │    │ - language.ts  │        │
│  │ - company.ts   │    │   (company     │    │ - final-       │        │
│  │ - evaluation.ts│    │    research)   │    │   decision.ts  │        │
│  │ - session.ts   │    │                │    │                │        │
│  └────────────────┘    └────────────────┘    └────────────────┘        │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    Supabase      │  │   OpenRouter     │  │     Tavily       │
│   PostgreSQL     │  │  (Claude Opus    │  │   (Company       │
│  (lib/prisma.ts) │  │     4.5)         │  │    Search)       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Candidate Screening Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│ FOR EACH CANDIDATE IN UPLOADED JSON:                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. VALIDATE PROFILE                                                    │
│     └─► lib/schemas/linkedin.ts (Zod validation)                       │
│         - Validates required fields                                     │
│         - Parses experiences, languages, skills                         │
│                                                                         │
│  2. CHECK LANGUAGE PROFICIENCY                                          │
│     └─► lib/ai/agents/language-checker.ts                              │
│         - Verifies English proficiency                                  │
│         - Verifies native language for current country                  │
│         - Can infer from context if not explicitly listed               │
│                                                                         │
│  3. ENRICH COMPANIES (if enabled)                                       │
│     └─► lib/enrichment/tavily.ts                                       │
│         - Gets top 3 companies from experience                          │
│         - Searches Tavily for company info                              │
│         - Caches results for 30 days                                    │
│                                                                         │
│  4. FINAL AI EVALUATION                                                 │
│     └─► lib/ai/agents/final-decision.ts                                │
│         - Uses Claude Opus 4.5 via OpenRouter                           │
│         - Evaluates against CTO criteria                                │
│         - Returns PASS/REJECT with reasoning                            │
│         - Scores: overallScore, confidence, detailedAnalysis            │
│                                                                         │
│  5. SAVE TO DATABASE                                                    │
│     └─► prisma.candidateEvaluation.create()                            │
│         - Stores all evaluation data as JSON                            │
│         - Updates session counters                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Prisma)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ScreeningSession                               │
├─────────────────────────────────────────────────────────────────────────┤
│ id (UUID)              │ Primary key                                    │
│ createdAt              │ Timestamp                                      │
│ createdBy              │ User identifier                                │
│ config (JSON)          │ Screening configuration                        │
│ status                 │ pending | processing | completed | failed      │
│ totalCandidates        │ Count of candidates                            │
│ candidatesProcessed    │ Progress counter                               │
│ passedCandidates       │ PASS count                                     │
│ rejectedCandidates     │ REJECT count                                   │
│ erroredCandidates      │ Error count                                    │
│ totalCost              │ API costs (USD)                                │
│ countryId (FK)         │ → Country                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ RELATIONS: evaluations[], errors[], country                            │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CandidateEvaluation                              │
├─────────────────────────────────────────────────────────────────────────┤
│ id (UUID)              │ Primary key                                    │
│ screeningSessionId     │ → ScreeningSession                             │
│ candidateId            │ Unique candidate identifier                    │
│ linkedinUrl            │ Profile URL (unique per session)               │
│ fullName               │ Candidate name                                 │
│ currentTitle           │ Current job title                              │
│ currentCompany         │ Current employer                               │
│ location               │ Geographic location                            │
│ profileData (JSON)     │ Raw LinkedIn profile                           │
│ enrichedCompanies      │ Tavily research results                        │
│ experienceEvaluation   │ Experience analysis                            │
│ leadershipEvaluation   │ Leadership analysis                            │
│ languageCheck          │ Language verification                          │
│ companyBackgroundEval  │ Company quality analysis                       │
│ bonusFactors           │ Nice-to-have attributes                        │
│ finalDecision (JSON)   │ PASS/REJECT with reasoning                     │
│ decisionResult         │ "PASS" | "REJECT"                              │
│ overallScore           │ 0-100                                          │
│ evaluatedAt            │ Timestamp                                      │
│ evaluationCost         │ Cost for this candidate                        │
│ processingTimeMs       │ Processing duration                            │
│ manualOverride (JSON)  │ Human override (if any)                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/prisma.ts` | Prisma client singleton with connection pooling |
| `lib/workflows/screening.ts` | Main screening orchestration |
| `lib/ai/agents/final-decision.ts` | Claude Opus 4.5 evaluation logic |
| `lib/ai/agents/language-checker.ts` | Language proficiency verification |
| `lib/enrichment/tavily.ts` | Company research API integration |
| `lib/schemas/linkedin.ts` | LinkedIn profile Zod schema |
| `lib/schemas/evaluation.ts` | Evaluation result Zod schema |
| `app/api/screenings/route.ts` | Screening CRUD API |
| `app/api/screenings/[id]/start/route.ts` | Trigger screening processing |
| `components/CandidateModal.tsx` | Candidate detail view |
| `components/RecentScreenings.tsx` | Dashboard screening list |

---

## External Services

### OpenRouter (Claude Opus 4.5)
- **Used for:** Final candidate evaluation
- **Model:** `anthropic/claude-opus-4.5`
- **Cost:** ~$0.015/1K input tokens, $0.075/1K output
- **Configuration:** `lib/ai/agents/final-decision.ts`

### Tavily
- **Used for:** Company research and enrichment
- **Cost:** ~$0.003 per search
- **Configuration:** `lib/enrichment/tavily.ts`
- **Caching:** Results cached in `company_cache` table for 30 days

### Supabase PostgreSQL
- **Connection:** Via Prisma PG adapter
- **Pooler port:** 6543 (PgBouncer)
- **Direct port:** 5432 (for Prisma migrations)
- **Configuration:** `lib/prisma.ts`, `prisma.config.ts`
