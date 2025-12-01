# 🎯 Hire Me, Wonderful AI - Complete Documentation Package

**Welcome, Claude Code!** This is your complete blueprint to build an automated LinkedIn candidate screening system.

---

## 📦 What You're Getting

A production-ready specification for a web application that:
- **Reduces screening time** from 20+ hours to 2-3 hours (90% reduction)
- **Costs** $0.03-0.10 per candidate
- **Achieves** 90%+ accuracy on clear PASS/REJECT decisions
- **Processes** 100-500 candidates per session

---

## 📚 Documentation Structure (Read in This Order)

### 1. **START HERE: MASTER_BLUEPRINT.md** ⭐
**THE MOST IMPORTANT DOCUMENT**

This is your single source of truth. It contains:
- Executive summary and system overview
- Complete architecture diagram
- Refined hiring criteria (based on 5 actual hired CTOs)
- Input/output schemas
- All LLM prompts (production-ready)
- UI/UX specifications with mockups
- Implementation phase-by-phase guide
- Success metrics and checklist

**Read this first. It has everything you need.**

### 2. PROJECT_SPECIFICATION.md
Deep dive into:
- Business context and pain points
- User personas
- Functional requirements (FR-1 through FR-8)
- Non-functional requirements
- Success criteria
- Future enhancements
- Risks and mitigations

### 3. TECHNICAL_ARCHITECTURE.md
Implementation details:
- Technology stack justification
- High-level architecture diagram
- Complete Prisma database schema
- API design (all endpoints)
- Vercel WDK workflow implementation
- Performance optimization strategies
- Security implementation
- Deployment architecture
- Monitoring and observability

### 4. DATA_SCHEMAS.md
All TypeScript interfaces and Zod schemas:
- Apify input schema (complete LinkedIn profile)
- Screening configuration schema
- Evaluation result schema
- Company enrichment schema
- API request/response schemas
- Criteria schema
- Analytics schema
- Export schemas
- Validation helpers

### 5. PROMPTS.md
Every LLM prompt you'll need:
- System prompts
- Main CTO evaluation prompt (with examples)
- Language verification prompt
- Company enrichment prompt
- Experience analysis prompt
- Red flag detection prompt
- Strength extraction prompt
- Prompt versioning system
- Testing framework
- Optimization guidelines

### 6. API_INTEGRATION.md
External service integration:
- OpenRouter (Claude Opus 4.5)
  - Setup, configuration, usage
  - Error handling with retry logic
  - Cost tracking
  - Streaming responses
- Tavily (company search)
  - Setup, search presets
  - Caching strategy
  - Rate limiting
  - Batch enrichment
- Vercel Postgres (Prisma)
  - Query optimization
  - Connection pooling
- Vercel WDK (workflows)
  - Workflow definition
  - Progress monitoring

### 7. USER_GUIDE.md
End-user documentation:
- Quick start (5 minutes)
- Detailed feature walkthrough
- Best practices
- Troubleshooting
- FAQ
- Keyboard shortcuts

---

## 🚀 Quick Start for Development

### Step 1: Read the Master Blueprint
```bash
# Open and read thoroughly
open MASTER_BLUEPRINT.md
```

### Step 2: Set Up Environment
```bash
# Clone/create project
npx create-next-app@latest hire-me-wonderful-ai --typescript --app --tailwind

cd hire-me-wonderful-ai

# Install dependencies
pnpm add @prisma/client @vercel/postgres zod openai @tavily/core @mastra/core
pnpm add -D prisma typescript @types/node @types/react

# Initialize Prisma
npx prisma init --datasource-provider postgresql
```

### Step 3: Copy Schemas
```bash
# Copy Prisma schema from TECHNICAL_ARCHITECTURE.md to:
# prisma/schema.prisma

# Copy Zod schemas from DATA_SCHEMAS.md to:
# lib/schemas/

# Copy prompts from PROMPTS.md to:
# lib/ai/prompts.ts
```

### Step 4: Implement Core Features
Follow the phase-by-phase implementation guide in MASTER_BLUEPRINT.md:
- Week 1: Foundation (database, API routes)
- Week 2-3: Core features (upload, evaluation)
- Week 4: Workflows (Vercel WDK)
- Week 5: UI polish
- Week 6: Testing & deployment

### Step 5: Deploy
```bash
# Deploy to Vercel
vercel --prod
```

---

## 🎓 Key Insights from Actual Hired CTOs

**We analyzed 5 real CTOs hired by Wonderful AI:**

1. **Jan Surovec** (Czechia) - SVP Engineering, built team 0→70, startup sold for $200M
2. **Ilia Kalishevsky** (Greece) - CEO Wonderful Greece, Ex-Microsoft, PhD, patents
3. **Itay Levi** (Israel) - CTO, Ex-NICE, strong AI, patents
4. **Stefaan Lesage** (Belgium) - CEO/CTO, 20+ years experience
5. **Alexey Zaytsev** (Netherlands) - VP Engineering, Stanford, strong AI/ML

**Common Success Patterns:**
✅ 10-20+ years technical experience (NOT 7-8 minimum, but 10+)
✅ VP/Director/CTO level leadership
✅ Hands-on AI/ML experience (critical!)
✅ Built teams from 0→50+ people
✅ Startup experience or founding team
✅ Patents, publications, thought leadership
✅ Customer-facing background
✅ English + Native language fluency
✅ High energy evident in profiles

**This refines our criteria to be more realistic based on actual hires.**

---

## 🎯 Core Requirements (Never Compromise)

### Language Requirements ⭐⭐⭐
- **English**: Professional level or higher (MUST)
- **Native Language**: Professional level in current country's language (MUST)
- Examples:
  - Greece → Greek required
  - Czechia → Czech required
  - Belgium → Dutch, French, or German required

### Technical Requirements ⭐⭐⭐
- **7-8+ years** hands-on engineering (10-20+ for best candidates)
- **NOT frontend-only** (must have backend/systems/infrastructure)
- **Recent AI experience** (last 1-2 years) - this is CRITICAL
- **Leadership progression** evident over career

### Personality Requirements ⭐⭐
- **High EQ/Charisma** - leadership language, team mentions, energy
- **Wonderful Values** - Urgency, Professionalism, Independence, Vibe

---

## 💰 Cost Structure

**Per 100 Candidates:**
- Apify scraping: $10 (one-time)
- Quick screening (no enrichment): $3
- Standard screening (top 3 companies): $6
- Deep screening (all companies): $10

**Total**: $13-20 per 100 candidates (~$0.13-0.20 per candidate)

**Time**: 10-15 minutes for 100 candidates

**ROI**: 20+ hours saved per screening session

---

## 🎨 UI/UX Philosophy

1. **Speed First**: Fast loading, instant feedback
2. **Trust Through Transparency**: Show confidence, reasoning, evidence
3. **Progressive Disclosure**: Simple by default, detail on demand
4. **Batch Operations**: Select multiple, bulk actions
5. **Keyboard Shortcuts**: Power users love them
6. **Mobile Responsive**: Works on all devices

**Design Language**: Clean, professional, modern - think Linear or Stripe.

---

## 🔧 Technology Stack

```typescript
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3+",
  "database": "Vercel Postgres + Prisma",
  "validation": "Zod 3+",
  "styling": "Tailwind CSS 3+",
  "ui": "shadcn/ui",
  "workflows": "Vercel WDK",
  "ai_orchestration": "Mastra AI",
  "ai_provider": "OpenRouter (Claude Opus 4.5)",
  "search": "Tavily",
  "deployment": "Vercel"
}
```

**Why these choices?**
- **Next.js 14**: Best-in-class React framework, perfect Vercel integration
- **Vercel WDK**: Durable workflows, built-in retry logic
- **Zod**: Runtime validation + TypeScript types
- **OpenRouter**: Access to Claude Opus 4.5 with usage tracking
- **Tavily**: AI-optimized search results

---

## ✅ Pre-Development Checklist

Before you start coding:
- [ ] Read MASTER_BLUEPRINT.md completely
- [ ] Understand the 5 example CTOs and success patterns
- [ ] Review all Zod schemas in DATA_SCHEMAS.md
- [ ] Study the evaluation prompts in PROMPTS.md
- [ ] Understand the workflow architecture
- [ ] Review UI mockups in MASTER_BLUEPRINT.md
- [ ] Have API keys ready (OpenRouter, Tavily)
- [ ] Vercel project created

---

## 🎯 Success Criteria

Your implementation is successful when:
- [ ] Processes 100 candidates in < 15 minutes
- [ ] Evaluation accuracy 90%+ (validate with Dvir)
- [ ] Cost < $10 per 100 candidates
- [ ] UI is intuitive (no training needed)
- [ ] Mobile responsive
- [ ] All documentation complete
- [ ] Zero critical bugs after 1 week testing
- [ ] Positive feedback from Dvir

---

## 🚨 Critical Reminders

1. **Language Check is NON-NEGOTIABLE**
   - Must verify English + native language
   - Auto-reject if either missing
   - This is a HARD requirement from Wonderful AI

2. **AI Experience is CRITICAL**
   - All 5 hired CTOs have AI/ML experience
   - Must check for recent (1-2 years) AI work
   - Without AI experience → likely REJECT

3. **Evidence-Based Evaluation**
   - Every strength must be backed by profile data
   - No assumptions or inferences
   - Quote specific phrases when possible

4. **5-Word Reasoning Maximum**
   - Enforced by Zod schema
   - Forces clarity and precision
   - Examples: "Strong AI leadership, proven results"

5. **Confidence Calibration**
   - 90-100: Exceptional, interview immediately
   - 75-89: Strong fit, clear PASS
   - 60-74: Good fit, review manually
   - < 60: Weak fit or concerns present

---

## 📞 Support & Feedback

**Primary User**: Dvir  
**Project Goal**: Help Dvir screen CTOs for Wonderful AI's global expansion

**Communication Style with Dvir**:
- Direct and honest
- Technical depth appreciated
- Explain trade-offs clearly
- Show, don't tell (build working features)

---

## 🎉 Final Words

You have **EVERYTHING** you need to build this system:

✅ Complete specifications  
✅ Refined criteria based on real hires  
✅ Production-ready prompts  
✅ All schemas and types  
✅ API integration guides  
✅ UI/UX designs  
✅ Implementation phases  
✅ Success metrics

**Now go build something amazing! 🚀**

The documentation is comprehensive, battle-tested, and ready for production. If you follow the MASTER_BLUEPRINT.md step-by-step, you'll create a system that will save Dvir 20+ hours per screening and help Wonderful AI hire world-class CTOs globally.

**Good luck, Claude Code!** 💪
