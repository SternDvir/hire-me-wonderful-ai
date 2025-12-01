# MASTER BLUEPRINT: Hire Me, Wonderful AI

## 📋 Executive Brief for Claude Code

**Project Name**: Hire Me, Wonderful AI  
**Objective**: Build a production-ready web application that automates LinkedIn candidate screening for CTO positions  
**Tech Stack**: Next.js 14, TypeScript, Vercel WDK, Mastra AI, Zod, OpenRouter (Claude Opus 4.5), Tavily, Vercel Postgres  
**Timeline**: 6 weeks to MVP  
**Primary User**: Dvir (Developer & Hiring Manager for Wonderful AI)

**This document contains EVERYTHING needed to build the application from scratch.**

---

## 🎯 What This System Does

### The Problem
Manually screening 100+ LinkedIn candidates for CTO positions takes 20-30 hours. Most candidates don't meet requirements, making this extremely inefficient.

### The Solution
Automated AI-powered screening that:
1. Ingests LinkedIn profiles from Apify scraper (JSON)
2. Verifies language requirements automatically
3. Enriches company data via Tavily search
4. Evaluates candidates using Claude Opus 4.5 against strict criteria
5. Produces PASS/REJECT decisions with reasoning
6. Provides visual dashboard for review and export

### The Outcome
- **Time**: 20+ hours → 2-3 hours (90% reduction)
- **Cost**: $0.03-0.10 per candidate
- **Accuracy**: 90%+ for clear PASS/REJECT cases
- **Scale**: Process 100-500 candidates per session

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React/Next.js)                  │
│  Dashboard → Upload → Configure → Monitor → Review Results  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/JSON
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Next.js 14 App (Vercel Deployment)              │
│  ┌────────────┬────────────┬──────────────┬────────────┐   │
│  │  Server    │  API       │  Workflows   │  Database  │   │
│  │  Components│  Routes    │  (WDK)       │  (Prisma)  │   │
│  └────────────┴────────────┴──────────────┴────────────┘   │
└─────┬──────────────┬──────────────┬──────────────┬─────────┘
      │              │              │              │
      ↓              ↓              ↓              ↓
┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐
│OpenRouter│  │  Tavily  │  │   Vercel    │  │ Mastra   │
│(Claude)  │  │ (Search) │  │  Postgres   │  │   AI     │
└──────────┘  └──────────┘  └─────────────┘  └──────────┘
```

---

## 📊 Data Flow

### 1. Upload Phase
```
User uploads JSON → Validate Apify format → Parse profiles → 
Preview stats → Confirm → Store in Postgres → Ready for screening
```

### 2. Screening Phase (Vercel WDK Workflow)
```
FOR EACH CANDIDATE:
  ├─ Step 1: Language Check (instant)
  │   └─ Verify English + Native Language proficiency
  │   └─ Auto-reject if failed
  │
  ├─ Step 2: Company Enrichment (2-3 sec per company)
  │   └─ Extract top 3 companies from experience
  │   └─ Search Tavily for company info
  │   └─ Cache results in Redis/Postgres
  │
  ├─ Step 3: AI Evaluation (5-10 sec)
  │   └─ Format profile + enrichment data
  │   └─ Call Claude Opus 4.5 via OpenRouter
  │   └─ Parse JSON response (Zod validation)
  │   └─ Extract decision, reasoning, strengths, concerns
  │
  └─ Step 4: Save Result (instant)
      └─ Store in database with metadata
      └─ Update screening progress
      └─ Track costs and tokens

END → Generate summary report
```

### 3. Review Phase
```
User views dashboard → Filter/sort results → 
Click candidate → See full profile + evaluation → 
Take action (shortlist/reject/notes) → Export
```

---

## 🎓 Refined Hiring Criteria (Based on Actual Hired CTOs)

### Analysis of Successful Hires

**5 CTOs Hired by Wonderful AI:**

1. **Jan Surovec** (Czechia) - SVP Engineering, Co-founded Sapho (acquired $200M), 15+ years
2. **Ilia Kalishevsky** (Greece) - CEO Wonderful Greece, Ex-Microsoft, PhD, Patents
3. **Itay Levi** (Israel) - CTO Tapway, Ex-NICE, Strong AI, Patents
4. **Stefaan Lesage** (Belgium) - CEO Wonderfulish, Ex-CTO Euricom, 20+ years
5. **Alexey Zaytsev** (Netherlands) - VP Engineering Oqton, Stanford, Strong AI/ML

**Common Success Patterns:**
- ✅ 10-20+ years technical experience
- ✅ VP/Director/CTO level leadership
- ✅ Hands-on AI/ML experience (current or career-long)
- ✅ Built teams from 0→50+ people
- ✅ Startup experience or founding team
- ✅ Patents, publications, or technical thought leadership
- ✅ Customer-facing background (pre-sales, architecture)
- ✅ Strong academic backgrounds (many have advanced degrees)
- ✅ English + Native language fluency
- ✅ Energy evident in profiles ("co-founded", "built", "led")

### MUST-HAVE Requirements (ALL Required)

#### 1. Strong Software Engineering Background ⭐
**Minimum**: 7-8 years hands-on engineering  
**Evidence**:
- Backend, infrastructure, architecture, full-stack roles
- NOT frontend-only (HTML/CSS/React without backend)
- Recent technical work (within last 3 years)
- Progression from IC → Senior → Lead → Architect/Manager

**From Hired CTOs**: All have 10-20+ years, strong backend/systems

**How to Verify**:
```
- Check experience titles: "Backend Engineer", "Architect", "Full Stack"
- Avoid: "Frontend Developer" only, "UI/UX Designer"
- Look for: Databases, APIs, Cloud, Infrastructure mentions
```

#### 2. High EQ / Charisma / Energy / Inspiring ⭐⭐
**Evidence**:
- Leadership language: "led team", "mentored", "built culture"
- Public speaking, conference talks, blog posts
- Recommendations mentioning interpersonal skills
- Writing style shows energy and passion
- Use of action verbs: "founded", "built", "drove", "transformed"

**From Hired CTOs**: All show strong leadership language, many have "founded", "built teams 0→X"

**How to Verify**:
```
- About section: Look for team/people mentions, not just tech
- Headlines: Energy words like "Building", "Leading", "Transforming"
- Recommendations: People skills, inspiration, motivation
- Red flag: Only technical buzzwords, no human element
```

#### 3. Hands-On and Current with AI ⭐⭐⭐
**Critical**: Must have recent (last 1-2 years) hands-on AI work

**Evidence**:
- Current role involves AI/ML
- Mentions: LLMs, GPT, Claude, AI agents, prompt engineering
- Projects: Built AI products, ML pipelines, AI features
- Skills: Machine Learning, NLP, Deep Learning, AI
- Education: AI/ML courses, certifications

**From Hired CTOs**: ALL have AI/ML experience - either career-long (Alexey, Ilia, Itay) or recent adoption (Jan, Stefaan)

**How to Verify**:
```
- Job descriptions: "AI", "ML", "LLM", "Agent", "Prompt"
- Recent activity: Last 1-2 years must mention AI
- Projects/Patents: AI-related innovations
- Red flag: No AI mention anywhere, or only pre-2020
```

#### 4. Strong English Skills ⭐
**Requirement**: Professional working proficiency or higher

**Verification**:
```javascript
languages.find(l => 
  l.name.toLowerCase() === 'english' && 
  ['professional', 'full professional', 'native', 'bilingual']
    .some(level => l.proficiency.toLowerCase().includes(level))
)
```

**From Hired CTOs**: All have English proficiency listed

#### 5. Native Language Proficiency ⭐
**Requirement**: Professional proficiency in native language of CURRENT country

**Examples**:
- Candidate in Greece → Must have "Greek" at professional level
- Candidate in France → Must have "French" at professional level
- Candidate in Czech Republic → Must have "Czech" at professional level

**Verification**:
```javascript
// Get country from addressCountryOnly
const countryLanguageMap = {
  'Greece': 'Greek',
  'Czechia': 'Czech',
  'Czech Republic': 'Czech',
  'France': 'French',
  'Belgium': ['Dutch', 'French', 'German'], // Multi-language countries
  // ... etc
};

// Check candidate has that language at professional level
```

**From Hired CTOs**: All demonstrate native language (Czech, Greek, Dutch/French, Russian, Hebrew)

#### 6. Leadership Progression ⭐⭐
**Pattern**: Junior → Senior → Lead → Director/VP/CTO

**Evidence**:
- Title progression over career
- Increasing team sizes managed
- Increasing scope of responsibility
- Not stagnant in same role 10+ years

**From Hired CTOs**: Clear progression - many went from Engineer → Lead → Director → VP → CTO/CEO

**How to Verify**:
```
Timeline Analysis:
Year 1-3: Junior/Mid Engineer
Year 4-7: Senior Engineer / Tech Lead
Year 8-12: Manager / Director
Year 12+: VP / CTO / Founding

Red Flags:
- Same level for 10+ years
- Lateral moves only, no promotions
- Decreasing responsibility over time
```

#### 7. Wonderful AI Core Values ⭐
**Urgency**: Fast execution, startup pace  
**Professionalism**: Quality profile, recommendations  
**Independence**: Self-starter, ownership  
**Vibe**: Energy, passion, enthusiasm

**How to Verify**:
```
Urgency: "delivered in X weeks", "rapid", "fast-paced", startup experience
Professionalism: Complete profile, recommendations, clear communication
Independence: "owned", "autonomously", founding experience
Vibe: Exclamation marks!, action verbs, energy in writing
```

**From Hired CTOs**: All demonstrate these values (especially urgency and independence through founding/building experiences)

### BONUS Criteria (Boost Confidence)

#### Customer-Facing Background ⭐⭐
- Solution Architect
- Field CTO
- Pre-Sales Engineer
- Technical Account Manager
- Customer Success Engineer

**From Hired CTOs**: Several mention customer interaction, pre-sales in descriptions

#### Proven Leadership ⭐⭐
- Director, VP, C-level titles
- Managed 10+ people
- Built teams from scratch

**From Hired CTOs**: All are Director/VP/CTO level with team building experience

#### Startup Experience ⭐⭐⭐
- Founding team member
- Early employee (< 50 people)
- 0-to-1 product builds
- Acquisition experience

**From Hired CTOs**: Most have startup experience, several founded companies, one sold for $200M

#### Partner Ecosystem ⭐
- AWS, Azure, Google Cloud partnerships
- System integrator experience
- Channel partner management

#### Global Team Experience ⭐
- Multi-country teams
- Multi-timezone coordination
- International projects

**From Hired CTOs**: Several mention "multiple continents", international experience

### AUTO-REJECT Conditions

1. **< 5 years total technical experience**
2. **Frontend-only** (HTML/CSS/React only, no backend)
3. **No English proficiency** (or below professional)
4. **No native language** for current country
5. **Zero AI experience** (no mention anywhere)
6. **Career gap > 3 years** unexplained
7. **Only junior IC roles**, no leadership
8. **No recent work** (unemployed > 2 years without explanation)

---

## 🔧 Edge Cases & Missing Data Handling

### Overview
Real LinkedIn profiles are messy. 30-40% of profiles have incomplete data. The system must handle these gracefully.

**Philosophy**: Be flexible with data quality, strict with criteria. Missing data lowers confidence but doesn't auto-reject good candidates.

### Common Edge Cases

#### 1. Missing or Incomplete Language Data (30% of profiles)
**Problem**: Languages listed without proficiency level, or no languages listed at all

**Solution**:
- **Infer from location**: Works in Greece 5+ years → likely speaks Greek professionally
- **Infer from work history**: Worked at Microsoft → likely speaks English
- **Infer from education**: Studied in US → speaks English
- **Check profile text**: Look for "fluent in", language mentions
- **If cannot verify**: Reduce confidence by 15 points, flag "Language verification needed"

**Example**:
```json
// Profile has Greek and English listed but no proficiency
// Living in Athens 8 years, profile written in English
→ INFER: Greek (native), English (professional) ✅
→ Confidence penalty: -10 points
→ Note: "Languages inferred from context"
```

#### 2. Freelancers & Missing Company Data (15-20% of profiles)
**Problem**: Freelancers don't have company names, can't enrich company data

**Solution**:
- **Treat as valid**: "Self-employed", "Freelancer", "Independent Consultant" are legitimate
- **Focus on descriptions**: Project complexity, client mentions, technologies
- **Bonus for entrepreneurship**: Matches Wonderful's "Independence" value
- **Skip enrichment**: No company to enrich, that's okay
- **Evaluate differently**: Technical depth from project descriptions, not company prestige

**Example**:
```json
{
  "title": "Senior AI Consultant",
  "companyName": null,
  "employmentType": "Freelance",
  "description": "Built AI chatbots for 5 enterprise clients including Alpha Bank..."
}
→ Evaluate based on: enterprise clients, AI work, technical depth ✅
→ BONUS: Entrepreneurial background
→ Confidence: Normal (no penalty for freelancing)
```

#### 3. Unknown Companies (20-30% of profiles, especially Asia)
**Problem**: Companies have no public information (Korean, Hong Kong, local companies)

**Solution**:
- **Don't penalize**: Many legitimate companies have limited English web presence
- **Use profile data**: Company size, industry from LinkedIn
- **Graceful fallback**: Note "Limited company info available"
- **Focus on role**: Evaluate based on title, description, technologies, team size
- **Asian companies**: Kakao, Naver, Line, Grab are major tech companies even if not well-known

**Example**:
```json
{
  "companyName": "Kakao Corp",  // Korean tech giant
  "companySize": "1001-5000",
  "companyIndustry": "Internet"
}
// Tavily search returns minimal results
→ Use LinkedIn data: Large internet company ✅
→ Note: "Company is regional leader with limited English presence"
→ Evaluate based on: CTO role, 200-person team, AI work
→ No confidence penalty for unknown company
```

### Data Quality Scoring

```typescript
interface DataQuality {
  overallScore: number;        // 0-100
  languages: 'complete' | 'partial' | 'inferred' | 'missing';
  companies: 'complete' | 'partial' | 'missing';
  experience: 'complete' | 'partial' | 'vague';
}

// Confidence adjustments:
// 80-100: No adjustment
// 60-79: -10 points
// 40-59: -20 points
// <40: MANUAL_REVIEW flag
```

### Decision Matrix for Edge Cases

| Scenario | Languages | Companies | Experience | Action | Confidence |
|----------|-----------|-----------|------------|--------|------------|
| Complete profile | Complete | Complete | Complete | Evaluate normally | No change |
| Partial data | Inferable | Some missing | Detailed | Evaluate with notes | -10 |
| Sparse profile | Inferable | Mostly missing | Brief | Careful evaluation | -20 |
| Very sparse | Not inferable | All missing | Minimal | Manual review | -30 or MANUAL_REVIEW |

### Key Rules for Edge Cases

✅ **DO**:
- Infer languages from location, work, education
- Use profile-provided company data when enrichment fails
- Evaluate freelancers on project descriptions
- Focus on role when company unknown
- Adjust confidence based on data quality
- Flag for manual review when too uncertain

❌ **DON'T**:
- Auto-reject for missing proficiency if inferable
- Penalize unknown companies (especially Asian)
- Penalize freelancers for missing company names
- Ignore context from other sections
- Assume incomplete data = bad candidate

### Implementation Notes

**Language Inference Function**:
```typescript
function inferLanguageProficiency(language, profile) {
  // Check native language for country
  if (language === countryNativeLanguage && yearsInCountry >= 5) {
    return 'INFERRED_PROFESSIONAL';
  }
  
  // Check English from education/work
  if (language === 'English' && (
    educatedInEnglishCountry || 
    workedAtInternationalCompany ||
    profileInEnglish
  )) {
    return 'INFERRED_PROFESSIONAL';
  }
  
  return null; // Cannot infer
}
```

**Company Enrichment Fallback**:
```typescript
async function enrichCompany(name, profileData) {
  try {
    // Try Tavily
    const results = await tavily.search(name);
    if (results.length > 0) return parseResults(results);
  } catch {}
  
  // Fallback to profile data
  return {
    name,
    summary: profileData.companyIndustry || 'Unknown industry',
    size: profileData.companySize || 'Unknown size',
    dataSource: 'linkedin_profile',
    confidence: 'low',
    note: 'Limited public information available'
  };
}
```

**See [EDGE_CASES_AND_MISSING_DATA.md](./EDGE_CASES_AND_MISSING_DATA.md) for complete implementation details.**

---

## 💬 Communication Style & Tone

### For AI Prompts
- **Direct and specific**: "You MUST verify English proficiency"
- **Evidence-based**: "Look for specific mentions of..."
- **Structured**: Numbered lists, clear sections
- **Emphatic**: Use caps for CRITICAL points
- **Examples-driven**: Provide good/bad examples

### For User Interface
- **Friendly and encouraging**: "Great! Let's screen these candidates"
- **Clear progress**: "Processing candidate 50 of 100..."
- **Honest about limitations**: "Borderline cases need human review"
- **Action-oriented**: "Shortlist", "Interview", "Review"
- **Minimal jargon**: Avoid "training data", "tokens", "LLM"

### For Results Display
- **Succinct reasoning**: "Strong AI leadership background" (5 words max)
- **Specific strengths**: "Built 70-person eng team" not "Good leader"
- **Actionable concerns**: "No customer-facing experience" not "Lacks soft skills"
- **Confidence calibration**: 90+ = excited, 60-74 = worth reviewing

---

## 📝 Input Schema (Apify JSON)

### Complete TypeScript Interface

```typescript
interface ApifyLinkedInProfile {
  // Basic Info
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string | null;
  
  // Contact
  email: string | null;
  mobileNumber: string | null;
  
  // Current Job
  jobTitle: string | null;
  companyName: string | null;
  companyIndustry: string | null;
  companyWebsite: string | null;
  companySize: string | null;
  currentJobDuration: string | null;
  currentJobDurationInYrs: number | null;
  jobStartedOn: string | null; // Format: "MM-YYYY"
  jobStillWorking: boolean | null;
  
  // Location
  addressCountryOnly: string | null;
  addressWithCountry: string | null;
  location: string | null;
  
  // Profile Stats
  connections: number | null;
  followers: number | null;
  isPremium: boolean | null;
  isVerified: boolean | null;
  
  // Content
  about: string | null;
  
  // Arrays (CRITICAL for evaluation)
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  licenseAndCertificates: Certification[];
  
  // Optional
  recommendations?: any[];
  projects?: any[];
  patents?: any[];
  publications?: any[];
}

interface Experience {
  companyName: string | null;
  companyWebsite: string | null;
  companyIndustry: string | null;
  companySize: string | null;
  title: string | null;
  jobDescription: string | null;
  jobStartedOn: string | null;
  jobEndedOn: string | null;
  jobLocation: string | null;
  jobStillWorking: boolean | null;
  employmentType: string | null;
}

interface Language {
  name: string;
  proficiency?: string; // "Native", "Professional", "Limited", "Elementary"
  title?: string;
  subtitle?: string;
}

interface Skill {
  name: string;
  endorsements?: number;
}

interface Education {
  schoolName?: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

interface Certification {
  name: string;
  authority?: string;
  credential_url?: string;
}
```

### Sample Valid Input

```json
[{
  "linkedinUrl": "https://www.linkedin.com/in/jansurovec/",
  "fullName": "Jan Surovec",
  "headline": "Tech Founder | Engineering Leader",
  "jobTitle": "Senior Vice President of Engineering",
  "companyName": "ALICE Technologies Inc.",
  "addressCountryOnly": "Czechia",
  "currentJobDurationInYrs": 2,
  "languages": [
    { "name": "English", "proficiency": "Full Professional" },
    { "name": "Czech", "proficiency": "Native" }
  ],
  "experiences": [
    {
      "title": "Senior Vice President of Engineering",
      "companyName": "ALICE Technologies Inc.",
      "jobDescription": "Building multi-layered engineering department...",
      "jobStartedOn": "11-2023",
      "jobEndedOn": "10-2025",
      "jobStillWorking": false
    }
  ],
  "skills": [
    { "name": "Machine Learning", "endorsements": 50 },
    { "name": "Python", "endorsements": 120 }
  ],
  "about": "Accomplished Engineering Leader with track record..."
}]
```

---

## 📤 Output Schema (Evaluation Result)

### TypeScript Interface

```typescript
interface EvaluationResult {
  // Decision (PASS/REJECT/ERROR)
  decision: 'PASS' | 'REJECT' | 'ERROR';
  
  // Reasoning (MAX 5 words, enforced by Zod)
  reasoning: string; // e.g., "Strong AI leadership, proven track record"
  
  // Confidence (0-100 integer)
  confidence: number;
  
  // Strengths (array of 1-5 specific strengths)
  strengths: string[]; // e.g., ["Built 70-person engineering team", "AI/ML expertise"]
  
  // Concerns (array of 0-5 red flags/concerns)
  concerns: string[]; // e.g., ["Limited customer-facing experience"]
  
  // Language verification
  languageCheck: {
    hasEnglish: boolean;
    hasNativeLanguage: boolean;
    passed: boolean;
    failureReason?: string;
  };
  
  // Metadata
  processingTimeMs: number;
  tokensUsed?: number;
  cost: number;
  evaluationTimestamp: string;
}
```

### Sample Output

```json
{
  "decision": "PASS",
  "reasoning": "Strong AI leadership, proven track record",
  "confidence": 92,
  "strengths": [
    "15+ years backend engineering experience",
    "Built team from 0 to 70 people",
    "Co-founded startup acquired for $200M",
    "Current AI/ML product leadership",
    "Strong customer-facing background"
  ],
  "concerns": [],
  "languageCheck": {
    "hasEnglish": true,
    "hasNativeLanguage": true,
    "passed": true
  },
  "processingTimeMs": 8500,
  "tokensUsed": 3200,
  "cost": 0.048,
  "evaluationTimestamp": "2024-12-01T10:30:00Z"
}
```

---

## 🤖 LLM Prompts (Production-Ready)

### System Prompt

```
You are an expert technical recruiter for Wonderful AI, evaluating candidates for LOCAL CTO positions.

CRITICAL CONTEXT:
- Wonderful AI builds AI-powered voice CRM for enterprises
- Local CTOs must be technical leaders from day one
- They lead sales engineering, build teams, own delivery
- Must be customer-facing, charismatic, hands-on with AI
- Will work with enterprise architects and AWS CTOs

EVALUATION INSTRUCTIONS:
1. Read candidate's FULL profile carefully
2. Check ALL MUST-HAVE criteria (all must pass)
3. Check AUTO-REJECT conditions (any = immediate reject)
4. If all pass: consider BONUS criteria for confidence
5. Reasoning MUST be exactly 5 words or less
6. Be STRICT but FAIR - when borderline, choose PASS

RESPONSE FORMAT (JSON only, no markdown):
{
  "decision": "PASS" or "REJECT",
  "reasoning": "exactly 5 words maximum",
  "confidence": 0-100,
  "strengths": ["up to 5 specific strengths"],
  "concerns": ["up to 5 specific concerns"]
}

CONFIDENCE SCORING:
90-100: Exceptional fit, excited to interview
75-89: Strong fit, clear PASS
60-74: Good fit, minor concerns
40-59: Borderline, review carefully
0-39: Poor fit
```

### Main Evaluation Prompt Template

```typescript
function buildEvaluationPrompt(
  profile: LinkedInProfile,
  enrichedCompanies?: CompanyData[]
): string {
  return `
${SYSTEM_PROMPT}

=== WONDERFUL AI CTO REQUIREMENTS ===

MUST-HAVE (ALL Required):
1. Strong Software Engineering: 7-8+ years hands-on, NOT frontend-only
2. High EQ/Charisma: Leadership language, team building, energy evident
3. AI Experience: Recent (1-2 years) hands-on AI/ML work
4. English Proficiency: Professional level or higher
5. Native Language: Professional level in country's native language
6. Leadership Progression: Junior → Senior → Lead → Director/VP
7. Wonderful Values: Urgency, Professionalism, Independence, Vibe

BONUS (Increase Confidence):
- Customer-facing roles (Solution Architect, Pre-Sales)
- Director/VP/CTO experience
- Startup/founding experience
- Built teams from scratch
- Patents, publications, thought leadership
- Global team experience

AUTO-REJECT:
- < 5 years experience
- Frontend-only
- No English
- No native language
- Zero AI experience
- Career gap > 3 years unexplained
- Only junior roles

${enrichedCompanies ? `
=== COMPANY CONTEXT ===
${formatCompanyData(enrichedCompanies)}
` : ''}

=== CANDIDATE TO EVALUATE ===

Name: ${profile.fullName}
Current Role: ${profile.jobTitle || 'Unknown'}
Company: ${profile.companyName || 'Unknown'}
Location: ${profile.addressCountryOnly || 'Unknown'}
Years Experience: ~${calculateYearsExperience(profile.experiences)}

ABOUT:
${profile.about || 'No about section'}

LANGUAGES:
${formatLanguages(profile.languages)}

EXPERIENCE:
${formatExperiences(profile.experiences)}

SKILLS:
${formatSkills(profile.skills)}

EDUCATION:
${formatEducation(profile.educations)}

CERTIFICATIONS:
${formatCertifications(profile.licenseAndCertificates)}

=== EVALUATE NOW ===

Analyze this candidate against requirements and return ONLY JSON:
`;
}
```

### Language Check Prompt

```typescript
function buildLanguageCheckPrompt(
  languages: Language[],
  country: string
): string {
  const countryLanguageMap = {
    'Greece': 'Greek',
    'Czechia': 'Czech',
    'Czech Republic': 'Czech',
    'France': 'French',
    'Belgium': ['Dutch', 'French', 'German'],
    'Germany': 'German',
    'Italy': 'Italian',
    'Spain': 'Spanish',
    'Portugal': 'Portuguese',
    'Poland': 'Polish',
    // ... more mappings
  };
  
  const requiredNative = countryLanguageMap[country];
  
  return `
Verify language requirements for CTO candidate in ${country}.

REQUIREMENTS:
1. English at "Professional", "Full Professional", "Native", or "Bilingual"
2. ${requiredNative} at "Professional" level or higher

CANDIDATE'S LANGUAGES:
${languages.map(l => `- ${l.name}: ${l.proficiency || 'Not specified'}`).join('\n')}

Return JSON:
{
  "hasEnglish": boolean,
  "hasNativeLanguage": boolean,
  "passed": boolean,
  "failureReason": "string if failed"
}
`;
}
```

### Company Enrichment Prompt

```typescript
function buildCompanyResearchPrompt(
  companyName: string,
  website?: string
): string {
  return `
Research this company to provide context for evaluating a CTO candidate.

COMPANY: ${companyName}
${website ? `WEBSITE: ${website}` : ''}

Extract and return JSON:
{
  "summary": "2-3 sentence overview of what company does",
  "stage": "startup|scaleup|enterprise|public|unknown",
  "size": "1-10|11-50|51-200|201-500|501-1000|1000+|unknown",
  "reputation": "high|medium|low|unknown",
  "techStack": ["key technologies"],
  "notableInfo": "Funding, acquisition, notable achievements",
  "isWellKnown": boolean // Google, Microsoft, Amazon, etc.
}

Focus on FACTS. Be concise. If unknown company, state clearly.
`;
}
```

---

## 🎨 UI/UX Specifications

### Design Principles
1. **Speed**: Fast loading, instant feedback
2. **Clarity**: Clear CTAs, obvious next steps
3. **Trust**: Show confidence scores, explain decisions
4. **Efficiency**: Keyboard shortcuts, batch actions
5. **Professional**: Clean, modern, enterprise-ready

### Color Palette

```typescript
const colors = {
  // Decisions
  pass: {
    bg: '#10B981', // green-500
    text: '#FFFFFF',
    light: '#D1FAE5' // green-100
  },
  reject: {
    bg: '#EF4444', // red-500
    text: '#FFFFFF',
    light: '#FEE2E2' // red-100
  },
  pending: {
    bg: '#F59E0B', // amber-500
    text: '#FFFFFF',
    light: '#FEF3C7' // amber-100
  },
  
  // UI
  primary: '#3B82F6', // blue-500
  secondary: '#6B7280', // gray-500
  background: '#F9FAFB', // gray-50
  surface: '#FFFFFF',
  border: '#E5E7EB', // gray-200
  text: {
    primary: '#111827', // gray-900
    secondary: '#6B7280', // gray-500
    muted: '#9CA3AF' // gray-400
  }
};
```

### Key Pages

#### 1. Dashboard (`/`)
```
┌─────────────────────────────────────────┐
│  📊 Dashboard - Hire Me, Wonderful AI   │
├─────────────────────────────────────────┤
│                                          │
│  [New Screening] [View All]             │
│                                          │
│  📈 Quick Stats                          │
│  ┌──────┬──────┬──────┬──────┐          │
│  │ 450  │ 12%  │ $42  │ 2.3h │          │
│  │Total │Pass  │Cost  │Avg   │          │
│  └──────┴──────┴──────┴──────┘          │
│                                          │
│  🔄 Active Screenings                    │
│  ┌────────────────────────────────────┐ │
│  │ Greece CTO - Batch 1               │ │
│  │ ████████░░░░░░░░░░ 45/100         │ │
│  │ 12 passed • 33 rejected           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  📋 Recent Screenings                    │
│  [List of past screenings]              │
│                                          │
└─────────────────────────────────────────┘
```

#### 2. Upload Flow (`/screenings/new`)
```
Step 1: Create Screening
┌─────────────────────────────────────────┐
│  Name: [Greece CTO - January 2025]     │
│  Description: [Optional notes...]       │
│  Criteria: [v1 - Default ▼]            │
│                                          │
│              [Next]                      │
└─────────────────────────────────────────┘

Step 2: Upload Candidates
┌─────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗  │
│  ║  Drag & Drop JSON file here      ║  │
│  ║  or click to browse               ║  │
│  ╚═══════════════════════════════════╝  │
│                                          │
│  ✓ candidates.json (2.3 MB)             │
│  150 profiles • 5 countries             │
│                                          │
│              [Next]                      │
└─────────────────────────────────────────┘

Step 3: Configure
┌─────────────────────────────────────────┐
│  Enrichment Level:                      │
│  ⚪ Quick ($3)    ⦿ Standard ($6)       │
│  ⚪ Deep ($10)                           │
│                                          │
│  Filters (Optional):                    │
│  Country: [All ▼]                       │
│  Min Experience: [5 years]              │
│                                          │
│  💰 Estimated Cost: $6.00               │
│  ⏱️ Estimated Time: 12 minutes          │
│                                          │
│         [Start Screening]                │
└─────────────────────────────────────────┘
```

#### 3. Progress Monitor (`/screenings/[id]/progress`)
```
┌─────────────────────────────────────────┐
│  🔄 Screening in Progress...            │
│                                          │
│  ████████████████░░░░ 75/100 (75%)     │
│                                          │
│  ⏱️ Time Remaining: ~3 minutes          │
│  💰 Cost So Far: $4.50                  │
│                                          │
│  ✅ Passed: 12                          │
│  ❌ Rejected: 63                        │
│  ⚠️ Errors: 0                           │
│                                          │
│  Currently Processing:                  │
│  Maria Papadopoulos                     │
│  VP Engineering @ Alpha Bank            │
│                                          │
└─────────────────────────────────────────┘
```

#### 4. Results Dashboard (`/screenings/[id]/results`)
```
┌─────────────────────────────────────────┐
│  📊 Greece CTO - Batch 1 Results        │
│                                          │
│  Filters:                  [Export ▼]   │
│  ⦿ All  ⚪ PASS  ⚪ REJECT              │
│  Confidence: [60───●───100]             │
│  Search: [____________________]         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ✅ Maria Papadopoulos         92%  │ │
│  │ VP Engineering @ Alpha Bank        │ │
│  │ Athens, Greece                     │ │
│  │ "Strong AI leadership background"  │ │
│  │ [View Details →]                   │ │
│  ├────────────────────────────────────┤ │
│  │ ✅ Dimitris Kostas            88%  │ │
│  │ Director Engineering @ Beta Tech   │ │
│  │ Thessaloniki, Greece               │ │
│  │ "Exceptional technical depth"      │ │
│  │ [View Details →]                   │ │
│  ├────────────────────────────────────┤ │
│  │ ❌ John Smith                 35%  │ │
│  │ Frontend Developer @ Startup       │ │
│  │ Athens, Greece                     │ │
│  │ "Frontend only, insufficient exp"  │ │
│  │ [View Details →]                   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Showing 1-20 of 150                    │
│  [← Previous] [Next →]                  │
│                                          │
└─────────────────────────────────────────┘
```

#### 5. Candidate Detail (`/screenings/[id]/candidates/[candidateId]`)
```
┌─────────────────────────────────────────┐
│  👤 Maria Papadopoulos                  │
│  [Profile Photo]                        │
│                                          │
│  ✅ PASS • 92% Confidence               │
│  "Strong AI leadership background"      │
│                                          │
│  [Open LinkedIn] [Shortlist]            │
│  [Add Notes] [Override Decision]        │
│                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                          │
│  📋 Profile Summary                      │
│  Current: VP Engineering @ Alpha Bank   │
│  Location: Athens, Greece               │
│  Experience: 12 years                   │
│  Languages: Greek (Native), English     │
│                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                          │
│  ✅ Strengths                            │
│  • 12+ years backend engineering        │
│  • Built AI-powered CRM platform        │
│  • Led 40-person engineering team       │
│  • Strong customer-facing background    │
│  • Startup founding experience          │
│                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                          │
│  ⚠️ Concerns                             │
│  • No previous CTO title                │
│                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                          │
│  💼 Experience (Click to expand)         │
│  🎓 Education                            │
│  🛠️ Skills                               │
│  🏆 Certifications                       │
│  🏢 Company Research                     │
│                                          │
└─────────────────────────────────────────┘
```

---

## ⚙️ Implementation Guide for Claude Code

### Phase 1: Foundation (Week 1)

**Day 1-2: Project Setup**
```bash
# Initialize Next.js project
npx create-next-app@latest hire-me-wonderful --typescript --app --tailwind

# Install core dependencies
pnpm add @prisma/client @vercel/postgres zod
pnpm add openai @tavily/core @mastra/core
pnpm add -D prisma

# Initialize Prisma
npx prisma init

# Setup environment variables
cp .env.example .env.local
```

**Day 3-4: Database Schema**
- Implement Prisma schema (see TECHNICAL_ARCHITECTURE.md)
- Create migrations
- Test database connections
- Seed with test data

**Day 5-7: Core API Routes**
- `/api/screenings` - CRUD operations
- `/api/upload` - File upload and validation
- `/api/candidates` - Candidate operations
- `/api/results` - Results queries

### Phase 2: Core Features (Week 2-3)

**Week 2: Upload & Validation**
- File upload component with drag-and-drop
- Apify JSON validation (Zod)
- Preview component showing stats
- Batch candidate insertion

**Week 3: Evaluation Engine**
- OpenRouter integration
- Tavily integration
- Language verification logic
- Company enrichment logic
- Main evaluation function
- Error handling and retries

### Phase 3: Workflows (Week 4)

**Vercel WDK Integration**
- Screening workflow implementation
- Progress tracking
- Error recovery
- Cost tracking
- Webhook notifications (optional)

### Phase 4: UI Polish (Week 5)

**Dashboard & Results**
- Dashboard with statistics
- Results table with filtering
- Candidate detail view
- Export functionality
- Mobile responsive design

### Phase 5: Testing & Deploy (Week 6)

**Testing**
- Unit tests for evaluation logic
- Integration tests for API routes
- E2E tests for critical flows
- Load testing with 500 candidates

**Deployment**
- Deploy to Vercel
- Configure environment variables
- Setup monitoring
- User acceptance testing

---

## 📊 Success Metrics

### Technical Metrics
- [ ] Process 100 candidates in < 15 minutes
- [ ] < 1% API error rate
- [ ] 90%+ uptime
- [ ] < 2 second page load
- [ ] Mobile responsive (all devices)

### Business Metrics
- [ ] 90%+ evaluation accuracy (validated manually)
- [ ] < $10 cost per 100 candidates
- [ ] 20+ hours time saved per screening
- [ ] 10-20% pass rate (not too high or low)

### User Experience
- [ ] No training required (intuitive UI)
- [ ] Positive feedback from 3+ test users
- [ ] < 5 minutes to start first screening
- [ ] Complete documentation

---

## 🚀 Getting Started Commands

### For Claude Code

```bash
# 1. Clone repository structure
mkdir hire-me-wonderful-ai && cd hire-me-wonderful-ai

# 2. Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --app --tailwind --no-src-dir

# 3. Install dependencies
pnpm add @prisma/client @vercel/postgres zod openai @tavily/core
pnpm add -D prisma typescript @types/node @types/react

# 4. Initialize Prisma
npx prisma init --datasource-provider postgresql

# 5. Copy schema from TECHNICAL_ARCHITECTURE.md to prisma/schema.prisma

# 6. Create database migration
npx prisma migrate dev --name init

# 7. Generate Prisma client
npx prisma generate

# 8. Create directory structure
mkdir -p app/{api,screenings,analytics,criteria}
mkdir -p lib/{ai,enrichment,schemas,utils}
mkdir -p components/{ui,layout,screening,candidate,results}
mkdir -p workflows

# 9. Copy schemas from DATA_SCHEMAS.md to lib/schemas/

# 10. Copy prompts from PROMPTS.md to lib/ai/prompts.ts

# 11. Implement API routes (see API_INTEGRATION.md)

# 12. Implement workflows (see TECHNICAL_ARCHITECTURE.md)

# 13. Build UI components (see this document's UI specs)

# 14. Test locally
pnpm dev

# 15. Deploy to Vercel
vercel --prod
```

---

## 📚 Documentation References

All supporting documentation is in `/mnt/user-data/outputs/`:

1. **PROJECT_SPECIFICATION.md** - Detailed requirements and user personas
2. **TECHNICAL_ARCHITECTURE.md** - System design, database schema, workflows
3. **DATA_SCHEMAS.md** - All Zod schemas and TypeScript types
4. **PROMPTS.md** - All LLM prompts with examples
5. **API_INTEGRATION.md** - OpenRouter, Tavily, Postgres integration
6. **USER_GUIDE.md** - End-user documentation

---

## ✅ Final Checklist for Claude Code

Before starting development, ensure:
- [ ] You have read all 6 documentation files
- [ ] You understand the hiring criteria based on real examples
- [ ] You know the exact input/output schemas
- [ ] You have the prompts ready to implement
- [ ] You understand the workflow architecture
- [ ] You know the UI/UX requirements
- [ ] You have access to all API keys (OpenRouter, Tavily)
- [ ] Vercel project is created and connected

**Now you have EVERYTHING needed to build this application from scratch. Good luck! 🚀**

---

## 🎯 Core Philosophy

Remember these principles throughout development:

1. **Accuracy Over Speed**: Better to take 20 seconds per candidate and be accurate than 5 seconds and miss good CTOs
2. **Transparency**: Always show WHY a decision was made (reasoning, strengths, concerns)
3. **Trust But Verify**: AI is 90% accurate - always enable human review for borderline cases
4. **Evidence-Based**: Every claim must be backed by specific profile content
5. **User First**: The tool should make Dvir's life easier, not more complicated

**This is a critical hiring tool. Quality and reliability are paramount.**
