# AI Evaluation Prompts

> **Last Updated:** 2025-12-02
> **Critical:** This file contains the core logic for candidate evaluation

---

## Philosophy: Holistic Evaluation

We use **pattern recognition over arithmetic**. Instead of checking boxes, we look at:

1. **Are they a builder or a manager?** (Builder DNA required)
2. **Do they still code?** (Must be hands-on)
3. **Can they learn AI/ML?** (Flexibility over strict requirements)

See `docs/SCREENING_PHILOSOPHY.md` for detailed philosophy.

---

## Evaluation Tiers

| Tier | Weight | What We Check |
|------|--------|---------------|
| Technical Hands-On | 40% | Recent coding, backend/systems, not frontend-only |
| AI/ML Experience | 25% | Flexible - strong engineers can learn |
| Leadership & EQ | 20% | Progression, team building, charisma |
| Startup Experience | 15% | 0→1 building, scrappy mentality |

---

## Red Flags (Immediate Rejection)

### 1. Executive Drift (Most Critical)
- Last 5-7 years in pure management roles
- Job descriptions only mention soft skills
- Skills list lacks technical depth
- **Signal:** "VP Strategy", "Chief Business Officer"

### 2. Frontend-Only
- Career entirely React/Vue/Angular
- No backend, infrastructure, databases
- Can't discuss APIs or cloud architecture

### 3. Insufficient Experience
- < 7 years total engineering
- No growth trajectory (still junior after 10 years)

---

## Key Metrics

### `handsOnCurrent` (0-100) - MOST IMPORTANT
- **90-100:** Active contributor, daily coding
- **70-89:** Mix of coding + leading
- **50-69:** Mostly management, occasional coding
- **30-49:** Pure management
- **0-29:** Executive, hasn't coded in years

**Critical threshold: 60** - Below this = likely rejection

### `overallScore` (0-100)
Holistic fit based on pattern, not average of subscores.

### `confidence` (0-100)
How certain we are about the decision.

---

## Current Prompt Location

The main evaluation prompt is in:
```
lib/ai/agents/final-decision.ts
```

---

## Prompt Template (Active Version)

```typescript
const SYSTEM_PROMPT = `
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
5. Reasoning MUST be concise (max 10 words)
6. Be STRICT but FAIR - when borderline, choose PASS

MUST-HAVE (ALL Required):
1. Strong Software Engineering: 7-8+ years hands-on, NOT frontend-only
2. High EQ/Charisma: Leadership language, team building, energy evident
3. AI Experience: Recent (1-2 years) hands-on AI/ML work
4. English Proficiency: Professional level or higher (can be inferred from context)
5. Native Language: Professional level in country's native language (can be inferred from location)
6. Leadership Progression: Junior -> Senior -> Lead -> Director/VP
7. Wonderful Values: Urgency, Professionalism, Independence, Vibe

LANGUAGE HANDLING:
- If languages are explicitly listed with proficiency: Use that information
- If languages are inferred from location/context: Accept but note with lower confidence
- If language info is missing AND cannot be inferred: Note as concern but evaluate other factors
- DO NOT auto-reject solely for inferred or missing language info if candidate is strong otherwise

AUTO-REJECT:
- < 5 years experience
- Frontend-only
- Zero AI experience
- Career gap > 3 years unexplained
- Only junior roles

OUTPUT FORMAT:
You must output a valid JSON object matching this schema:
{
  "decision": "PASS" | "REJECT",
  "reasoning": "String (max 10 words)",
  "concerns": ["String"],
  "strengths": ["String"],
  "confidence": Number (0-100),
  "overallScore": Number (0-100),
  "detailedAnalysis": {
    "technicalDepth": Number (0-100),
    "leadershipCapability": Number (0-100),
    "culturalFit": Number (0-100),
    "customerFacing": Number (0-100),
    "handsOnCurrent": Number (0-100)
  },
  "interviewRecommendation": "Highly Recommended" | "Recommended" | "Consider" | "Not Recommended"
}
`;
```

---

## Language Checker Prompt

Located in: `lib/ai/agents/language-checker.ts`

Key logic:
- Check for English at "Professional" level or higher
- Check for native language of current country
- Can infer from education, work history, profile language
- Lenient when evidence suggests proficiency even without explicit listing

---

## Decision Matrix

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

### Pattern: "Startup Builder" - PASS
- Built products 0→1
- Wears multiple hats
- Hands-on + scrappy
- May lack AI but can learn

### Pattern: "Big Tech Executive" - REJECT
- 10+ years at FAANG
- Moved into pure management
- No recent coding
- Impressive but wrong fit

### Pattern: "AI Researcher" - DEPENDS
- PhD, published papers
- If can code → PASS
- If only theory → REJECT

### Pattern: "Strong Engineer, No AI" - PASS WITH NOTE
- Deep backend/systems
- Startup background
- Clear progression
- Can learn AI stack

---

## Updating Prompts

When modifying prompts:
1. Document the change with date in this file
2. Test on 10 known examples (5 PASS, 5 REJECT)
3. Verify `handsOnCurrent` scores are calibrated
4. Check that executive drift is still caught
5. Update CHANGELOG.md with prompt version

---

## Version History

| Date | Change | Impact |
|------|--------|--------|
| 2025-12-01 | Moved from score-based to holistic | Fewer false positives (executives) |
| 2025-12-01 | Made AI requirement flexible | Fewer false negatives (strong engineers) |
| 2025-12-01 | Added language inference | Better handling of incomplete profiles |
