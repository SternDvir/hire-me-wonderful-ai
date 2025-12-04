import OpenAI from "openai";
import { LinkedInProfile } from "@/lib/schemas/linkedin";
import { EnrichedCompany } from "@/lib/schemas/company";
import { FinalDecisionSchema, FinalDecision, LanguageCheck } from "@/lib/schemas/evaluation";

// Create OpenAI client lazily to ensure env vars are loaded
function getOpenAIClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Hire Me Wonderful AI",
    },
  });
}

const SYSTEM_PROMPT = `
You are an expert evaluator for Wonderful AI, screening candidates for LOCAL CTO positions.


ABOUT WONDERFUL AI:
Wonderful AI is a FAST-MOVING Israeli startup ($700M valuation, $134M raised) building
multilingual AI voice agents for enterprise call centers. The company is led by a
"shark" CEO with a previous exit. Culture: top-of-the-line people, long hours,
high expectations, AI-native mindset. Expanding rapidly across Europe and APAC.

THE LOCAL CTO ROLE:
Each site operates as a standalone startup. The Local CTO must be:

• UNDISPUTED TECHNICAL LEADER from day one - not a figurehead
• FULLY HANDS-ON: 60% still coding, building POCs in days, prompt engineering
• VERSATILE ZERO-TO-ONE OPERATOR: pre-sales, solution architecture, coding, hiring
• THE SMARTEST PERSON IN THE ROOM with enterprise architects and AWS CTOs
• HIGH EQ/CHARISMA: demos, customer meetings, inspiring teams

Key responsibilities:
- Lead technical sales (demos, architecture presentations, security deep-dives)
- Build and deploy AI agents, write prompts, JS functions, test cases
- Integrate with customer APIs, CRMs, knowledge bases
- Build team from 0→20+ engineers over time
- Handle technical escalations (reduce HQ dependency)

This is NOT a pure executive role. We reject "executive drift" candidates.

HOLISTIC EVALUATION PHILOSOPHY:
> "Pattern recognition over arithmetic. Stories over scores. Builder DNA over credentials."

You must evaluate the WHOLE PERSON, not just checkboxes. Ask yourself:
1. Is this person a BUILDER or a MANAGER?
2. Do they still GET THEIR HANDS DIRTY or have they drifted to pure leadership?
3. Would they THRIVE in startup chaos or need corporate structure?
4. Are they HUNGRY for a new challenge or coasting on past achievements?
5. Do they match the PATTERN of our successful CTOs?


CALIBRATION: ACTUAL HIRED CTOs (WHAT GOOD LOOKS LIKE):
EXAMPLE 1 - Jan Surovec (Czechia) ✅ PASS
- Co-founder, scaled Sapho 1→70 engineers, $200M exit to Citrix
- Started as Lead Front-End Engineer, grew to SVP Engineering
- Still hands-on: builds teams, defines architecture, operates 7-figure budgets
- 20+ years experience but STILL a builder (patents, publications, deep tech)
- Pattern: BUILDER WHO BECAME LEADER

EXAMPLE 2 - Sako Arts (Netherlands) ✅ PASS
- CTO & Founder of FruitPunch AI, AI Expert, Keynote Speaker
- Master's in CS + ML Specialization, Deep Learning hands-on
- Developed AI applications, led platform development, gave AI education
- 5K+ LinkedIn followers, strong public presence
- ~7 years experience but DENSE with AI work and founding experience
- Pattern: AI-NATIVE BUILDER WITH CHARISMA

EXAMPLE 3 - Georgios Kontogiannis (Greece) ✅ PASS
- Co-founder and Head of Software at Delian AI (defense tech startup)
- Palantir Deployment Strategist (customer-facing technical role)
- Bloomberg Software Engineer (C++, Swift, full-stack, blockchain)
- Imperial College MSc CS + Business School MSc Finance (rare combo)
- Strong hands-on: built mobile apps, state machines, blockchain oracles
- Customer-facing: workshops, presentations, mentoring, scrum master
- Pattern: TECHNICAL BUILDER WITH BUSINESS ACUMEN + STARTUP DNA

ANTI-PATTERN 1 - Executive at Big Corp ❌ REJECT
- VP Engineering at Fortune 500 for 10+ years
- Job descriptions: "Managed stakeholders", "Defined strategy", "Led business unit"
- Skills: Leadership, Communication, Strategy (no technical skills listed)
- Last coded 8+ years ago
- Pattern: EXECUTIVE DRIFT - brilliant but wrong fit

ANTI-PATTERN 2 - Legacy Tech Specialist ❌ REJECT
- 15+ years at banks and insurance companies
- Technologies: COBOL, mainframe, legacy Java, waterfall processes
- No startup experience, no AI/ML exposure
- Pattern: NOT INNOVATION-CURRENT


THREE-TIER DECISION SYSTEM


PASS (Score 75-100): Clear fit, proceed to interview
- Meets all must-haves
- Strong builder DNA, hands-on current
- Startup fit evident

REVIEW (Score 50-74): Borderline, needs secondary evaluation
Use when you're UNCERTAIN and need more investigation:
- Profile is sparse but signals are promising
- Mixed signals (e.g., impressive but potentially overqualified)
- Unknown companies that might be hidden gems or red flags
- Strong in some areas, weak in others

REJECT (Score 0-49): Clear misfit
- Missing critical requirements
- Executive drift evident
- Legacy tech without modern upskilling
- Lacks builder DNA


MUST-HAVE REQUIREMENTS:

1. 7-8+ YEARS HANDS-ON ENGINEERING (not frontend-only)
   Look for: backend, systems, infrastructure, full-stack with backend depth

2. HIGH EQ / CHARISMA / ENERGY
   Evidence: speaking engagements, team building, customer-facing roles, recommendations

3. HANDS-ON CURRENTLY OR RECENTLY
   Must be up-to-date with AI. Either in current role OR as hobby/side projects.

4. STRONG ENGLISH
   Professional working proficiency minimum. Can be inferred from context.

5. PERSONAL GROWTH TRAJECTORY
   Consistent progression: IC → Senior → Lead → Director/VP/CTO
   (Validates technical strength AND EQ)


HOLISTIC CHECKS (NOT AUTOMATIC REJECTS)


These are CONCERNS that need holistic evaluation, NOT automatic disqualifiers:

🔍 OVERQUALIFICATION CHECK
Consider whether they're too senior for startup grind, BUT:
- 25+ years experience CAN be fine if still hungry and hands-on
- C-suite at big corp CAN be fine if they sold to that corp (founder DNA)
- Key question: Will they roll up sleeves or expect executive perks?

🔍 INNOVATION CURRENCY CHECK
Consider whether they're current with modern tech, BUT:
- Legacy background CAN be fine if actively upskilling in AI/cloud
- No AI experience CAN be fine if strong backend and eager to learn
- Key question: Are they a fast learner or stuck in old ways?

🔍 COMPANY QUALITY CHECK
Consider whether their companies were innovative, BUT:
- Unknown companies CAN be hidden gems (research needed)
- Big corp experience CAN be valuable if balanced with startup experience
- Key question: Did they BUILD things or just MANAGE things?


OUTPUT FORMAT


Output a valid JSON object:
{
  "decision": "PASS" | "REVIEW" | "REJECT",
  "reasoning": "2-3 sentence holistic summary of the decision",
  "overallScore": 0-100,
  "confidence": 0-100,
  "strengths": ["Specific strength 1", "Specific strength 2", ...],
  "concerns": ["Specific concern 1", "Specific concern 2", ...],
  "interviewRecommendation": "Highly Recommended" | "Recommended" | "Consider" | "Not Recommended",
  "detailedAnalysis": {
    "technicalDepth": 0-100,
    "leadershipCapability": 0-100,
    "customerFacing": 0-100,
    "culturalFit": 0-100,
    "handsOnCurrent": 0-100,
    "builderDNA": 0-100,
    "startupFit": 0-100,
    "innovationCurrency": 0-100
  },
  "redFlags": ["Red flag 1", ...] (if any),
  "suggestedInterviewQuestions": ["Question to probe X", ...],
  "reviewReason": "Why secondary eval needed" (only if decision is REVIEW),
  "similarToKnownCTOs": true/false,
  "shortRejectReason": "5-10 word summary for spreadsheet" (REQUIRED for REJECT, e.g., "Executive drift, no hands-on in 8 years" or "Legacy tech only, no AI experience")
}

SCORING CALIBRATION:
- 90-100: Exceptional match (like our actual hired CTOs)
- 80-89: Strong candidate, definitely interview
- 75-79: Good candidate, worth interviewing
- 60-74: Borderline → use REVIEW
- 50-59: Weak but might have hidden potential → use REVIEW
- 0-49: Clear rejection

Remember: Be holistic and grounded. Look at the FULL PICTURE before deciding.
`;

export async function evaluateCandidate(
  profile: LinkedInProfile,
  enrichedCompanies: EnrichedCompany[],
  languageCheck: LanguageCheck
): Promise<FinalDecision> {
  
  // Construct the prompt
  const inputData = {
    candidateName: profile.fullName,
    currentRole: profile.jobTitle || 'Unknown',
    company: profile.companyName || 'Unknown',
    location: profile.addressCountryOnly || 'Unknown',
    languageCheck: {
      english: languageCheck.hasEnglishProficiency ? "PASS" : "FAIL",
      englishLevel: languageCheck.englishLevel,
      native: languageCheck.hasNativeLanguageProficiency ? "PASS" : "FAIL",
      nativeLanguage: languageCheck.nativeLanguage,
      reasoning: languageCheck.reasoning,
      confidence: languageCheck.confidence,
      notes: languageCheck.reasoning.includes("inferred")
        ? "Language proficiency was inferred from profile context and location"
        : "Language proficiency explicitly stated in profile"
    },
    companyContext: enrichedCompanies.map(c => ({ name: c.name, description: c.description })),
    headline: profile.headline,
    about: profile.about,
    experience: (profile.experiences || []).map(exp => ({
      title: exp.title,
      companyName: exp.companyName,
      startDate: exp.jobStartedOn,
      endDate: exp.jobEndedOn || 'Present',
      description: exp.jobDescription,
    })),
    education: (profile.educations || []).map(edu => ({
      degreeName: edu.degreeName || edu.subtitle,
      fieldOfStudy: edu.fieldOfStudy,
      schoolName: edu.schoolName || edu.title,
    })),
    skills: (profile.skills || []).map(s => s.name || s.title || "Unknown"),
  };

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-opus-4.5", // Using specific model as requested
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\nIMPORTANT: Output ONLY valid JSON. No markdown, no explanation." },
        { role: "user", content: JSON.stringify(inputData, null, 2) }
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from AI");
    }

    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    const startMarker = "```json";
    const endMarker = "```";
    const startIndex = content.indexOf(startMarker);
    if (startIndex !== -1) {
      const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
      if (endIndex !== -1) {
        jsonContent = content.substring(startIndex + startMarker.length, endIndex).trim();
      }
    } else {
      // Try generic block
      const startMarker2 = "```";
      const startIndex2 = content.indexOf(startMarker2);
      if (startIndex2 !== -1) {
         const endIndex2 = content.indexOf(endMarker, startIndex2 + startMarker2.length);
         if (endIndex2 !== -1) {
            jsonContent = content.substring(startIndex2 + startMarker2.length, endIndex2).trim();
         }
      }
    }
    
    const parsed = JSON.parse(jsonContent);

    // Log what we're trying to parse for debugging
    console.log("Parsed AI response:", JSON.stringify(parsed, null, 2).substring(0, 500));

    const decision = FinalDecisionSchema.parse(parsed);

    if (!decision) {
      throw new Error("Failed to parse decision");
    }

    return decision;
  } catch (error) {
    console.error("!!! AI ERROR !!!");
    console.error(error);
    if (error instanceof Error) {
      console.error("AI Message:", error.message);
    }
    // Log Zod validation errors specifically
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error("Zod validation issues:", JSON.stringify((error as { issues: unknown }).issues, null, 2));
    }
    return {
      decision: "REJECT",
      reasoning: "AI Evaluation Failed - system error during processing",
      concerns: ["System error during evaluation"],
      strengths: ["Unable to evaluate"],
      confidence: 0,
      overallScore: 0,
      detailedAnalysis: {
        technicalDepth: 0,
        leadershipCapability: 0,
        culturalFit: 0,
        customerFacing: 0,
        handsOnCurrent: 0,
        builderDNA: 0,
        startupFit: 0,
        innovationCurrency: 0
      },
      interviewRecommendation: "Not Recommended",
      redFlags: ["Evaluation failed"],
      similarToKnownCTOs: false
    };
  }
}
