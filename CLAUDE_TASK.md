# Task: Build Hire Me, Wonderful AI

## 🎯 Your Mission

Build a production-ready web application that automates LinkedIn candidate screening for CTO positions at Wonderful AI.

## 📚 Complete Documentation Available

All specifications are in `/docs/` folder. **START BY READING**:

1. **MASTER_BLUEPRINT.md** ⭐ (MUST READ - contains everything)
2. **EDGE_CASES_AND_MISSING_DATA.md** (handling incomplete data)
3. Reference other docs in `/docs/` as needed

## 🏗️ What To Build

### Core Application
- **Next.js 14** web application (App Router, TypeScript)
- **Upload system** for Apify LinkedIn JSON files
- **Automated screening workflow** using Vercel WDK
- **AI evaluation engine** using Claude Opus 4.5 via OpenRouter
- **Company enrichment** using Tavily search API
- **Results dashboard** with filtering and export
- **Complete UI** with all screens from MASTER_BLUEPRINT

### Technology Requirements (MUST USE)
- Framework: Next.js 14 (App Router) + TypeScript
- Database: Vercel Postgres + Prisma ORM
- Validation: Zod
- Workflows: Vercel WDK
- AI: OpenRouter (Claude Opus 4.5 - model: "anthropic/claude-opus-4-20250514")
- Search: Tavily
- UI: shadcn/ui + Tailwind CSS

## 📋 Implementation Steps

### Phase 1: Foundation (Start Here)
1. Initialize Next.js 14 with TypeScript and App Router
2. Setup Prisma with the database schema from MASTER_BLUEPRINT.md
3. Create all Zod schemas from MASTER_BLUEPRINT.md
4. Setup basic project structure

### Phase 2: Core API
1. Implement `/api/upload` - validate and import Apify JSON
2. Implement `/api/screenings` - CRUD operations
3. Implement language verification logic
4. Implement company enrichment with Tavily
5. Implement AI evaluation with OpenRouter

### Phase 3: Workflows
1. Setup Vercel WDK
2. Create screening workflow
3. Implement progress tracking
4. Add error handling and retries

### Phase 4: UI
1. Build Dashboard page
2. Build Upload flow (3 steps)
3. Build Progress monitor
4. Build Results dashboard
5. Build Candidate detail view

### Phase 5: Polish
1. Add filtering and search
2. Implement export (CSV, JSON, PDF)
3. Add error handling throughout
4. Implement loading states
5. Make mobile responsive

## ⚠️ CRITICAL REQUIREMENTS

### 1. Language Verification (NON-NEGOTIABLE)
- MUST check English + native language for country
- Implement inference logic from EDGE_CASES_AND_MISSING_DATA.md
- Auto-reject if both cannot be verified
- See MASTER_BLUEPRINT.md for exact logic

### 2. AI Evaluation
- Use EXACT prompts from MASTER_BLUEPRINT.md
- Use Claude Opus 4.5 via OpenRouter
- Enforce 5-word reasoning limit (Zod schema)
- Handle missing data as per EDGE_CASES_AND_MISSING_DATA.md

### 3. Edge Cases (30-40% of profiles)
- Handle missing language proficiency → infer from context
- Handle freelancers → evaluate differently, no penalty
- Handle unknown companies → use profile data, no penalty
- See EDGE_CASES_AND_MISSING_DATA.md for complete handling

### 4. Data Schemas
- Use ALL Zod schemas exactly as specified in MASTER_BLUEPRINT.md
- Validate ALL inputs and outputs
- Use TypeScript strict mode

## 📊 Success Criteria

Your implementation is successful when:
- [ ] Processes 100 candidates in < 15 minutes
- [ ] All API endpoints working
- [ ] Workflow executes without errors
- [ ] UI matches mockups in MASTER_BLUEPRINT.md
- [ ] Mobile responsive
- [ ] Proper error handling throughout
- [ ] Code is clean and well-documented

## 🔑 Environment Variables Needed

Create these in Vercel or `.env.local`:
```
DATABASE_URL="postgresql://..."
OPENROUTER_API_KEY="sk-or-v1-..."
TAVILY_API_KEY="tvly-..."
```

## 📖 Key Files To Reference

When implementing each feature, reference:
- **Database schema** → MASTER_BLUEPRINT.md (Prisma section)
- **API endpoints** → MASTER_BLUEPRINT.md (API Design section)
- **LLM prompts** → MASTER_BLUEPRINT.md (Prompts section)
- **UI designs** → MASTER_BLUEPRINT.md (UI/UX section)
- **Edge cases** → EDGE_CASES_AND_MISSING_DATA.md
- **Tech details** → 02_TECHNICAL_SPECIFICATIONS.md

## 💡 Development Approach

1. **Read first, code second** - Understand specs before implementing
2. **Follow the architecture** - Use the exact tech stack specified
3. **Test as you go** - Validate each component before moving on
4. **Handle errors gracefully** - Lots of error handling needed
5. **Make it production-ready** - This will be used in real hiring

## 🚨 What NOT To Do

- ❌ Don't deviate from tech stack (no React Query, no tRPC, etc.)
- ❌ Don't skip edge case handling
- ❌ Don't auto-reject for missing data without inference
- ❌ Don't change the evaluation criteria
- ❌ Don't forget mobile responsiveness

## ✅ When You're Done

The application should:
1. Successfully upload Apify JSON
2. Process candidates through workflow
3. Generate PASS/REJECT decisions with reasoning
4. Display results in dashboard
5. Allow filtering, search, and export
6. Handle all edge cases gracefully
7. Work on mobile and desktop

## 🎯 Start Here

1. Read `/docs/MASTER_BLUEPRINT.md` completely
2. Read `/docs/EDGE_CASES_AND_MISSING_DATA.md`
3. Initialize Next.js project: `npx create-next-app@latest . --typescript --app --tailwind`
4. Setup Prisma: Copy schema from MASTER_BLUEPRINT.md
5. Follow Phase 1 implementation steps above

## 📞 Questions?

Everything is documented in `/docs/`. If something is unclear:
1. Check MASTER_BLUEPRINT.md first
2. Check INDEX.md to find relevant docs
3. Read the specific documentation file
4. Ask for clarification if still unclear

---

**Let's build something amazing! 🚀**

Read the docs, follow the plan, and create a production-ready system that will help Wonderful AI hire world-class CTOs globally.
