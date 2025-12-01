# Quick Reference Card - Hire Me, Wonderful AI

## 🎯 One-Sentence Summary
AI-powered system that screens Local CTO candidates for Wonderful AI, reducing 20-30 hours of manual work to under 3 hours per 100 candidates at $0.06/candidate.

---

## 📊 Key Metrics

| Metric | Target | Manual Baseline |
|--------|--------|----------------|
| Time per 100 candidates | < 3 hours | 20-30 hours |
| Cost per candidate | $0.06 | $9-13 (labor) |
| Processing speed | < 20 sec/candidate | - |
| False negative rate | < 5% | - |
| Pass rate | 15-25% | - |

---

## ✅ Must-Have Requirements (ALL Required)

1. **7-8+ years hands-on engineering** (not frontend-only)
2. **High EQ / Charisma / Energy** (evidence required)
3. **Currently/recently hands-on** (within 2 years)
4. **Strong English** (C1 level+)
5. **Native language proficiency** (in current country)

**Auto-Reject:** < 7 years, frontend-only, no leadership, not hands-on 3+ years, language gaps

---

## 🤖 AI Agent Pipeline

```
1. Profile Parser Agent        → Extract key info
2. Experience Evaluator Agent  → Check 7+ years, backend depth
3. Leadership Evaluator Agent  → Assess EQ, charisma, team building
4. Language Checker Agent      → Verify English + native language
5. Company Background Agent    → Rate startup/product experience
6. Bonus Factors Agent         → Identify standout attributes
7. Final Decision (Opus 4.5)   → PASS/REJECT + reasoning
```

**Temperature:** 0 (all agents) for consistency  
**Model:** Sonnet 4.5 for agents, Opus 4.5 for final decision

---

## 💰 Cost Breakdown

**Per Candidate:**
- Apify scraping: $0.01
- Tavily (3 companies): $0.009
- AI evaluation: $0.04
- **Total: $0.059**

**Batch Pricing:**
- 50 candidates: $2.95
- 100 candidates: $5.90
- 200 candidates: $11.80

**ROI:** $900+ saved per 100 candidates

---

## 🛠️ Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | Next.js 15 | Modern, type-safe |
| Language | TypeScript | Catch errors early |
| Workflow | Vercel WDK | State management |
| AI Framework | Mastra AI | Modular agents |
| Validation | Zod | Runtime checks |
| AI Gateway | OpenRouter | Claude Opus access |
| LLM | Claude Opus 4.5 | Best reasoning |
| Search | Tavily | Company data |
| Database | Vercel Postgres | Integrated |
| UI | shadcn/ui | Accessible |

---

## 📁 File Structure (Simplified)

```
src/
├── app/                 # Pages (dashboard, upload, results)
├── lib/
│   ├── schemas/        # Zod schemas (types)
│   ├── agents/         # 6 AI evaluation agents
│   ├── services/       # OpenRouter, Tavily clients
│   ├── database/       # DB queries
│   └── workflows/      # Screening workflow
└── components/         # UI components

docs/
├── 00_CLAUDE_CODE_HANDOFF.md      # Start here!
├── 01_PROJECT_SPECIFICATION.md    # Overview
├── 02_TECHNICAL_SPECIFICATIONS.md # Schemas/APIs
├── 03_LLM_PROMPTS.md             # Agent prompts
├── 04_IMPLEMENTATION_GUIDE.md    # Build steps
└── 05_USER_GUIDE.md              # How to use
```

---

## 🚀 Quick Start Commands

```bash
# Setup
npm install
cp .env.example .env.local  # Add API keys
createdb wonderful_cto_screening
psql wonderful_cto_screening < schema.sql

# Run
npm run dev

# Access
http://localhost:3000
```

---

## 🎯 Evaluation Score Ranges

| Score | Decision | Description |
|-------|----------|-------------|
| 90-100 | PASS | Exceptional, exactly what we need |
| 80-89 | PASS | Strong candidate, definitely interview |
| 70-79 | PASS | Good candidate, worth interviewing |
| 60-69 | REJECT* | Borderline, manual review suggested |
| < 60 | REJECT | Clear rejection |

*Manual review recommended for 60-69 range

---

## 📝 Input/Output

**Input:** Apify LinkedIn Profile Scraper JSON
```json
[
  {
    "linkedinUrl": "...",
    "fullName": "...",
    "experiences": [...],
    "educations": [...],
    "languages": [...]
  }
]
```

**Output:** Evaluation Result
```json
{
  "decision": "PASS",
  "reasoning": "Strong technical leader",
  "overallScore": 85,
  "strengths": ["10+ years backend", "VP title", "Founder"],
  "concerns": ["No AI experience mentioned"]
}
```

---

## 🔑 Environment Variables

```bash
DATABASE_URL="postgresql://..."
OPENROUTER_API_KEY="sk-or-v1-..."
TAVILY_API_KEY="tvly-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed test data
npm run db:reset        # Reset database

# Testing
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run lint           # Check code style
```

---

## 🎨 Scoring Dimensions

All scores are 0-100:

- **Technical Depth** - Backend experience, tech stack breadth
- **Leadership Capability** - Title progression, team building
- **Customer Facing** - Pre-sales, demos, solution architecture
- **Cultural Fit** - Urgency, independence, professionalism, vibe
- **Hands-On Current** - Recent technical work, up-to-date

---

## 🚨 Red Flags

**Automatic concern if:**
- Career gap > 12 months (unexplained)
- 3+ jobs < 1 year each
- Only consulting/services (no product)
- No title progression over 5+ years
- Vague job descriptions (might indicate non-technical)

---

## 📞 Key Contacts

**Project Owner:** Dvir  
**Role:** Freelance Recruiter for Wonderful AI  
**Website:** dvirsolution.com

**Wonderful AI:**
- Country Managers (hiring managers)
- HR team (recruitment support)

---

## 📚 Document Reading Order

1. **README.md** - 5 min overview
2. **00_CLAUDE_CODE_HANDOFF.md** - 10 min handoff
3. **01_PROJECT_SPECIFICATION.md** - 30 min full context
4. **04_IMPLEMENTATION_GUIDE.md** - 45 min build guide
5. **02_TECHNICAL_SPECIFICATIONS.md** - Reference as needed
6. **03_LLM_PROMPTS.md** - Reference as needed
7. **05_USER_GUIDE.md** - For end users

**Total reading time:** ~90 minutes for complete understanding

---

## ✅ Pre-Launch Checklist

- [ ] All dependencies installed
- [ ] Database schema created
- [ ] Environment variables set
- [ ] Test with 5 example CTOs
- [ ] All agents return valid JSON
- [ ] Company cache works
- [ ] UI is intuitive
- [ ] Export to CSV works
- [ ] Cost tracking accurate
- [ ] Error handling robust

---

## 🎯 Success Definition

**MVP Success:**
- Screen 50 candidates in < 10 minutes
- 10-15 PASS, 35-40 REJECT
- Cost < $5 total
- Results match manual review

**Production Success:**
- Dvir uses it for all CTO screening
- 90% time savings achieved
- < 10% false positive rate
- Positive feedback from hiring managers

---

## 💡 Pro Tips

1. **Start with test batch:** Screen 10 profiles before 100
2. **Use company cache:** Saves 70% on repeat searches
3. **Review borderline:** Manual check scores 60-70
4. **Trust the prompts:** They're tested on real CTOs
5. **Monitor costs:** Track per session, not just per candidate

---

**Keep this card handy for quick reference!** 📌

For full details, see the complete documentation files.
