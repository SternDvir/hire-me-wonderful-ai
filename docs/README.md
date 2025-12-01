# Hire Me, Wonderful AI

**AI-Powered CTO Candidate Screening System**

Automate the screening of Local CTO candidates for Wonderful AI's global expansion. Reduce manual screening time from 20-30 hours per 100 candidates to under 3 hours while maintaining high-quality evaluation standards.

---

## 🎯 What It Does

This application takes LinkedIn profile data (from Apify or similar scrapers) and automatically evaluates each candidate against Wonderful AI's CTO requirements using multiple AI agents and Claude Opus 4.5.

**Input:** LinkedIn profiles (JSON)  
**Output:** PASS/REJECT decisions with detailed reasoning, scores, and interview recommendations

---

## ✨ Key Features

- **🤖 Multi-Agent Evaluation:** 6 specialized AI agents evaluate different aspects (experience, leadership, languages, etc.)
- **🏢 Company Enrichment:** Automatically researches candidates' employers using Tavily
- **📊 Interactive Dashboard:** View, filter, and export screening results
- **💰 Cost Effective:** ~$0.06 per candidate (vs. $9-13 in manual time)
- **⚡ Fast:** Screen 100 candidates in ~15 minutes
- **🎯 Accurate:** Designed against 5 real successful CTO profiles

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - OpenRouter (for Claude Opus 4.5)
  - Tavily (for company enrichment)
  - Apify (for LinkedIn scraping)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hire-me-wonderful-ai.git
cd hire-me-wonderful-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Initialize database
createdb wonderful_cto_screening
psql wonderful_cto_screening < schema.sql

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### First Screening

1. **Get LinkedIn profiles** using [Apify's LinkedIn Scraper](https://apify.com/apify/linkedin-profile-scraper)
2. **Upload JSON file** to the application
3. **Start screening** with default CTO criteria
4. **Review results** in ~10 minutes

---

## 📁 Project Structure

```
hire-me-wonderful-ai/
├── src/
│   ├── app/                    # Next.js pages and API routes
│   │   ├── page.tsx            # Dashboard
│   │   ├── upload/page.tsx     # Upload profiles
│   │   ├── sessions/[id]/page.tsx  # View session results
│   │   └── api/                # API endpoints
│   ├── lib/
│   │   ├── schemas/            # Zod schemas for type safety
│   │   ├── agents/             # AI evaluation agents
│   │   ├── services/           # External API clients (OpenRouter, Tavily)
│   │   ├── database/           # Database queries
│   │   └── workflows/          # Vercel WDK workflows
│   └── components/             # React components (shadcn/ui)
├── docs/
│   ├── 01_PROJECT_SPECIFICATION.md     # Full project overview
│   ├── 02_TECHNICAL_SPECIFICATIONS.md  # Data schemas and APIs
│   ├── 03_LLM_PROMPTS.md              # All AI agent prompts
│   ├── 04_IMPLEMENTATION_GUIDE.md     # Step-by-step build guide
│   └── 05_USER_GUIDE.md               # How to use the app
└── schema.sql                  # PostgreSQL database schema
```

---

## 📚 Documentation

### For Developers

1. **[Project Specification](./01_PROJECT_SPECIFICATION.md)** - Complete project overview, requirements, architecture
2. **[Technical Specifications](./02_TECHNICAL_SPECIFICATIONS.md)** - Data schemas (Zod), API contracts, database design
3. **[LLM Prompts](./03_LLM_PROMPTS.md)** - All AI agent prompts and evaluation logic
4. **[Implementation Guide](./04_IMPLEMENTATION_GUIDE.md)** - Step-by-step development guide

### For Users

5. **[User Guide](./05_USER_GUIDE.md)** - How to use the application, best practices, troubleshooting

**Recommended Reading Order:**
1. Start with Project Specification for overview
2. Read User Guide to understand the product
3. Follow Implementation Guide to build
4. Reference Technical Specifications and LLM Prompts as needed

---

## 🧠 How It Works

### Evaluation Pipeline

```
LinkedIn Profile (JSON)
  ↓
[Parse & Validate with Zod]
  ↓
[Enrich Companies via Tavily] ← Optional, costs $0.009 per candidate
  ↓
[Multi-Agent Evaluation]
  ├─ Experience Evaluator → Checks 7+ years, backend depth, hands-on
  ├─ Leadership Evaluator → Assesses EQ, charisma, team building
  ├─ Language Checker → Verifies English + native language
  ├─ Company Evaluator → Rates startup/product company experience
  └─ Bonus Factors → Identifies standout attributes
  ↓
[Final Decision with Claude Opus 4.5]
  ├─ Synthesizes all evaluations
  ├─ Applies hard requirements
  └─ Makes PASS/REJECT decision
  ↓
[Save to Database]
  ↓
[Display in Dashboard]
```

### Must-Have Requirements (All Required for PASS)

1. ✓ **7-8+ years hands-on engineering** (not frontend-only)
2. ✓ **High EQ / Charisma / Energy** (evidence required)
3. ✓ **Currently or recently hands-on** (within 2 years)
4. ✓ **Strong English proficiency** (C1 level+)
5. ✓ **Native language proficiency** (in current country)

### Automatic Rejection Triggers

- Less than 7 years experience
- Frontend-only (no backend/systems)
- No leadership evidence
- Not hands-on for 3+ years
- Language gaps
- Only consulting/services experience

---

## 💰 Pricing

### Per Candidate

- **Apify scraping:** $0.01
- **Tavily enrichment:** $0.009 (optional, for 3 companies)
- **AI evaluation:** $0.04 (Claude Opus 4.5)
- **Total:** $0.059 with enrichment, $0.05 without

### Batch Pricing

| Candidates | Cost with Enrichment | Cost without Enrichment |
|------------|---------------------|------------------------|
| 50         | $2.95               | $2.50                  |
| 100        | $5.90               | $5.00                  |
| 200        | $11.80              | $10.00                 |
| 500        | $29.50              | $25.00                 |

**ROI:** Saves ~$900 per 100 candidates vs. manual screening

---

## 🎯 Success Metrics

Based on design goals:

- **Time Savings:** 90% reduction (30 hours → 3 hours per 100 candidates)
- **Cost per Candidate:** $0.05-0.06 (target: < $0.10)
- **False Negative Rate:** < 5% (minimize missing good candidates)
- **False Positive Rate:** < 10% (some will be filtered in interviews)
- **Precision:** > 85% (PASS candidates advance to interview stage)

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Next.js 15 | Web application |
| Language | TypeScript | Type safety |
| Workflow | Vercel WDK | Multi-step orchestration |
| AI Agents | Mastra AI | Agent framework |
| Validation | Zod | Runtime type checking |
| AI Gateway | OpenRouter | Claude Opus 4.5 access |
| Search | Tavily | Company enrichment |
| Database | Vercel Postgres | Data storage |
| UI | shadcn/ui + Tailwind | Components & styling |

---

## 🤝 Contributing

This is an internal tool for Wonderful AI. If you're part of the team:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly (especially with real LinkedIn data)
4. Submit a pull request

### Testing New Evaluation Criteria

When updating evaluation prompts:
1. Test on 10 known examples (5 PASS, 5 REJECT)
2. Verify consistency (same input → same output)
3. Check cost impact
4. Get approval from hiring manager

---

## 📊 Monitoring

Track these metrics for each screening session:

- **Pass Rate:** Should be 15-25% (healthy funnel)
- **Cost per Candidate:** Should stay < $0.10
- **Processing Time:** Should be < 20 seconds per candidate
- **Error Rate:** Should be < 1%

If metrics drift significantly, review:
- Evaluation criteria calibration
- API performance and costs
- Quality of input data

---

## 🐛 Troubleshooting

### Common Issues

**Q: Screening stuck at "Processing"**  
A: Check logs, verify API keys, restart the session

**Q: High false positive rate**  
A: Make criteria more stringent, increase minimum score threshold

**Q: High false negative rate**  
A: Review REJECT pile for high scores (70+), adjust criteria to be more lenient

**Q: Company enrichment failing**  
A: Normal for small companies, evaluation continues without enriched data

**Q: Database connection errors**  
A: Check DATABASE_URL environment variable, verify Postgres is running

---

## 📝 License

Proprietary - Internal use only for Wonderful AI

---

## 👤 Author

**Dvir**  
Freelance Recruiter for Wonderful AI  
[dvirsolution.com](https://dvirsolution.com)

---

## 🙏 Acknowledgments

- Wonderful AI leadership for defining CTO requirements
- 5 successful CTOs whose profiles informed the evaluation criteria
- Anthropic for Claude Opus 4.5
- Vercel for hosting and Postgres
- Tavily for company enrichment API

---

## 📞 Support

For questions or issues:
- Review the [User Guide](./05_USER_GUIDE.md)
- Check the [Implementation Guide](./04_IMPLEMENTATION_GUIDE.md)
- Contact Dvir directly

---

**Built with ❤️ for efficient, high-quality CTO hiring**

*Empowering Wonderful AI's global expansion, one CTO at a time* 🚀
