# Screening Philosophy: From Score-Based to Holistic Evaluation

## The Problem with the Old System

### False Positives (Executives Passing)
**Example:** A candidate who was VP of Engineering at a large enterprise for 7 years, with recent job descriptions showing only "Leadership", "Strategy", "Team Management" would PASS with high scores.

**Why it's wrong:** These are accomplished professionals, but they've experienced **"executive drift"** - they started technical but evolved into pure management. They're not a fit for a hands-on CTO role where 60% of the job is still coding and architecting.

### False Negatives (Strong Engineers Rejected)
**Example:** A senior backend engineer who built impressive microservices at scale, has strong system design skills, but hasn't specifically worked with AI/ML frameworks yet would get REJECTED.

**Why it's wrong:** This person can LEARN AI/ML quickly. They have the right technical foundation. The rigid "must have AI experience" rule excluded potentially excellent candidates.

---

## The New Holistic Approach

### Core Philosophy

> **"Pattern recognition over arithmetic. Stories over scores. Builder DNA over credentials."**

Instead of checking boxes and summing points, we now look at **career patterns** and ask narrative questions:
- Are they a **builder** or a **manager**?
- Do they **still code** or have they drifted into pure executive work?
- Can they **learn AI/ML** or are they too specialized in one area?

---

## Red Flags That Trigger Immediate Rejection

### 1. **Executive Drift** (Most Critical)
Indicators:
- Last 5-7 years in titles like: VP Strategy, Chief Business Officer, Head of Business Development
- Recent job descriptions mention ONLY soft skills: "stakeholder management", "business strategy", "team leadership"
- Skills list lacks technical depth: No languages, frameworks, cloud platforms, databases
- Works at FAANG/big enterprise in non-technical roles

**Why we reject:**
They may be brilliant leaders, but they're not hands-on builders anymore. This role needs someone who can architect systems, write code, and mentor engineers - not just manage teams.

**Example:**
```
❌ REJECT
VP Engineering, Microsoft (2018-2025)
Skills: Leadership, Business Strategy, Stakeholder Management
Description: "Led cross-functional teams, defined product roadmap, managed P&L"
```

### 2. **Frontend-Only Specialists**
- Career entirely focused on React/Vue/Angular
- No backend, infrastructure, or systems experience
- Can't talk about databases, APIs, cloud architecture

**Why we reject:**
CTOs need full-stack understanding. Frontend-only engineers lack the depth for this role.

### 3. **Insufficient Experience**
- < 7 years total experience
- Still in junior/mid-level roles after 10+ years (no growth trajectory)

---

## What We're Looking For: Tiered Evaluation

### TIER 1: Technical Hands-On (40% weight) 🔴 CRITICAL
**Must-have evidence:**
- RECENT (last 2-3 years) hands-on work
- Job descriptions use verbs like: "built", "architected", "developed", "designed"
- Skills include: Python/Go/Java, AWS/GCP, PostgreSQL/MongoDB, Docker/K8s
- Full-stack or backend-heavy (NOT frontend-only)

**Red flag keywords:**
- "Managed stakeholders", "Defined strategy", "Led business unit"
- Skills list with ONLY: Leadership, Communication, Strategy

**Key metric: `handsOnCurrent` score**
This is the MOST important number. It should be 70-100 for strong candidates.

---

### TIER 2: AI/ML Experience (25% weight) 🟡 FLEXIBLE

**Old approach (too rigid):**
```
if (noAiExperience) {
  REJECT; // Too strict!
}
```

**New approach (holistic):**
```
if (strongBackend && noAI) {
  PASS with note: "Can learn AI - strong technical foundation"
}

if (frontendOnly && claimsAI) {
  SKEPTICAL; // Likely surface-level
}
```

**Philosophy:**
- **"Builder who can learn AI"** > **"AI specialist who can't code"**
- Strong engineers with no AI yet: **PASS** (with note about AI learning)
- Weak engineers claiming AI experience: **REJECT** (probably surface-level)
- Frontend engineers claiming AI: **Verify carefully** (often just API calls)

**Examples:**
```
✅ PASS
Senior Backend Engineer, built distributed systems
No AI experience YET, but: startup background, fast learner, technical blog
→ Can learn AI, has the right DNA

❌ REJECT
Frontend developer, claims "AI experience"
Only used OpenAI API in React apps
→ Not deep technical AI work
```

---

### TIER 3: Leadership & EQ (20% weight) 🟢 ESSENTIAL

**What we look for:**
- Clear progression: Junior → Senior → Lead → Director/VP/CTO
- Team building evidence: hired teams, mentored engineers, built culture
- Customer-facing signals: demos, sales engineering, conference talks
- Charisma markers: blog posts, open source, community leadership

**Balance required:**
- Leadership + Technical = ✅ Perfect
- Leadership + No Technical = ❌ Executive drift
- Technical + No Leadership = ⚠️ Borderline (can grow into it)

---

### TIER 4: Startup Experience (15% weight) 🔵 VALUABLE

**Bonus points for:**
- Built 0→1 products
- Worked at startups (not just FAANG)
- Comfortable with ambiguity
- Wears multiple hats

**Why it matters:**
Local CTO role is scrappy, entrepreneurial, hands-on. Big-company executives often struggle with this.

---

## Evaluation Process: Step-by-Step

### Step 1: Red Flag Scan (30 seconds)
Look at last 3 roles:
- [ ] Are the titles pure executive? (VP Strategy, Chief Officer, etc.)
- [ ] Do descriptions lack technical keywords?
- [ ] Is skills list all soft skills?

**If YES to all → REJECT** (executive drift)

---

### Step 2: Technical Verification (1 minute)
Check recent work (last 2-3 years):
- [ ] Job descriptions mention building/coding?
- [ ] Skills include languages, frameworks, tools?
- [ ] Projects show concrete technical delivery?

**If NO to all → REJECT** (not hands-on)

---

### Step 3: AI Flexibility (30 seconds)
```
if (hasAI) {
  ✅ Great!
} else if (strongTechnical) {
  ✅ Can learn - note it
} else {
  ❌ Reject - too weak overall
}
```

---

### Step 4: Holistic Decision (1 minute)
Ask yourself:
1. **Would this person thrive as a hands-on CTO?**
2. **Can they code, architect systems, AND lead teams?**
3. **Do they have the energy/charisma for enterprise sales?**

If unsure, check `handsOnCurrent` score:
- **80-100**: Strong hands-on → PASS
- **50-79**: Mixed signals → Dig deeper
- **0-49**: Pure executive → REJECT

---

## Scoring Philosophy

### Old Way (Arithmetic):
```
overallScore = (technical + leadership + ai + cultural) / 4
→ Problem: Executives score high on leadership, low on technical, average out to PASS
```

### New Way (Holistic):
```
if (handsOnCurrent < 60) {
  → REJECT (executive drift, doesn't matter how high other scores are)
}

if (handsOnCurrent >= 80 && leadership > 70) {
  → PASS (right profile, even if AI score is low)
}
```

**Key insight:** It's not about the average - it's about the PATTERN.

---

## Real-World Examples

### Example 1: False Positive (Now Caught)
```
Candidate: VP Engineering, Large Bank (7 years)
Skills: Leadership, Stakeholder Management, Business Strategy
Description: "Managed 200-person engineering org, $50M budget"

Old System: PASS (92/100) - high leadership scores
New System: REJECT - Executive drift, no hands-on coding

Reasoning: "Impressive executive but not hands-on technical leader"
```

---

### Example 2: False Negative (Now Fixed)
```
Candidate: Senior Backend Engineer, Startup
Built distributed microservices, Kubernetes, PostgreSQL
No AI/ML experience yet, but strong technical blog

Old System: REJECT - failed "must have AI" requirement
New System: PASS (78/100) - Strong technical, can learn AI

Reasoning: "Strong hands-on engineer, can learn AI stack quickly"
Concerns: ["Limited AI/ML experience - will need ramp-up time"]
Strengths: ["Deep backend expertise", "Startup experience", "Technical leadership"]
```

---

### Example 3: Perfect Candidate
```
Candidate: Lead Engineer, AI Startup
Built ML recommendation system, Python/TensorFlow
Led team of 5, customer-facing demos

Old System: PASS (95/100)
New System: PASS (96/100) - All tiers met

Reasoning: "Ideal: hands-on AI engineer with leadership experience"
```

---

## Key Metrics Explained

### `handsOnCurrent` (0-100)
**The most important number**

**What it measures:** Is this person coding RIGHT NOW?

- **90-100**: Active contributor, commits code daily, reviews PRs
- **70-89**: Mix of coding + leading, still technical
- **50-69**: Mostly management, occasional coding
- **30-49**: Pure management, might review code
- **0-29**: Executive, hasn't coded in years

**Critical threshold: 60**
- Below 60 → Likely executive drift → REJECT
- Above 60 → Still hands-on → Consider PASS

---

### `overallScore` (0-100)
**Holistic fit for the role**

NOT an arithmetic average. Based on:
- Can they do the job? (hands-on + leadership)
- Do they match the culture? (startup energy, builder mentality)
- How quickly can they ramp? (AI experience, learning agility)

---

### `confidence` (0-100)
**How sure are we about this decision?**

- **90-100**: Clear PASS or clear REJECT, strong signals
- **70-89**: Confident but some uncertainty
- **50-69**: Borderline case, could go either way
- **< 50**: Insufficient data, hard to evaluate

---

## Decision Thresholds

```
if (executiveDrift) → REJECT
if (frontendOnly) → REJECT
if (handsOnCurrent < 60) → REJECT

if (handsOnCurrent >= 80 && leadership >= 70) → PASS
if (handsOnCurrent >= 70 && hasAI) → PASS

otherwise → Use holistic judgment
```

---

## Common Patterns

### Pattern: "Startup Builder" ✅ PASS
- Built products 0→1
- Wears multiple hats
- Hands-on + scrappy
- May lack AI but can learn

### Pattern: "Big Tech Executive" ❌ REJECT
- 10+ years at FAANG
- Moved into pure management
- No recent coding
- Impressive but wrong fit

### Pattern: "AI Researcher" ⚠️ DEPENDS
- PhD, published papers
- If: Can code, build systems → PASS
- If: Only theory, no engineering → REJECT

### Pattern: "Strong Engineer, No AI" ✅ PASS WITH NOTE
- Deep backend/systems experience
- Startup background
- Clear technical progression
- Can learn AI stack

---

## Implementation Notes

The new prompt is in `lib/ai/agents/final-decision.ts`:

- **Emoji indicators** help the AI model focus on key sections
- **Tiered weighting** (40%/25%/20%/15%) guides importance
- **Concrete examples** reduce ambiguity
- **Red flag checks first** catch executives early
- **Narrative decision-making** over pure scores

---

## Monitoring & Iteration

### Track these metrics:
1. **False positive rate**: Executives passing → Should be near zero
2. **False negative rate**: Strong engineers rejected for no AI → Should decrease
3. **`handsOnCurrent` distribution**: Most PASS should have 70+
4. **AI gap passes**: Track engineers who pass despite no AI

### Review regularly:
- Are we still catching executive drift?
- Are we too lenient on AI requirements?
- Do scores align with manual review?

---

## Summary

| Aspect | Old Approach | New Approach |
|--------|-------------|--------------|
| **Philosophy** | Score-based, checklist | Pattern-based, holistic |
| **AI/ML** | Must-have, strict | Flexible for strong engineers |
| **Executives** | Often passed | Caught by red flags |
| **Scoring** | Arithmetic average | Weighted, narrative |
| **Key Metric** | Overall score | `handsOnCurrent` |
| **Decision** | Sum of scores | Pattern + story |

**Bottom line:** We now catch false positives (executives) and reduce false negatives (strong engineers without AI). The system tells a story about each candidate rather than just computing numbers.
