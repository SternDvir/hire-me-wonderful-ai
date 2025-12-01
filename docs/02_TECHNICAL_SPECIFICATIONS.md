# Technical Specifications - Hire Me, Wonderful AI

## 1. Data Schemas (Zod)

### 1.1 LinkedIn Profile Schema (Input)

```typescript
import { z } from "zod";

// Language proficiency schema
export const LanguageSchema = z.object({
  name: z.string(),
  proficiency: z.enum([
    "Elementary proficiency",
    "Limited working proficiency",
    "Professional working proficiency",
    "Full professional proficiency",
    "Native or bilingual proficiency"
  ]).optional()
});

// Experience entry schema
export const ExperienceSchema = z.object({
  companyId: z.string().optional(),
  companyName: z.string(),
  companySize: z.string().optional(),
  companyWebsite: z.string().url().optional(),
  companyIndustry: z.string().optional(),
  title: z.string(),
  jobDescription: z.string().optional(),
  jobStartedOn: z.string(), // Format: "MM-YYYY"
  jobEndedOn: z.string().optional(), // Format: "MM-YYYY"
  jobStillWorking: z.boolean(),
  jobLocation: z.string().optional(),
  employmentType: z.string().optional()
});

// Education entry schema
export const EducationSchema = z.object({
  schoolName: z.string(),
  degreeName: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startedOn: z.string().optional(),
  endedOn: z.string().optional(),
  description: z.string().optional()
});

// Skill schema
export const SkillSchema = z.object({
  name: z.string(),
  endorsements: z.number().optional()
});

// Main LinkedIn Profile Schema
export const LinkedInProfileSchema = z.object({
  linkedinUrl: z.string().url(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  headline: z.string(),
  connections: z.number().optional(),
  followers: z.number().optional(),
  email: z.string().email().optional().nullable(),
  jobTitle: z.string().optional(),
  jobLocation: z.string().optional(),
  companyName: z.string().optional(),
  addressCountryOnly: z.string().optional(),
  addressWithCountry: z.string().optional(),
  profilePic: z.string().url().optional(),
  linkedinId: z.string(),
  about: z.string().optional(),
  experiences: z.array(ExperienceSchema),
  educations: z.array(EducationSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  languages: z.array(LanguageSchema).optional(),
  licenseAndCertificates: z.array(z.any()).optional()
});

// Array of profiles (Apify output)
export const ApifyOutputSchema = z.array(LinkedInProfileSchema);

export type LinkedInProfile = z.infer<typeof LinkedInProfileSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Language = z.infer<typeof LanguageSchema>;
```

### 1.2 Company Enrichment Schema

```typescript
import { z } from "zod";

export const EnrichedCompanySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  founded: z.string().optional(),
  headquarters: z.string().optional(),
  website: z.string().url().optional(),
  fundingInfo: z.string().optional(),
  reputation: z.enum(["excellent", "good", "average", "poor", "unknown"]).optional(),
  techStack: z.array(z.string()).optional(),
  isStartup: z.boolean().optional(),
  isProductCompany: z.boolean().optional(),
  notableAchievements: z.array(z.string()).optional(),
  searchTimestamp: z.string().datetime()
});

export type EnrichedCompany = z.infer<typeof EnrichedCompanySchema>;
```

### 1.3 Agent Evaluation Schemas

```typescript
import { z } from "zod";

// Experience Evaluation
export const ExperienceEvaluationSchema = z.object({
  totalYearsOfExperience: z.number(),
  yearsOfBackendExperience: z.number(),
  yearsOfLeadershipExperience: z.number(),
  hasHandsOnExperience: z.boolean(),
  isCurrentlyHandsOn: z.boolean(),
  technologiesUsed: z.array(z.string()),
  hasAIMLExperience: z.boolean(),
  passesMinimumYears: z.boolean(), // >= 7 years
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Leadership Evaluation
export const LeadershipEvaluationSchema = z.object({
  highestTitleLevel: z.enum(["IC", "Lead", "Manager", "Director", "VP", "SVP", "CTO", "CEO"]),
  hasBuiltTeams: z.boolean(),
  teamSizesLed: z.array(z.number()),
  hasVPOrAbove: z.boolean(),
  hasHiringExperience: z.boolean(),
  evidenceOfCharisma: z.array(z.string()), // Speaking engagements, blog posts, etc.
  evidenceOfEQ: z.array(z.string()),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Language Check
export const LanguageCheckSchema = z.object({
  hasEnglishProficiency: z.boolean(),
  englishLevel: z.enum([
    "Elementary",
    "Limited",
    "Professional",
    "Full Professional",
    "Native"
  ]).optional(),
  hasNativeLanguageProficiency: z.boolean(),
  nativeLanguage: z.string().optional(),
  currentCountry: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Company Background Evaluation
export const CompanyBackgroundEvaluationSchema = z.object({
  workedAtStartups: z.boolean(),
  workedAtProductCompanies: z.boolean(),
  hasFounderExperience: z.boolean(),
  companyQualityScore: z.number().min(0).max(100), // Average quality of companies
  notableCompanies: z.array(z.string()),
  industryDiversity: z.number().min(0).max(100), // How diverse is experience
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Bonus Factors Evaluation
export const BonusFactorsSchema = z.object({
  hasCustomerFacingExperience: z.boolean(),
  hasPreSalesExperience: z.boolean(),
  hasSolutionArchitectExperience: z.boolean(),
  hasPersonalGrowthTrajectory: z.boolean(),
  hasInternationalExperience: z.boolean(),
  hasStrongOnlinePresence: z.boolean(),
  reasoning: z.string()
});

export type ExperienceEvaluation = z.infer<typeof ExperienceEvaluationSchema>;
export type LeadershipEvaluation = z.infer<typeof LeadershipEvaluationSchema>;
export type LanguageCheck = z.infer<typeof LanguageCheckSchema>;
export type CompanyBackgroundEvaluation = z.infer<typeof CompanyBackgroundEvaluationSchema>;
export type BonusFactors = z.infer<typeof BonusFactorsSchema>;
```

### 1.4 Final Decision Schema

```typescript
import { z } from "zod";

export const FinalDecisionSchema = z.object({
  decision: z.enum(["PASS", "REJECT"]),
  reasoning: z.string().max(50), // 5-10 words max
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1).max(10),
  concerns: z.array(z.string()).max(10),
  interviewRecommendation: z.enum([
    "Highly Recommended",
    "Recommended",
    "Consider",
    "Not Recommended"
  ]),
  detailedAnalysis: z.object({
    technicalDepth: z.number().min(0).max(100),
    leadershipCapability: z.number().min(0).max(100),
    customerFacing: z.number().min(0).max(100),
    culturalFit: z.number().min(0).max(100),
    handsOnCurrent: z.number().min(0).max(100)
  }),
  redFlags: z.array(z.string()).optional(),
  suggestedInterviewQuestions: z.array(z.string()).optional()
});

export type FinalDecision = z.infer<typeof FinalDecisionSchema>;
```

### 1.5 Complete Candidate Evaluation Result

```typescript
import { z } from "zod";

export const CandidateEvaluationResultSchema = z.object({
  // Identity
  candidateId: z.string(), // Generated UUID
  linkedinUrl: z.string().url(),
  fullName: z.string(),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  location: z.string().optional(),
  
  // Raw data
  profile: LinkedInProfileSchema,
  
  // Enriched data
  enrichedCompanies: z.array(EnrichedCompanySchema).optional(),
  
  // Agent evaluations
  experienceEvaluation: ExperienceEvaluationSchema,
  leadershipEvaluation: LeadershipEvaluationSchema,
  languageCheck: LanguageCheckSchema,
  companyBackgroundEvaluation: CompanyBackgroundEvaluationSchema,
  bonusFactors: BonusFactorsSchema,
  
  // Final decision
  finalDecision: FinalDecisionSchema,
  
  // Metadata
  screeningSessionId: z.string(), // UUID of the screening session
  evaluatedAt: z.string().datetime(),
  evaluationCost: z.number(), // USD
  processingTimeMs: z.number(),
  
  // Manual overrides (for future use)
  manualOverride: z.object({
    overridden: z.boolean(),
    newDecision: z.enum(["PASS", "REJECT"]).optional(),
    overrideReason: z.string().optional(),
    overriddenBy: z.string().optional(),
    overriddenAt: z.string().datetime().optional()
  }).optional()
});

export type CandidateEvaluationResult = z.infer<typeof CandidateEvaluationResultSchema>;
```

### 1.6 Screening Session Schema

```typescript
import { z } from "zod";

export const ScreeningConfigSchema = z.object({
  enableCompanyEnrichment: z.boolean().default(true),
  targetRole: z.enum(["CTO", "VP_Engineering", "Engineering_Manager", "Custom"]).default("CTO"),
  targetCountry: z.string().optional(),
  customCriteria: z.string().optional(), // Additional criteria in natural language
  minimumYearsExperience: z.number().min(0).default(7),
  requireVPOrAbove: z.boolean().default(false),
  requireStartupExperience: z.boolean().default(false)
});

export const ScreeningSessionSchema = z.object({
  sessionId: z.string(), // UUID
  createdAt: z.string().datetime(),
  createdBy: z.string(), // User ID or email
  config: ScreeningConfigSchema,
  status: z.enum(["pending", "processing", "completed", "failed"]),
  
  // Statistics
  totalCandidates: z.number(),
  candidatesProcessed: z.number(),
  passedCandidates: z.number(),
  rejectedCandidates: z.number(),
  erroredCandidates: z.number(),
  
  // Costs
  totalCost: z.number(), // USD
  tavilyCost: z.number(),
  aiCost: z.number(),
  
  // Timing
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  totalProcessingTimeMs: z.number().optional(),
  
  // Results
  results: z.array(CandidateEvaluationResultSchema).optional(),
  
  // Errors
  errors: z.array(z.object({
    candidateId: z.string(),
    error: z.string(),
    timestamp: z.string().datetime()
  })).optional()
});

export type ScreeningConfig = z.infer<typeof ScreeningConfigSchema>;
export type ScreeningSession = z.infer<typeof ScreeningSessionSchema>;
```

---

## 2. API Contracts

### 2.1 Tavily Search API

**Endpoint:** `https://api.tavily.com/search`

**Request:**
```typescript
interface TavilySearchRequest {
  api_key: string;
  query: string;
  search_depth?: "basic" | "advanced";
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}
```

**Response:**
```typescript
interface TavilySearchResponse {
  query: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    published_date?: string;
  }>;
  response_time: number;
}
```

**Usage in Project:**
```typescript
async function enrichCompany(companyName: string): Promise<EnrichedCompany> {
  const query = `${companyName} company information, funding, tech stack, reputation`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 5
    })
  });
  
  const data: TavilySearchResponse = await response.json();
  
  // Parse and structure the enriched company data
  return parseCompanyInfo(companyName, data.results);
}
```

### 2.2 OpenRouter API (Claude Opus 4.5)

**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

**Request:**
```typescript
interface OpenRouterRequest {
  model: string; // "anthropic/claude-opus-4.5"
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: {
    type: "json_schema";
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, any>;
    };
  };
}
```

**Response:**
```typescript
interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

**Usage in Project:**
```typescript
async function evaluateCandidate(
  profile: LinkedInProfile,
  enrichedCompanies: EnrichedCompany[],
  agentEvaluations: {
    experience: ExperienceEvaluation;
    leadership: LeadershipEvaluation;
    language: LanguageCheck;
    companyBackground: CompanyBackgroundEvaluation;
    bonusFactors: BonusFactors;
  }
): Promise<FinalDecision> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-opus-4.5',
      messages: [
        {
          role: 'system',
          content: FINAL_DECISION_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: formatCandidateForDecision(profile, enrichedCompanies, agentEvaluations)
        }
      ],
      temperature: 0,
      max_tokens: 2000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'final_decision',
          strict: true,
          schema: zodToJsonSchema(FinalDecisionSchema)
        }
      }
    })
  });
  
  const data: OpenRouterResponse = await response.json();
  const decision = JSON.parse(data.choices[0].message.content);
  
  return FinalDecisionSchema.parse(decision);
}
```

---

## 3. Database Schema (Postgres)

### 3.1 Tables

```sql
-- Screening Sessions
CREATE TABLE screening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_candidates INTEGER NOT NULL DEFAULT 0,
  candidates_processed INTEGER NOT NULL DEFAULT 0,
  passed_candidates INTEGER NOT NULL DEFAULT 0,
  rejected_candidates INTEGER NOT NULL DEFAULT 0,
  errored_candidates INTEGER NOT NULL DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  tavily_cost DECIMAL(10, 4) DEFAULT 0,
  ai_cost DECIMAL(10, 4) DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_processing_time_ms BIGINT,
  
  INDEX idx_created_at (created_at DESC),
  INDEX idx_created_by (created_by),
  INDEX idx_status (status)
);

-- Candidate Evaluations
CREATE TABLE candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_session_id UUID NOT NULL REFERENCES screening_sessions(id) ON DELETE CASCADE,
  candidate_id VARCHAR(255) NOT NULL,
  linkedin_url VARCHAR(500) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  current_title VARCHAR(255),
  current_company VARCHAR(255),
  location VARCHAR(255),
  
  -- Raw profile data
  profile_data JSONB NOT NULL,
  
  -- Enriched data
  enriched_companies JSONB,
  
  -- Agent evaluations
  experience_evaluation JSONB NOT NULL,
  leadership_evaluation JSONB NOT NULL,
  language_check JSONB NOT NULL,
  company_background_evaluation JSONB NOT NULL,
  bonus_factors JSONB NOT NULL,
  
  -- Final decision
  final_decision JSONB NOT NULL,
  decision_result VARCHAR(10) NOT NULL CHECK (decision_result IN ('PASS', 'REJECT')),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Metadata
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  evaluation_cost DECIMAL(10, 4) NOT NULL,
  processing_time_ms INTEGER NOT NULL,
  
  -- Manual overrides
  manual_override JSONB,
  
  INDEX idx_session (screening_session_id),
  INDEX idx_decision (decision_result),
  INDEX idx_score (overall_score DESC),
  INDEX idx_evaluated_at (evaluated_at DESC),
  INDEX idx_linkedin_url (linkedin_url),
  UNIQUE (screening_session_id, linkedin_url)
);

-- Company enrichment cache (to avoid duplicate Tavily searches)
CREATE TABLE company_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  company_name_normalized VARCHAR(255) NOT NULL, -- Lowercase, trimmed for matching
  enriched_data JSONB NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cache_expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  
  INDEX idx_company_name (company_name_normalized),
  INDEX idx_expires_at (cache_expires_at)
);

-- Session errors
CREATE TABLE session_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_session_id UUID NOT NULL REFERENCES screening_sessions(id) ON DELETE CASCADE,
  candidate_id VARCHAR(255),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_session (screening_session_id),
  INDEX idx_occurred_at (occurred_at DESC)
);
```

### 3.2 Query Examples

```sql
-- Get all PASS candidates from a session, ordered by score
SELECT 
  full_name,
  current_title,
  current_company,
  overall_score,
  final_decision->>'reasoning' as reasoning,
  linkedin_url
FROM candidate_evaluations
WHERE screening_session_id = 'session-uuid-here'
  AND decision_result = 'PASS'
ORDER BY overall_score DESC;

-- Get session statistics
SELECT 
  s.id,
  s.created_at,
  s.total_candidates,
  s.passed_candidates,
  s.rejected_candidates,
  s.total_cost,
  ROUND((s.passed_candidates::DECIMAL / s.total_candidates * 100), 2) as pass_rate
FROM screening_sessions s
WHERE s.status = 'completed'
ORDER BY s.created_at DESC
LIMIT 10;

-- Find candidates with high scores but rejected (potential false negatives)
SELECT 
  full_name,
  overall_score,
  final_decision->>'reasoning' as reasoning,
  final_decision->'concerns' as concerns
FROM candidate_evaluations
WHERE decision_result = 'REJECT'
  AND overall_score >= 70
ORDER BY overall_score DESC;

-- Get company from cache
SELECT enriched_data
FROM company_cache
WHERE company_name_normalized = LOWER(TRIM('Company Name'))
  AND cache_expires_at > NOW()
ORDER BY searched_at DESC
LIMIT 1;
```

---

## 4. Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:password@host:5432/wonderful_cto_screening"

# AI Services
OPENROUTER_API_KEY="sk-or-v1-..."
TAVILY_API_KEY="tvly-..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Authentication (future)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-here"

# Cost tracking
TAVILY_COST_PER_SEARCH=0.003  # $0.003 per search
CLAUDE_OPUS_COST_PER_1K_TOKENS=0.015  # $0.015 per 1K input tokens
CLAUDE_OPUS_OUTPUT_COST_PER_1K_TOKENS=0.075  # $0.075 per 1K output tokens

# Feature flags
ENABLE_COMPANY_ENRICHMENT=true
ENABLE_CACHING=true
MAX_CONCURRENT_EVALUATIONS=5
```

---

## 5. File Structure

```
hire-me-wonderful-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard homepage
│   │   ├── upload/page.tsx             # Upload profiles page
│   │   ├── sessions/[id]/page.tsx      # Screening session details
│   │   ├── api/
│   │   │   ├── upload/route.ts         # Upload Apify JSON
│   │   │   ├── screen/route.ts         # Start screening workflow
│   │   │   ├── sessions/route.ts       # List sessions
│   │   │   └── sessions/[id]/route.ts  # Get session details
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── schemas/
│   │   │   ├── linkedin.ts             # LinkedIn profile schemas
│   │   │   ├── company.ts              # Company enrichment schemas
│   │   │   ├── evaluation.ts           # Evaluation schemas
│   │   │   └── session.ts              # Session schemas
│   │   ├── agents/
│   │   │   ├── profile-parser.ts       # Mastra agent: parse profile
│   │   │   ├── experience-evaluator.ts # Mastra agent: evaluate experience
│   │   │   ├── leadership-evaluator.ts # Mastra agent: evaluate leadership
│   │   │   ├── language-checker.ts     # Mastra agent: check languages
│   │   │   ├── company-evaluator.ts    # Mastra agent: evaluate companies
│   │   │   └── final-decision.ts       # Claude Opus: final decision
│   │   ├── services/
│   │   │   ├── tavily.ts               # Tavily API client
│   │   │   ├── openrouter.ts           # OpenRouter API client
│   │   │   └── database.ts             # Database queries
│   │   ├── workflows/
│   │   │   └── screening.ts            # Vercel WDK screening workflow
│   │   ├── utils/
│   │   │   ├── parsing.ts              # Helper functions
│   │   │   ├── cost-calculator.ts      # Calculate costs
│   │   │   └── formatters.ts           # Format data for display
│   │   └── constants.ts                # Constants and configs
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   ├── recent-sessions.tsx
│   │   │   └── quick-actions.tsx
│   │   ├── upload/
│   │   │   ├── file-dropzone.tsx
│   │   │   └── config-form.tsx
│   │   ├── results/
│   │   │   ├── candidate-card.tsx
│   │   │   ├── candidate-detail.tsx
│   │   │   ├── filters.tsx
│   │   │   └── export-button.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   └── styles/
│       └── globals.css
├── public/
├── prisma/                              # If using Prisma ORM
│   └── schema.prisma
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

---

This technical specification provides the complete data models, API contracts, and database schema needed for implementation. The next document will contain the detailed LLM prompts and evaluation logic.
