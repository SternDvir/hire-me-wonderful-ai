# Hire Me, Wonderful AI - Claude Code Handoff

## 📋 Project Handoff Summary

**To:** Claude Code  
**From:** Dvir (with specification by Claude)  
**Date:** December 1, 2025  
**Project:** Hire Me, Wonderful AI - Automated CTO Screening System

---

## 🎯 Mission

Build a TypeScript web application that automates the screening of Local CTO candidates for Wonderful AI's global expansion. The system should reduce manual screening time by 90% while maintaining high-quality evaluation standards.

---

## 📦 What You're Getting

You are receiving a complete, production-ready specification containing:

### 1. **Project Specification** (`01_PROJECT_SPECIFICATION.md`)
- Complete background on Wonderful AI's CTO role
- Detailed candidate requirements (must-haves and bonuses)
- Analysis of 5 successful CTO profiles
- System architecture and data flow
- Success metrics and ROI calculations

### 2. **Technical Specifications** (`02_TECHNICAL_SPECIFICATIONS.md`)
- Complete Zod schemas for all data types
- API contracts for OpenRouter (Claude) and Tavily
- PostgreSQL database schema
- File structure and organization
- Environment variables configuration

### 3. **LLM Prompts** (`03_LLM_PROMPTS.md`)
- 6 complete AI agent prompts (system + user templates)
- Final decision prompt for Claude Opus 4.5
- Formatting functions and evaluation logic
- Testing guidelines and edge case handling

### 4. **Implementation Guide** (`04_IMPLEMENTATION_GUIDE.md`)
- Step-by-step build instructions
- Phase-by-phase development plan (7 days)
- Code examples for all major components
- Integration instructions

### 5. **User Guide** (`05_USER_GUIDE.md`)
- End-user documentation
- Best practices and tips
- Troubleshooting guide
- Evaluation criteria reference

### 6. **README** (`README.md`)
- Project overview
- Quick start guide
- Tech stack summary
- Documentation index

---

## 🛠️ Tech Stack (As Specified)

| Component | Technology | Version/Details |
|-----------|-----------|-----------------|
| Framework | Next.js | 15 with App Router |
| Language | TypeScript | Latest |
| Workflow | Vercel WDK | Workflow Development Kit |
| AI Framework | Mastra AI | For agent orchestration |
| Validation | Zod | Schema validation |
| AI Gateway | OpenRouter | For Claude Opus 4.5 |
| LLM | Claude Opus 4.5 | Final decision agent |
| Search | Tavily | Company enrichment |
| Database | Vercel Postgres | PostgreSQL |
| UI Library | shadcn/ui | Radix UI + Tailwind |
| Styling | Tailwind CSS | Utility-first CSS |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB INTERFACE                             │
│  Dashboard → Upload Profiles → Configure → View Results         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL WDK WORKFLOW                          │
│  Parse JSON → Validate → Enrich → Evaluate → Decide → Store    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     MASTRA AI AGENTS (5)                         │
│  Experience | Leadership | Language | Company | Bonus          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  CLAUDE OPUS 4.5 (via OpenRouter)               │
│  Final Decision: PASS/REJECT + Reasoning + Scores              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL POSTGRES                              │
│  Store Sessions + Results + Cache Companies                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Key Design Decisions

### 1. **Multi-Agent Architecture**
- 5 specialized agents evaluate different aspects
- Parallel execution for speed
- Claude Opus 4.5 synthesizes final decision
- Rationale: Better accuracy than single-pass evaluation

### 2. **Zod for Type Safety**
- Runtime validation of all inputs/outputs
- Prevents malformed data from breaking the system
- TypeScript types auto-generated from schemas
- Rationale: Catch errors early, ensure data quality

### 3. **Company Enrichment Cache**
- Cache Tavily searches for 30 days
- Reduces costs by ~70% on repeat searches
- Rationale: Same companies appear across candidates

### 4. **Async Workflow Processing**
- Screening runs in background
- User gets immediate session ID
- Polls for progress updates
- Rationale: Better UX, handles large batches

### 5. **Structured JSON Outputs**
- All AI responses use JSON mode with schemas
- Ensures consistent, parseable outputs
- Rationale: Eliminate parsing errors, enable validation

---

## 🎯 Implementation Priorities

### Phase 1: MVP (Week 1) - CRITICAL
**Goal:** Working end-to-end screening

Must Have:
- [ ] Project setup (Next.js, dependencies)
- [ ] Database schema creation
- [ ] Zod schemas implementation
- [ ] OpenRouter client
- [ ] Tavily client
- [ ] Basic file upload endpoint
- [ ] Screening workflow (without UI)
- [ ] All 5 agent evaluation functions
- [ ] Final decision with Claude Opus 4.5
- [ ] Database storage
- [ ] Basic results API endpoint

Test Criteria:
- Can upload 10 LinkedIn profiles
- Can screen all 10 successfully
- Results saved to database
- At least 1 PASS and 1 REJECT

### Phase 2: UI (Week 2) - IMPORTANT
**Goal:** Usable web interface

Must Have:
- [ ] Dashboard page (recent sessions, stats)
- [ ] Upload page (file dropzone, config form)
- [ ] Session results page (candidate cards, filters)
- [ ] Candidate detail view (full evaluation)
- [ ] Progress tracking (real-time updates)
- [ ] Export functionality (CSV, JSON)

Test Criteria:
- Non-technical user can screen 50 candidates
- Results are easy to understand
- Can filter/sort/export results

### Phase 3: Polish (Week 3) - NICE TO HAVE
**Goal:** Production-ready quality

Nice to Have:
- [ ] Error handling and retry logic
- [ ] Cost tracking and reporting
- [ ] Company cache optimization
- [ ] Batch processing improvements
- [ ] Manual override functionality
- [ ] Session history viewer
- [ ] Interview questions generation
- [ ] Performance optimizations

---

## 🔑 Critical Success Factors

### 1. **Prompt Quality**
The evaluation quality depends entirely on the LLM prompts. These have been carefully designed based on:
- Real CTO requirements from Wonderful AI
- Analysis of 5 successful hires
- Multiple iterations of testing

**Action:** Implement prompts exactly as specified. Test thoroughly before any modifications.

### 2. **Zod Schema Validation**
Every piece of data must be validated:
- LinkedIn profiles on input
- Company enrichment data
- All agent outputs
- Final decisions

**Action:** Use Zod schemas religiously. Never bypass validation.

### 3. **Error Handling**
Things will go wrong (API failures, malformed data, etc.). The system must:
- Log errors clearly
- Continue processing other candidates
- Mark failed evaluations appropriately
- Provide helpful error messages

**Action:** Wrap all external API calls in try-catch. Log everything.

### 4. **Cost Optimization**
At $0.06 per candidate, costs add up quickly:
- Cache company searches aggressively
- Use structured outputs to minimize tokens
- Consider using Claude Sonnet 4.5 for non-critical agents
- Batch requests where possible

**Action:** Implement company cache from day one. Monitor costs.

### 5. **Testing with Real Data**
The system is designed for Apify LinkedIn data. Test with:
- The 5 example CTO profiles provided
- Mix of PASS and REJECT candidates
- Profiles with missing data
- Edge cases (career gaps, short tenures, etc.)

**Action:** Test with real Apify JSON from day one.

---

## 📊 Quality Checklist

Before considering the project complete, verify:

### Functionality
- [ ] Can upload and parse Apify JSON
- [ ] All 5 agents execute successfully
- [ ] Final decision agent works with Claude Opus 4.5
- [ ] Company enrichment with Tavily works
- [ ] Company cache prevents duplicate searches
- [ ] Results save to database
- [ ] Dashboard displays sessions
- [ ] Candidate cards show all key info
- [ ] Filters and sorting work
- [ ] Export to CSV works

### Quality Metrics
- [ ] Processing time < 20 seconds per candidate
- [ ] Cost < $0.10 per candidate
- [ ] Test on 5 known PASS profiles → all pass
- [ ] Test on 5 known REJECT profiles → all reject
- [ ] UI is intuitive for non-technical users
- [ ] Error messages are helpful
- [ ] Code is well-documented

### Production Readiness
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] API keys secured
- [ ] Error logging implemented
- [ ] User guide complete
- [ ] README is clear
- [ ] Deployment instructions work

---

## 🚨 Common Pitfalls to Avoid

### 1. **Skipping Validation**
❌ Don't assume data is correct  
✅ Validate everything with Zod

### 2. **Ignoring Edge Cases**
❌ Don't only test perfect profiles  
✅ Test missing data, gaps, unusual patterns

### 3. **Hardcoding Values**
❌ Don't hardcode criteria in code  
✅ Use configuration, allow customization

### 4. **Inconsistent Evaluation**
❌ Don't use temperature > 0  
✅ Use temperature = 0 for consistency

### 5. **Poor Error Messages**
❌ Don't show "Error 500" to users  
✅ Show helpful, actionable error messages

### 6. **Not Caching**
❌ Don't search same company 50 times  
✅ Implement caching from day one

### 7. **Blocking UI**
❌ Don't make user wait for 100 evaluations  
✅ Run async, show progress

### 8. **Forgetting Cost Tracking**
❌ Don't lose track of API costs  
✅ Log and display cost per session

---

## 🧪 Testing Strategy

### Unit Tests
- Zod schema validation
- Prompt formatting functions
- Data parsing utilities
- Cost calculation functions

### Integration Tests
- OpenRouter API calls
- Tavily API calls
- Database operations
- End-to-end screening workflow

### Manual Testing
Test with these real profiles (provided in uploads):
1. Jan Surovec (Czech) - Should PASS (95+ score)
2. Ilia Kantor (Russia/Czech) - Should PASS (90+ score)
3. Dor Gil (Israel) - Should PASS (85+ score)
4. Roy Eitan (Israel) - Should PASS (80+ score)
5. Create 5 REJECT profiles (frontend-only, < 7 years, etc.)

### Load Testing
- Screen 100 candidates
- Verify completion in < 20 minutes
- Check database performance
- Monitor API rate limits

---

## 📦 Deliverables

### Code
- Complete Next.js application
- All components implemented
- Tests passing
- Deployed to Vercel (or ready to deploy)

### Documentation
- README with setup instructions
- User guide for end users
- API documentation (if exposing APIs)
- Deployment guide

### Database
- Schema created
- Sample data loaded
- Migrations documented

### Configuration
- Environment variables documented
- Example .env file
- API keys setup instructions

---

## 🚀 Deployment Checklist

Before going live:

### Vercel Setup
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set up Vercel Postgres
- [ ] Configure build settings
- [ ] Test deployment

### Database
- [ ] Create production database
- [ ] Run schema migrations
- [ ] Set up backups
- [ ] Configure connection pooling

### API Keys
- [ ] OpenRouter account created
- [ ] Tavily account created
- [ ] API keys added to Vercel
- [ ] Rate limits understood

### Security
- [ ] API keys in environment variables (not code)
- [ ] Database connection string secured
- [ ] HTTPS enforced
- [ ] CORS configured properly

### Monitoring
- [ ] Error logging enabled
- [ ] Cost tracking implemented
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## 📚 Reference Documents

Read in this order:
1. **README.md** - Start here for overview
2. **01_PROJECT_SPECIFICATION.md** - Understand requirements
3. **02_TECHNICAL_SPECIFICATIONS.md** - Schemas and APIs
4. **03_LLM_PROMPTS.md** - Agent prompts
5. **04_IMPLEMENTATION_GUIDE.md** - Build instructions
6. **05_USER_GUIDE.md** - User documentation

---

## 💬 Communication

### Questions to Ask During Development

**Clarifications:**
- "Should this agent use Claude Sonnet 4.5 or Opus 4.5?"
- "What should happen if Tavily times out?"
- "How should we handle profiles with no job descriptions?"

**Trade-offs:**
- "I can optimize for speed or accuracy here - which is more important?"
- "Should we cache company data for 7 days or 30 days?"
- "Do you want real-time progress or batch updates?"

**Edge Cases:**
- "What if a candidate has 20 years experience but it's all consulting?"
- "Should founders with < 7 years total experience still pass?"
- "How do we handle profiles entirely in non-English?"

---

## ✅ Definition of Done

The project is complete when:

1. ✅ All Phase 1 (MVP) features implemented and tested
2. ✅ All Phase 2 (UI) features implemented and tested
3. ✅ Test screening of 100 candidates completes successfully
4. ✅ Dvir can use the system without technical assistance
5. ✅ User guide is complete and accurate
6. ✅ Deployment to Vercel is successful
7. ✅ Cost per candidate is < $0.10
8. ✅ Processing time is < 30 seconds per candidate
9. ✅ Pass/Reject decisions match expectations on test profiles
10. ✅ All documentation is up to date

---

## 🎉 Success Criteria

After 1 month of use, the system should achieve:

- **Time Savings:** 90% reduction in screening time
- **Cost Savings:** $900+ saved per 100 candidates
- **Quality:** < 10% false positive rate (verified via interviews)
- **Usage:** 300-500 candidates screened per month
- **Satisfaction:** Dvir recommends it to other recruiters

---

## 🙏 Final Notes

This specification has been carefully designed based on:
- Real hiring requirements from Wonderful AI
- Analysis of 5 successful CTO profiles
- Best practices in AI-powered recruitment
- Cost optimization and scalability considerations

**Trust the specification.** The prompts, schemas, and architecture have been thoughtfully designed. Implement as specified first, then iterate based on real usage.

**Ask questions.** If anything is unclear, ask before making assumptions.

**Test thoroughly.** Use real LinkedIn data from day one.

**Focus on quality.** This is a critical hiring tool. False negatives and false positives both have real costs.

---

**Good luck building Hire Me, Wonderful AI!** 🚀

You have everything you need to create a production-ready CTO screening system that will save countless hours and help Wonderful AI scale globally.

---

**Handoff Complete**  
**Specification Version:** 1.0.0  
**Date:** December 1, 2025  
**Next Step:** Begin Phase 1 (MVP) implementation
