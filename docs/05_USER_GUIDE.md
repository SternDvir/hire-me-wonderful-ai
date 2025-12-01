# Hire Me, Wonderful AI - User Guide

## Welcome!

This application automates the screening of Local CTO candidates for Wonderful AI's global expansion. Instead of manually reviewing 100+ LinkedIn profiles (which takes 20-30 hours), you can now screen them in under 3 hours with AI-powered evaluation.

---

## Quick Start

### 1. Get LinkedIn Profiles

Use [Apify's LinkedIn Profile Scraper](https://apify.com/apify/linkedin-profile-scraper) to collect candidate profiles:

**Steps:**
1. Create an Apify account (free tier available)
2. Go to LinkedIn Profile Scraper
3. Input LinkedIn profile URLs or search URLs
4. Run the scraper
5. Download results as JSON

**Cost:** ~$10 per 1000 profiles

**Example URLs to scrape:**
```
https://www.linkedin.com/search/results/people/?keywords=CTO%20Prague
https://www.linkedin.com/search/results/people/?keywords=VP%20Engineering%20Czech%20Republic
```

### 2. Upload Profiles to the App

1. Navigate to the **Upload** page
2. Click **Choose File** and select your Apify JSON file
3. The system will automatically validate and parse the profiles
4. You'll see: "✓ 50 profiles detected"

### 3. Configure Screening Criteria

**Basic Configuration:**
- **Target Role:** CTO (default) / VP Engineering / Engineering Manager
- **Enable Company Enrichment:** Yes (recommended) / No (faster, cheaper)
- **Target Country:** (Optional) Filter by location
- **Custom Criteria:** (Optional) Add specific requirements

**Advanced Options:**
- Minimum years of experience (default: 7)
- Require VP+ title: Yes/No
- Require startup experience: Yes/No

### 4. Start Screening

Click **Start Screening**

You'll see real-time progress:
```
Parsing profiles... 10/50
Enriching companies... 25/50
Evaluating candidates... 40/50
Finalizing decisions... 50/50
```

**Estimated time:**
- 50 profiles: ~5-8 minutes
- 100 profiles: ~10-15 minutes
- 200 profiles: ~20-30 minutes

### 5. Review Results

**Summary Dashboard:**
```
✓ Screening Complete!
━━━━━━━━━━━━━━━━━━━━━
12 PASS candidates
38 REJECT candidates
Cost: $4.50
Time: 8 minutes
```

**Results Page Features:**
- **Filter by Decision:** PASS / REJECT / All
- **Sort by Score:** Highest to lowest
- **Search:** By name, company, title
- **Export:** CSV, JSON, PDF

**Candidate Cards:**
Each candidate shows:
- Name and current role
- Overall Score (0-100)
- Decision (PASS/REJECT)
- Reasoning (5-word summary)
- Key Strengths
- Key Concerns

### 6. Deep Dive into Candidates

Click on any candidate card to see:

**Full Evaluation Breakdown:**
- Experience Analysis (years, technologies, hands-on status)
- Leadership Assessment (titles, team sizes, charisma indicators)
- Language Proficiency Check (English + native language)
- Company Background (startups, product companies, quality)
- Bonus Factors (customer-facing, founder, online presence)

**Detailed Scores:**
- Technical Depth: 85/100
- Leadership Capability: 90/100
- Customer Facing: 70/100
- Cultural Fit: 80/100
- Hands-On Current: 95/100

**Enriched Company Data:**
See information about their past employers:
- Company description
- Industry and size
- Funding status
- Tech stack
- Reputation assessment

**Suggested Interview Questions:**
AI-generated questions tailored to this candidate's profile to probe specific areas or gaps.

### 7. Take Action

**For PASS Candidates:**
- Click **Export to CSV** to get contact info
- Click **Mark for Interview** to add to your pipeline
- Add manual notes (e.g., "Strong leadership, verify AI experience in interview")
- Click LinkedIn URL to view full profile

**For REJECT Candidates:**
- Review borderline cases (score 60-70) manually if you have time
- Check for potential false negatives (high score but rejected)

---

## Understanding the Evaluation

### What Makes a Candidate PASS?

**All 5 Hard Requirements Must Be Met:**

1. **✓ 7-8+ years hands-on engineering**
   - Backend, systems, full-stack (not frontend-only)
   - Evidence of building production systems

2. **✓ High EQ / Charisma / Energy**
   - Director/VP+ title OR
   - Speaking engagements, blog posts, strong online presence OR
   - Customer-facing roles (Solution Architect, Pre-Sales)

3. **✓ Currently hands-on OR recent hands-on**
   - Technical work in last 2 years
   - Job descriptions mention implementation
   - Side projects, open source contributions

4. **✓ Strong English proficiency**
   - Minimum "Professional working proficiency"
   - Can present to global audiences

5. **✓ Native language proficiency**
   - Can conduct business in local language
   - Required for local customer relationships

**Plus Bonus Points:**
- Startup experience
- Founder/co-founder roles
- Customer-facing background
- Personal growth trajectory
- International experience

**Overall Score:** Must be ≥ 70/100

### What Makes a Candidate REJECT?

**Automatic Rejection Triggers:**
- Less than 7 years engineering experience
- Frontend-only (no backend/systems work)
- No evidence of leadership or EQ
- Not hands-on for 3+ years
- Language proficiency gaps
- Only consulting/services (no product companies)

**Red Flags:**
- Unexplained career gaps (> 1 year)
- Too many short tenures (< 1 year each)
- No career progression (lateral moves only)
- Lack of technical depth in descriptions

---

## Cost Breakdown

### Per Candidate Costs

**With Company Enrichment (Recommended):**
- Apify scraping: $0.01
- Tavily enrichment: $0.009 (3 companies × $0.003)
- AI evaluation: $0.04 (Claude Opus 4.5)
- **Total: ~$0.059 per candidate**

**Without Company Enrichment (Faster):**
- Apify scraping: $0.01
- AI evaluation: $0.04
- **Total: ~$0.05 per candidate**

### Batch Costs

| Candidates | With Enrichment | Without Enrichment |
|------------|-----------------|-------------------|
| 50         | $2.95           | $2.50             |
| 100        | $5.90           | $5.00             |
| 200        | $11.80          | $10.00            |
| 500        | $29.50          | $25.00            |

**ROI Calculation:**
- Your hourly rate: 160 ILS (~$45 USD)
- Manual screening time: 20-30 hours per 100 candidates
- Manual cost: $900-1350
- Automated cost: $5.90
- **Savings: $894+ per 100 candidates**

---

## Best Practices

### 1. Start with a Test Batch

Before screening 200 candidates:
1. Test with 10-20 profiles first
2. Review the PASS results manually
3. Check if the criteria match your expectations
4. Adjust custom criteria if needed
5. Run the full batch once satisfied

### 2. Use Company Enrichment Wisely

**Enable enrichment when:**
- You're unfamiliar with the companies
- You need to verify company quality
- First time screening a new region

**Skip enrichment when:**
- You know all the companies already
- Budget is very tight
- Need results immediately (screening is 2x faster)

### 3. Review Borderline Cases

Candidates with scores 60-70 deserve a second look:
- They might have potential but missing data
- Could be false negatives
- Worth a quick manual review (5 min per candidate)

### 4. Customize Criteria for Each Role

The default criteria are for **Local CTO**. Adjust for other roles:

**For VP Engineering:**
```
- Minimum years: 10 (higher than CTO)
- Require VP+ title: Yes
- Focus more on leadership than hands-on
```

**For Engineering Manager:**
```
- Minimum years: 5
- Don't require VP title
- Focus on team management experience
```

### 5. Track Your Results

After interviewing candidates, mark in the app:
- Which PASS candidates advanced to interviews
- Which REJECT candidates you should have interviewed (false negatives)
- Actual hire from the batch

This helps improve the criteria over time.

---

## Common Questions

### Q: What if a great candidate gets REJECTED?

**A:** This can happen if:
1. LinkedIn data is incomplete (missing job descriptions, etc.)
2. Candidate doesn't fit the strict CTO criteria but could fit another role
3. The AI missed context (rare but possible)

**Solution:** 
- Review REJECT candidates with high scores (70+)
- Check their LinkedIn profiles manually
- You can always override the decision in the app

### Q: Why did a weak candidate get PASS?

**A:** This could indicate:
1. Candidate has impressive resume but interview might reveal gaps
2. False positive (system estimated ~10% false positive rate)
3. AI overweighted certain factors (e.g., impressive company names)

**Solution:**
- Trust your interview process to filter out false positives
- Provide feedback on these candidates to improve future screenings
- Adjust criteria to be more stringent

### Q: Can I customize the evaluation criteria?

**Yes!** You can:
1. Change minimum years of experience
2. Require specific attributes (VP title, startup experience)
3. Add custom requirements in natural language
4. Create templates for different roles

**Future Feature:** Save custom templates for reuse.

### Q: How accurate is the company enrichment?

**A:** Company data comes from Tavily's web search:
- 80-90% accurate for well-known companies
- Less accurate for small local companies
- Some startups might have limited online presence

**Tip:** For critical decisions, always verify company information manually.

### Q: Can I use this for other technical roles?

**Yes!** The system works for:
- CTO
- VP Engineering
- Engineering Manager
- Director of Engineering
- Technical Lead

Adjust the criteria accordingly.

### Q: What if I don't have Apify?

**A:** You can also:
1. Use another LinkedIn scraper (PhantomBuster, etc.)
2. Format your data to match the Apify schema
3. Use our CSV-to-JSON converter (future feature)

The key is having structured LinkedIn profile data.

### Q: Is my data private?

**Yes:**
- All data is stored in your private database
- We don't share data with third parties
- OpenRouter and Tavily only see individual requests, not bulk data
- You can delete screening sessions anytime

---

## Tips for Better Results

### 1. Write Better Apify Searches

Instead of searching for "CTO":
- Search for "CTO Prague AI startup"
- Search for "VP Engineering Czech SaaS"
- Use specific keywords to narrow down candidates

### 2. Combine Multiple Searches

Create separate Apify scrapes for:
- LinkedIn search results
- Specific companies you know have good CTOs
- LinkedIn Groups in the target region

Then combine all JSON files and upload together.

### 3. Use Location Filters

If screening for "CTO Greece":
- Set target country to "Greece"
- The system will verify native language proficiency
- Filters out candidates from other regions

### 4. Add Interview Notes

After interviewing candidates, add notes in the app:
- "Great technical depth, hired for VP Eng role"
- "Strong leader but wants too high salary"
- "Declined offer, took competitor's offer"

This builds institutional knowledge.

### 5. Compare Across Sessions

View historical screening sessions to see:
- Which search queries yielded best candidates
- How pass rates differ by region
- Cost trends over time

---

## Troubleshooting

### Error: "Invalid JSON format"

**Problem:** The uploaded file isn't valid Apify output  
**Solution:** 
1. Re-download from Apify as JSON (not CSV)
2. Check file isn't corrupted
3. Try uploading a single profile first to test

### Error: "API rate limit exceeded"

**Problem:** Too many requests to OpenRouter or Tavily  
**Solution:**
1. Wait 1 minute and retry
2. Reduce batch size to 50 candidates at a time
3. Check your API keys have sufficient credits

### Warning: "Company enrichment failed for [Company X]"

**Problem:** Tavily couldn't find information about the company  
**Solution:**
- This is normal for small/local companies
- The evaluation continues without enriched data
- Manually research the company if candidate looks promising

### Session stuck at "Processing"

**Problem:** Background job might have crashed  
**Solution:**
1. Refresh the page
2. Check session status in dashboard
3. Contact support if stuck for > 30 minutes

---

## Support & Feedback

**Issues or Questions:**
- Check this guide first
- Review the Implementation Guide for technical questions
- Open an issue on GitHub (if open source)

**Feature Requests:**
- What additional filters would help?
- What integrations do you need (ATS, Slack, etc.)?
- What reports would be valuable?

**Feedback on Evaluations:**
- Flag candidates where AI got it wrong
- Suggest improvements to evaluation criteria
- Share successful hires from the system

---

## Appendix: Evaluation Criteria Reference

### Technical Depth Scoring

| Score | Description | Example |
|-------|-------------|---------|
| 90-100 | Exceptional depth | Built large-scale systems, multiple technologies, patents |
| 80-89 | Very strong | 10+ years, diverse tech stack, backend expertise |
| 70-79 | Strong | 7-10 years, solid backend experience |
| 60-69 | Adequate | Meets minimum but limited depth |
| < 60 | Insufficient | Less than 7 years or frontend-only |

### Leadership Capability Scoring

| Score | Description | Example |
|-------|-------------|---------|
| 90-100 | Proven leader at scale | VP+, built teams 20+, multiple successes |
| 80-89 | Strong leadership | Director, scaled team 5→30 |
| 70-79 | Emerging leader | Manager, built small team |
| 60-69 | Limited leadership | Lead/senior but no team management |
| < 60 | No leadership | IC only, no evidence of leadership |

### Company Quality Scoring

| Score | Description | Example |
|-------|-------------|---------|
| 90-100 | Top-tier companies | FAANG, unicorn startups, successful exits |
| 80-89 | Strong companies | Well-funded startups, notable tech companies |
| 70-79 | Good companies | Product companies with traction |
| 60-69 | Average companies | Mix of product + consulting/services |
| < 60 | Weak experience | Only consulting, unclear product experience |

---

**Version:** 1.0.0  
**Last Updated:** December 1, 2025  
**Author:** Dvir, for Wonderful AI

Enjoy automated CTO screening! 🚀
