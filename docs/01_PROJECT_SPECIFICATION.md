# Hire Me, Wonderful AI - Project Specification

## 1. Executive Summary

**Project Name:** Hire Me, Wonderful AI  
**Version:** 1.0.0  
**Last Updated:** December 1, 2025  
**Project Owner:** Dvir (Wonderful AI - Freelance Recruiter)

### Purpose
Automate the screening and evaluation of Local CTO candidates for Wonderful AI's global expansion, reducing manual screening time from 20-30 hours per 100 candidates to under 3 hours while maintaining high-quality candidate selection.

### Problem Statement
Wonderful AI is expanding globally and needs to hire Local CTOs for each new site. Currently, manual screening of LinkedIn profiles is time-consuming, inconsistent, and prone to missing qualified candidates or including unqualified ones. Each site needs a technical leader from day one who can handle pre-sales, implementation, team building, and customer-facing technical discussions.

### Solution Overview
A TypeScript-based web application that:
1. **Ingests** LinkedIn profile data from Apify scraper
2. **Enriches** company information using Tavily search
3. **Evaluates** candidates using AI agents (via Mastra AI)
4. **Scores** candidates against comprehensive criteria
5. **Presents** results in an interactive dashboard
6. **Saves** all screening sessions for historical reference

---

## 2. Background & Context

### 2.1 The Local CTO Role at Wonderful AI

Wonderful AI operates with a decentralized model where each country site functions as an independent high-tech startup. The Country Manager (CM) acts as CEO, and the Local CTO is their technical co-founder.

#### Why Every Site Needs a CTO from Day One

**Real-world example:** During a POC in Greece with a local Amazon-like business, Wonderful AI attempted to support the GM remotely using HQ resources:
- Integration engineer from Israel
- Customer success for meetings
- CoS for setup
- Engineers for tech oversight

**The Problem:** Nobody owned the technical delivery end-to-end. This resulted in delivery mistakes and inefficiencies. A GM needs a dedicated CTO to own:
- POCs (Proof of Concepts)
- Pre-sale technical meetings
- Technical delivery
- Team building as the site scales

#### CTO Responsibilities (Progressive Complexity)

**Phase 1: Solo Technical Leader (Months 0-6)**
- Demo the product to enterprise customers
- Present AI Architecture, Cloud infrastructure, Deployment options
- Handle Security & Privacy discussions (SOC2, GDPR, PCI compliance)
- Overcome technical objections in sales meetings
- Build and deploy AI agents for customers
- Integrate with customer API Gateways
- Own all POC delivery

**Phase 2: Team Builder (Months 6-18)**
- Hire Pre-Sales engineers and Solution Architects
- Recruit Agent Engineers (train first, then expand)
- Build Software Engineering team
- Create hiring pipelines for technical talent
- Establish engineering culture

**Phase 3: Strategic Leader (Months 18+)**
- Lead Product for the site (hire PM when ready)
- Manage technology partnerships (AWS, Azure, Google Cloud)
- Represent site in company-wide R&D and CTO guilds
- Drive platform feature development for local needs
- Build back-office tools for operational efficiency

### 2.2 Candidate Requirements

#### Must-Haves (Hard Requirements)
1. **Strong software engineering background** - Minimum 7-8 years hands-on engineering
   - NOT frontend-only experience
   - Must show depth in backend, systems, or full-stack
   - Evidence of building production systems at scale

2. **High EQ / Charisma / Energy / Inspiring personality**
   - Can command a room of 30 enterprise architects
   - Can hold 1-on-1 meetings with CTOs of AWS/Azure/Google
   - Natural ability to inspire and lead
   - Validated by: personal growth trajectory, leadership roles, speaking engagements

3. **Hands-On (Current or Recent)**
   - Either currently coding in their role
   - OR actively coding as a hobby/side project
   - Must be up-to-date with AI/ML technologies
   - Should demonstrate curiosity and continuous learning

4. **Strong English Skills**
   - Written and spoken proficiency (minimum C1 level)
   - Can present technical architecture to global audiences
   - Can write clear documentation and technical specs

5. **Native Language Proficiency**
   - Must be at least "Professional working proficiency" in the native language of their current country
   - Required for local customer relationships
   - Critical for building local teams

#### Wonderful AI's Core Values (Expected in CTOs)
- **Urgency** - Moves fast, doesn't wait for perfect conditions
- **Professionalism** - High standards in communication and delivery
- **Independence** - Self-starter, figures things out
- **Vibe** - Positive energy, team player, cultural fit

#### Bonus Points (Nice-to-Haves)
1. **Customer-facing background**
   - Solution Architect experience
   - Field CTO or Deployed Engineer roles
   - Technical Pre-Sales
   - Evidence of customer presentations

2. **Proven leadership**
   - Director / VP / SVP titles
   - Team building experience (scaled teams from small to large)
   - Hiring track record

3. **Startup background**
   - Product company experience (not consulting/services)
   - Founding team member is ideal
   - Experience with 0-to-1 building
   - Worked through company growth stages

4. **Personal growth trajectory**
   - Clear career progression
   - Increasing scope of responsibilities
   - Demonstrated learning and adaptation
   - Note: Lack of growth usually indicates technical weakness OR low EQ

### 2.3 Successful CTO Profile Patterns

Based on analysis of 5 CTOs already hired by Wonderful AI:

#### Profile 1: Jan Surovec (Czech Republic)
- **Role:** SVP/VP Engineering at ALICE Technologies
- **Key Traits:**
  - Co-founded Sapho → scaled R&D from 1 to 70 people
  - Led through $200M acquisition by Citrix
  - Started programming at age 9 (deep technical roots)
  - Multiple patents (innovation mindset)
  - 18+ years hands-on experience
  - Strong technical + leadership combination
  
#### Profile 2: Ilia Kantor (Russia → Czech Republic)
- **Role:** CEO/Co-founder at Wonderful AI
- **Key Traits:**
  - Created javascript.info (massive educational platform, shows expertise + giving back)
  - Multiple successful startups
  - Strong technical authority + business acumen
  - International presence and reach
  
#### Profile 3: Dor Gil (Israel)
- **Role:** Multiple CTO/VP Eng positions
- **Key Traits:**
  - Founded multiple companies
  - Led technical teams through growth
  - Strong startup background
  - Multiple exits (execution + results)
  
#### Profile 4: Roy Eitan (Israel)
- **Role:** VP positions at growing companies
- **Key Traits:**
  - Premium LinkedIn (professional presence)
  - 9K+ followers (thought leadership)
  - Strong network and industry connections

#### Profile 5: Additional Patterns
- Strong technical depth combined with business/customer skills
- International experience or multi-language capability
- Product company background (not just services/consulting)

#### Common Success Patterns
1. **Founder/Co-founder experience** (3 out of 5)
2. **Scaled teams from small to large** (all 5)
3. **VP/SVP/Director level titles** (all 5)
4. **10+ years experience** (all 5)
5. **Mix of technical depth + business/customer skills** (all 5)
6. **International experience or multi-language capability** (4 out of 5)
7. **Product company background** (all 5)
8. **Strong online presence** (4 out of 5 have notable LinkedIn engagement)

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Component | Technology | Purpose | Rationale |
|-----------|-----------|---------|-----------|
| **Framework** | Next.js 15 | Web application framework | Modern, type-safe, excellent DX |
| **Language** | TypeScript | Type safety across entire stack | Catch errors at compile time |
| **Workflow Engine** | Vercel WDK (Workflow Development Kit) | Orchestrate multi-step screening process | Built for Next.js, handles state management |
| **AI Agent Framework** | Mastra AI | Agent-based evaluation logic | Modular, maintainable AI workflows |
| **Schema Validation** | Zod | Input/output type safety | Runtime validation + TypeScript types |
| **AI Gateway** | OpenRouter | Access to multiple LLM providers | Cost optimization, fallback options |
| **Primary LLM** | Claude Opus 4.5 | Final candidate screening | Best reasoning for complex evaluation |
| **Search API** | Tavily | Company enrichment | Specialized for AI applications |
| **Database** | Vercel Postgres | Store screening results | Integrated with Vercel ecosystem |
| **UI Components** | shadcn/ui | Component library | Accessible, customizable |
| **Styling** | Tailwind CSS | Utility-first CSS | Fast development, consistent design |

### 3.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │  Upload      │  │  Results     │          │
│  │              │  │  Profiles    │  │  Viewer      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL WDK WORKFLOWS                         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Screening Workflow                                  │       │
│  │  1. Parse LinkedIn JSON                              │       │
│  │  2. Validate with Zod schemas                        │       │
│  │  3. Extract companies for enrichment                 │       │
│  │  4. Enrich company data (Tavily)                     │       │
│  │  5. Evaluate candidate (Mastra AI)                   │       │
│  │  6. Generate final decision (Claude Opus 4.5)        │       │
│  │  7. Store results (Postgres)                         │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MASTRA AI AGENTS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Profile     │  │  Company     │  │  Language    │          │
│  │  Parser      │  │  Enricher    │  │  Checker     │          │
│  │  Agent       │  │  Agent       │  │  Agent       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Experience  │  │  Leadership  │  │  Final       │          │
│  │  Evaluator   │  │  Evaluator   │  │  Decision    │          │
│  │  Agent       │  │  Agent       │  │  Agent       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  OpenRouter  │  │  Tavily API  │  │  Vercel      │          │
│  │  (Claude)    │  │  (Search)    │  │  Postgres    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow

```
[Apify JSON File] 
    │
    ├─▶ [Parse & Validate]
    │       │
    │       └─▶ Zod Schema Validation
    │
    ├─▶ [Extract Companies]
    │       │
    │       └─▶ Get top 3 most recent employers
    │
    ├─▶ [Enrich Companies] ────▶ Tavily Search API
    │       │                       │
    │       │                       └─▶ Company info, reputation, tech stack
    │       │
    │       └─▶ [Enriched Company Data]
    │
    ├─▶ [Evaluate Candidate] ───▶ Mastra AI Agents
    │       │                       │
    │       │                       ├─▶ Profile Parser Agent
    │       │                       ├─▶ Experience Evaluator Agent
    │       │                       ├─▶ Leadership Evaluator Agent
    │       │                       ├─▶ Language Checker Agent
    │       │                       └─▶ Company Background Agent
    │       │
    │       └─▶ [Intermediate Scores & Analysis]
    │
    ├─▶ [Final Decision] ────────▶ Claude Opus 4.5 via OpenRouter
    │       │                       │
    │       │                       └─▶ Synthesizes all data
    │       │                           Makes PASS/REJECT decision
    │       │
    │       └─▶ [Final Evaluation Result]
    │
    └─▶ [Store in Database] ─────▶ Vercel Postgres
            │
            └─▶ [Results Dashboard]
```

---

## 4. Success Metrics

### 4.1 Efficiency Metrics
- **Time Savings:** 
  - Manual screening: 20-30 hours per 100 candidates
  - Automated screening: < 3 hours per 100 candidates
  - **Target:** 90% time reduction

### 4.2 Quality Metrics
- **False Negative Rate:** < 5%
  - Measure: Manually review REJECT pile, identify missed good candidates
- **False Positive Rate:** < 10%
  - Measure: Interview PASS candidates, track how many are not qualified
- **Precision:** > 85%
  - Measure: Of candidates marked PASS, what % advance to interview stage

### 4.3 Cost Metrics
- **Cost per Candidate:** $0.03 - $0.06
- **ROI:** 
  - Dvir's hourly rate: 160 ILS (~$45 USD)
  - Time saved per 100 candidates: 25 hours
  - Manual cost: $1,125
  - Automated cost: ~$5 (100 × $0.05)
  - **Savings: $1,120 per 100 candidates**

---

This specification serves as the foundation for implementation. Additional technical documents follow with detailed schemas, prompts, and implementation guides.
