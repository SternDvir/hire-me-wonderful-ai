# Implementation Guide - Hire Me, Wonderful AI

## 1. Project Setup

### 1.1 Initialize Next.js Project

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest hire-me-wonderful-ai \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd hire-me-wonderful-ai
```

### 1.2 Install Dependencies

```bash
# Core dependencies
npm install zod
npm install @mastra/core
npm install @vercel/postgres
npm install openrouter
npm install uuid

# UI dependencies (shadcn/ui)
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slot
npm install @radix-ui/react-toast
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react

# Development dependencies
npm install -D @types/node
npm install -D @types/uuid
npm install -D prettier
npm install -D eslint-config-prettier
```

### 1.3 Configure Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/wonderful_cto_screening"

# AI Services
OPENROUTER_API_KEY="sk-or-v1-..."
TAVILY_API_KEY="tvly-..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Cost tracking
TAVILY_COST_PER_SEARCH=0.003
CLAUDE_OPUS_COST_PER_1K_TOKENS=0.015
CLAUDE_OPUS_OUTPUT_COST_PER_1K_TOKENS=0.075
```

Create `.env.example` (for version control):

```bash
DATABASE_URL="postgresql://..."
OPENROUTER_API_KEY="sk-or-v1-..."
TAVILY_API_KEY="tvly-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 1.4 Setup Database

```bash
# Create database
createdb wonderful_cto_screening

# Run schema creation (create sql file first)
psql wonderful_cto_screening < schema.sql
```

Create `schema.sql` with the schema from Technical Specifications document.

---

## 2. Implementation Phases

### Phase 1: Core Data Layer (Day 1)

**Goal:** Set up data models and database integration

#### Step 1.1: Create Zod Schemas

Create files in `src/lib/schemas/`:

```typescript
// src/lib/schemas/linkedin.ts
// Copy LinkedIn profile schemas from Technical Specifications

// src/lib/schemas/company.ts
// Copy company enrichment schemas

// src/lib/schemas/evaluation.ts
// Copy all evaluation schemas

// src/lib/schemas/session.ts
// Copy session schemas

// src/lib/schemas/index.ts
export * from './linkedin';
export * from './company';
export * from './evaluation';
export * from './session';
```

#### Step 1.2: Database Client

```typescript
// src/lib/database/client.ts
import { sql } from '@vercel/postgres';
import type { ScreeningSession, CandidateEvaluationResult } from '@/lib/schemas';

export class Database {
  // Create screening session
  async createSession(session: Omit<ScreeningSession, 'sessionId' | 'createdAt'>): Promise<string> {
    const result = await sql`
      INSERT INTO screening_sessions (
        created_by, config, status, total_candidates
      ) VALUES (
        ${session.createdBy},
        ${JSON.stringify(session.config)},
        ${session.status},
        ${session.totalCandidates}
      )
      RETURNING id
    `;
    return result.rows[0].id;
  }

  // Save candidate evaluation
  async saveCandidateEvaluation(evaluation: CandidateEvaluationResult): Promise<void> {
    await sql`
      INSERT INTO candidate_evaluations (
        screening_session_id,
        candidate_id,
        linkedin_url,
        full_name,
        current_title,
        current_company,
        location,
        profile_data,
        enriched_companies,
        experience_evaluation,
        leadership_evaluation,
        language_check,
        company_background_evaluation,
        bonus_factors,
        final_decision,
        decision_result,
        overall_score,
        evaluated_at,
        evaluation_cost,
        processing_time_ms
      ) VALUES (
        ${evaluation.screeningSessionId},
        ${evaluation.candidateId},
        ${evaluation.linkedinUrl},
        ${evaluation.fullName},
        ${evaluation.currentTitle || null},
        ${evaluation.currentCompany || null},
        ${evaluation.location || null},
        ${JSON.stringify(evaluation.profile)},
        ${JSON.stringify(evaluation.enrichedCompanies || [])},
        ${JSON.stringify(evaluation.experienceEvaluation)},
        ${JSON.stringify(evaluation.leadershipEvaluation)},
        ${JSON.stringify(evaluation.languageCheck)},
        ${JSON.stringify(evaluation.companyBackgroundEvaluation)},
        ${JSON.stringify(evaluation.bonusFactors)},
        ${JSON.stringify(evaluation.finalDecision)},
        ${evaluation.finalDecision.decision},
        ${evaluation.finalDecision.overallScore},
        ${evaluation.evaluatedAt},
        ${evaluation.evaluationCost},
        ${evaluation.processingTimeMs}
      )
    `;
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<ScreeningSession | null> {
    const result = await sql`
      SELECT * FROM screening_sessions WHERE id = ${sessionId}
    `;
    if (result.rows.length === 0) return null;
    return this.mapRowToSession(result.rows[0]);
  }

  // Get session results
  async getSessionResults(sessionId: string): Promise<CandidateEvaluationResult[]> {
    const result = await sql`
      SELECT * FROM candidate_evaluations
      WHERE screening_session_id = ${sessionId}
      ORDER BY overall_score DESC
    `;
    return result.rows.map(this.mapRowToEvaluation);
  }

  // Update session status
  async updateSessionStatus(
    sessionId: string,
    status: string,
    updates: Partial<ScreeningSession>
  ): Promise<void> {
    await sql`
      UPDATE screening_sessions
      SET
        status = ${status},
        candidates_processed = ${updates.candidatesProcessed || 0},
        passed_candidates = ${updates.passedCandidates || 0},
        rejected_candidates = ${updates.rejectedCandidates || 0},
        errored_candidates = ${updates.erroredCandidates || 0},
        total_cost = ${updates.totalCost || 0},
        tavily_cost = ${updates.tavilyCost || 0},
        ai_cost = ${updates.aiCost || 0},
        completed_at = ${updates.completedAt || null},
        total_processing_time_ms = ${updates.totalProcessingTimeMs || null}
      WHERE id = ${sessionId}
    `;
  }

  // Get company from cache
  async getCompanyFromCache(companyName: string): Promise<EnrichedCompany | null> {
    const normalized = companyName.toLowerCase().trim();
    const result = await sql`
      SELECT enriched_data FROM company_cache
      WHERE company_name_normalized = ${normalized}
        AND cache_expires_at > NOW()
      ORDER BY searched_at DESC
      LIMIT 1
    `;
    if (result.rows.length === 0) return null;
    return result.rows[0].enriched_data;
  }

  // Save company to cache
  async saveCompanyToCache(companyName: string, data: EnrichedCompany): Promise<void> {
    const normalized = companyName.toLowerCase().trim();
    await sql`
      INSERT INTO company_cache (
        company_name, company_name_normalized, enriched_data
      ) VALUES (
        ${companyName}, ${normalized}, ${JSON.stringify(data)}
      )
    `;
  }

  private mapRowToSession(row: any): ScreeningSession {
    // Map database row to ScreeningSession type
    return {
      sessionId: row.id,
      createdAt: row.created_at,
      createdBy: row.created_by,
      config: row.config,
      status: row.status,
      totalCandidates: row.total_candidates,
      candidatesProcessed: row.candidates_processed,
      passedCandidates: row.passed_candidates,
      rejectedCandidates: row.rejected_candidates,
      erroredCandidates: row.errored_candidates,
      totalCost: parseFloat(row.total_cost),
      tavilyCost: parseFloat(row.tavily_cost),
      aiCost: parseFloat(row.ai_cost),
      startedAt: row.started_at,
      completedAt: row.completed_at,
      totalProcessingTimeMs: row.total_processing_time_ms,
    };
  }

  private mapRowToEvaluation(row: any): CandidateEvaluationResult {
    // Map database row to CandidateEvaluationResult type
    return {
      candidateId: row.candidate_id,
      linkedinUrl: row.linkedin_url,
      fullName: row.full_name,
      currentTitle: row.current_title,
      currentCompany: row.current_company,
      location: row.location,
      profile: row.profile_data,
      enrichedCompanies: row.enriched_companies,
      experienceEvaluation: row.experience_evaluation,
      leadershipEvaluation: row.leadership_evaluation,
      languageCheck: row.language_check,
      companyBackgroundEvaluation: row.company_background_evaluation,
      bonusFactors: row.bonus_factors,
      finalDecision: row.final_decision,
      screeningSessionId: row.screening_session_id,
      evaluatedAt: row.evaluated_at,
      evaluationCost: parseFloat(row.evaluation_cost),
      processingTimeMs: row.processing_time_ms,
    };
  }
}

export const db = new Database();
```

---

### Phase 2: External Service Clients (Day 1-2)

#### Step 2.1: Tavily Client

```typescript
// src/lib/services/tavily.ts
interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export class TavilyClient {
  private apiKey: string;
  private baseUrl = 'https://api.tavily.com';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TAVILY_API_KEY || '';
  }

  async search(query: string, maxResults: number = 5): Promise<TavilySearchResult[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        search_depth: 'basic',
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  }
}

export const tavily = new TavilyClient();
```

#### Step 2.2: OpenRouter Client

```typescript
// src/lib/services/openrouter.ts
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { z } from 'zod';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
  }

  async complete<T extends z.ZodType>(
    model: string,
    messages: OpenRouterMessage[],
    responseSchema: T,
    temperature: number = 0
  ): Promise<{ data: z.infer<T>; usage: { promptTokens: number; completionTokens: number } }> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 2000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'response',
            strict: true,
            schema: zodToJsonSchema(responseSchema),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed: ${response.statusText}`);
    }

    const result: OpenRouterResponse = await response.json();
    const parsedData = responseSchema.parse(JSON.parse(result.choices[0].message.content));

    return {
      data: parsedData,
      usage: {
        promptTokens: result.usage.prompt_tokens,
        completionTokens: result.usage.completion_tokens,
      },
    };
  }
}

export const openrouter = new OpenRouterClient();
```

---

### Phase 3: AI Agents (Day 2-3)

#### Step 3.1: Mastra AI Setup

```typescript
// src/lib/agents/mastra-config.ts
import { Mastra } from '@mastra/core';
import { openrouter } from '../services/openrouter';

export const mastra = new Mastra({
  name: 'wonderful-cto-screening',
  llmClient: openrouter,
});
```

#### Step 3.2: Create Agent Functions

```typescript
// src/lib/agents/experience-evaluator.ts
import { ExperienceEvaluationSchema, type LinkedInProfile } from '@/lib/schemas';
import { openrouter } from '../services/openrouter';
import {
  EXPERIENCE_EVALUATOR_SYSTEM_PROMPT,
  EXPERIENCE_EVALUATOR_USER_PROMPT,
} from '../prompts';

export async function evaluateExperience(profile: LinkedInProfile) {
  const userPrompt = EXPERIENCE_EVALUATOR_USER_PROMPT
    .replace('{candidate_name}', profile.fullName)
    .replace('{current_title}', profile.jobTitle || 'Unknown')
    .replace('{current_company}', profile.companyName || 'Unknown')
    .replace('{formatted_experiences}', formatExperiences(profile.experiences))
    .replace('{formatted_skills}', formatSkills(profile.skills || []))
    .replace('{about_section}', profile.about || 'Not provided');

  const result = await openrouter.complete(
    'anthropic/claude-sonnet-4.5',
    [
      { role: 'system', content: EXPERIENCE_EVALUATOR_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    ExperienceEvaluationSchema,
    0
  );

  return result.data;
}

function formatExperiences(experiences: Experience[]): string {
  return experiences
    .map(
      (exp, idx) => `
${idx + 1}. ${exp.title} at ${exp.companyName}
   Duration: ${exp.jobStartedOn} - ${exp.jobEndedOn || 'Present'}
   ${exp.jobDescription || 'No description available'}
`
    )
    .join('\n');
}

function formatSkills(skills: Skill[]): string {
  return skills.map((s) => s.name).join(', ') || 'Not specified';
}
```

Create similar files for:
- `leadership-evaluator.ts`
- `language-checker.ts`
- `company-evaluator.ts`
- `bonus-factors-evaluator.ts`
- `final-decision.ts` (uses Claude Opus 4.5)

---

### Phase 4: Screening Workflow (Day 3-4)

#### Step 4.1: Company Enrichment

```typescript
// src/lib/services/company-enrichment.ts
import { tavily } from './tavily';
import { db } from '../database/client';
import type { EnrichedCompany } from '@/lib/schemas';

export async function enrichCompanyWithCache(companyName: string): Promise<EnrichedCompany> {
  // Check cache first
  const cached = await db.getCompanyFromCache(companyName);
  if (cached) {
    return cached;
  }

  // Search with Tavily
  const query = `${companyName} company information funding tech stack reputation`;
  const results = await tavily.search(query, 5);

  // Parse results into structured data
  const enrichedData: EnrichedCompany = {
    name: companyName,
    description: extractDescription(results),
    industry: extractIndustry(results),
    size: extractSize(results),
    reputation: assessReputation(results),
    isStartup: isStartupCompany(results),
    isProductCompany: isProductCompany(results),
    notableAchievements: extractAchievements(results),
    searchTimestamp: new Date().toISOString(),
  };

  // Save to cache
  await db.saveCompanyToCache(companyName, enrichedData);

  return enrichedData;
}

function extractDescription(results: TavilySearchResult[]): string {
  // Logic to extract company description from search results
  // Use first result's content, limit to 200 chars
  return results[0]?.content.substring(0, 200) || '';
}

// Implement other extraction functions...
```

#### Step 4.2: Main Screening Function

```typescript
// src/lib/screening/evaluate-candidate.ts
import { v4 as uuidv4 } from 'uuid';
import type { LinkedInProfile, ScreeningConfig, CandidateEvaluationResult } from '@/lib/schemas';
import { evaluateExperience } from '../agents/experience-evaluator';
import { evaluateLeadership } from '../agents/leadership-evaluator';
import { checkLanguages } from '../agents/language-checker';
import { evaluateCompanyBackground } from '../agents/company-evaluator';
import { evaluateBonusFactors } from '../agents/bonus-factors-evaluator';
import { makeFinalDecision } from '../agents/final-decision';
import { enrichCompanyWithCache } from '../services/company-enrichment';

export async function evaluateCandidate(
  profile: LinkedInProfile,
  config: ScreeningConfig,
  sessionId: string
): Promise<CandidateEvaluationResult> {
  const startTime = Date.now();

  // Step 1: Enrich companies (if enabled)
  let enrichedCompanies = [];
  let tavilyCost = 0;

  if (config.enableCompanyEnrichment) {
    const topCompanies = getTopCompanies(profile.experiences, 3);
    enrichedCompanies = await Promise.all(
      topCompanies.map((company) => enrichCompanyWithCache(company))
    );
    tavilyCost = topCompanies.length * 0.003;
  }

  // Step 2: Run agent evaluations in parallel
  const [experienceEval, leadershipEval, languageCheck, companyBgEval, bonusFactors] =
    await Promise.all([
      evaluateExperience(profile),
      evaluateLeadership(profile),
      checkLanguages(profile),
      evaluateCompanyBackground(profile, enrichedCompanies),
      evaluateBonusFactors(profile),
    ]);

  // Step 3: Final decision
  const finalDecision = await makeFinalDecision(profile, enrichedCompanies, {
    experience: experienceEval,
    leadership: leadershipEval,
    language: languageCheck,
    companyBackground: companyBgEval,
    bonusFactors,
  });

  const processingTime = Date.now() - startTime;

  // Calculate costs (simplified - should use actual token counts)
  const aiCost = 0.03; // Approximate

  return {
    candidateId: uuidv4(),
    linkedinUrl: profile.linkedinUrl,
    fullName: profile.fullName,
    currentTitle: profile.jobTitle,
    currentCompany: profile.companyName,
    location: profile.addressWithCountry,
    profile,
    enrichedCompanies,
    experienceEvaluation: experienceEval,
    leadershipEvaluation: leadershipEval,
    languageCheck,
    companyBackgroundEvaluation: companyBgEval,
    bonusFactors,
    finalDecision,
    screeningSessionId: sessionId,
    evaluatedAt: new Date().toISOString(),
    evaluationCost: tavilyCost + aiCost,
    processingTimeMs: processingTime,
  };
}

function getTopCompanies(experiences: Experience[], count: number): string[] {
  return experiences
    .sort((a, b) => {
      // Sort by most recent
      const aDate = a.jobEndedOn || '9999-12';
      const bDate = b.jobEndedOn || '9999-12';
      return bDate.localeCompare(aDate);
    })
    .slice(0, count)
    .map((exp) => exp.companyName);
}
```

---

### Phase 5: API Routes (Day 4-5)

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApifyOutputSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const profiles = ApifyOutputSchema.parse(body);

    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// src/app/api/screen/route.ts
export async function POST(request: NextRequest) {
  const { profiles, config } = await request.json();

  // Create session
  const sessionId = await db.createSession({
    createdBy: 'user@example.com', // TODO: Get from auth
    config,
    status: 'processing',
    totalCandidates: profiles.length,
    candidatesProcessed: 0,
    passedCandidates: 0,
    rejectedCandidates: 0,
    erroredCandidates: 0,
    totalCost: 0,
    tavilyCost: 0,
    aiCost: 0,
  });

  // Start screening workflow (async)
  screenCandidatesAsync(sessionId, profiles, config);

  return NextResponse.json({ sessionId });
}

async function screenCandidatesAsync(
  sessionId: string,
  profiles: LinkedInProfile[],
  config: ScreeningConfig
) {
  await db.updateSessionStatus(sessionId, 'processing', {
    startedAt: new Date().toISOString(),
  });

  let processed = 0;
  let passed = 0;
  let rejected = 0;
  let totalCost = 0;

  for (const profile of profiles) {
    try {
      const result = await evaluateCandidate(profile, config, sessionId);
      await db.saveCandidateEvaluation(result);

      processed++;
      if (result.finalDecision.decision === 'PASS') passed++;
      else rejected++;
      totalCost += result.evaluationCost;

      await db.updateSessionStatus(sessionId, 'processing', {
        candidatesProcessed: processed,
        passedCandidates: passed,
        rejectedCandidates: rejected,
        totalCost,
      });
    } catch (error) {
      console.error(`Error evaluating ${profile.fullName}:`, error);
      // Log error to session_errors table
    }
  }

  await db.updateSessionStatus(sessionId, 'completed', {
    candidatesProcessed: processed,
    passedCandidates: passed,
    rejectedCandidates: rejected,
    completedAt: new Date().toISOString(),
  });
}
```

---

### Phase 6: UI Components (Day 5-7)

Use shadcn/ui for all components. Create dashboard, upload, and results pages.

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add progress
```

Create pages:
- `src/app/page.tsx` - Dashboard
- `src/app/upload/page.tsx` - Upload profiles
- `src/app/sessions/[id]/page.tsx` - Session results

---

This implementation guide provides a clear path from setup to completion. Follow each phase sequentially for best results. The next document will cover testing and deployment.
