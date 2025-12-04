import OpenAI from "openai";
import { LinkedInProfile } from "@/lib/schemas/linkedin";
import { EnrichedCompany } from "@/lib/schemas/company";
import { FinalDecision, LanguageCheck } from "@/lib/schemas/evaluation";

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

const SECONDARY_EVAL_PROMPT = `
You are performing a SECONDARY EVALUATION for a borderline candidate who received a REVIEW decision.


WHY THIS CANDIDATE NEEDS DEEPER EVALUATION


The initial screening flagged this candidate as REVIEW because:
{REVIEW_REASON}

Initial Score: {INITIAL_SCORE}
Initial Concerns: {INITIAL_CONCERNS}
Initial Strengths: {INITIAL_STRENGTHS}

YOUR TASK: DEEPER INVESTIGATION:

Perform a thorough second-pass analysis focusing on:

1. BUILDER DNA INVESTIGATION
   - Look for ACTION VERBS in job descriptions: "built", "developed", "created", "architected"
   - vs MANAGEMENT VERBS: "managed", "oversaw", "led", "defined strategy"
   - Ratio of building to managing indicates hands-on level

2. CAREER TRAJECTORY ANALYSIS
   - Is the trajectory UP (growth) or FLAT (stagnation)?
   - Did they move from big corp TO startup (positive) or startup TO big corp (might be coasting)?
   - Were role changes PROMOTIONS or LATERAL moves?

3. COMPANY QUALITY DEEP DIVE
   - Are their "unknown" companies actually interesting startups?
   - Did they join early-stage companies (founding team energy)?
   - Or always join mature orgs with established processes?

4. OVERQUALIFICATION CHECK
   - If very senior (25+ years, C-suite at big corp):
     - Are they STILL HUNGRY? Look for recent side projects, open source, speaking
     - Would they roll up sleeves or expect executive treatment?
     - Have they started something NEW recently?

5. INNOVATION CURRENCY CHECK
   - When was their last hands-on technical work?
   - Are their skills MODERN or legacy?
   - Any evidence of continuous learning (certs, courses, new tech adoption)?

6. PATTERN MATCHING against known good CTOs:
   - Jan Surovec pattern: Builder who became leader, still hands-on despite seniority
   - Sako Arts pattern: AI-native, founder DNA, high charisma/presence
   - Georgios pattern: Technical builder with business acumen, startup DNA


DECISION FRAMEWORK:

After deeper analysis, choose ONE of:

PASS (Upgrade from REVIEW):
- Hidden strengths discovered on closer look
- Initial concerns were due to sparse profile, not actual weaknesses
- Pattern matches our successful CTOs
- Builder DNA is evident despite surface-level concerns

REJECT (Downgrade from REVIEW):
- Deeper look confirms initial concerns
- Executive drift is real (not just missing info)
- Innovation currency is low
- Would not thrive in startup grind

If you're STILL uncertain after this analysis, lean toward REJECT.
Wonderful AI has high standards - when in doubt, pass on the candidate.

OUTPUT FORMAT

Output a valid JSON object:
{
  "finalDecision": "PASS" | "REJECT",
  "reasoning": "2-3 sentences explaining why the deeper analysis led to this conclusion",
  "keyFindings": ["Finding 1", "Finding 2", ...],
  "builderDNAEvidence": "Specific evidence of builder vs manager mentality",
  "innovationCurrencyAssessment": "Assessment of how current their skills are",
  "overqualificationAssessment": "If applicable, assessment of whether too senior",
  "patternMatch": "Which successful CTO pattern they most resemble (if any)",
  "updatedScore": 0-100,
  "confidence": 0-100,
  "shortRejectReason": "5-10 word summary for spreadsheet" (REQUIRED if finalDecision is REJECT, e.g., "Executive drift confirmed, no recent hands-on" or "Legacy tech, no startup DNA")
}

Be decisive. The purpose of secondary evaluation is to RESOLVE uncertainty, not perpetuate it.
`;

interface SecondaryEvaluationResult {
  finalDecision: "PASS" | "REJECT";
  reasoning: string;
  keyFindings: string[];
  builderDNAEvidence: string;
  innovationCurrencyAssessment: string;
  overqualificationAssessment: string;
  patternMatch: string;
  updatedScore: number;
  confidence: number;
  shortRejectReason?: string; // Required for REJECT decisions
}

export async function performSecondaryEvaluation(
  profile: LinkedInProfile,
  enrichedCompanies: EnrichedCompany[],
  languageCheck: LanguageCheck,
  initialDecision: FinalDecision
): Promise<SecondaryEvaluationResult> {

  // Build the prompt with context from initial evaluation
  const contextualPrompt = SECONDARY_EVAL_PROMPT
    .replace("{REVIEW_REASON}", initialDecision.reviewReason || "Borderline score with mixed signals")
    .replace("{INITIAL_SCORE}", String(initialDecision.overallScore))
    .replace("{INITIAL_CONCERNS}", initialDecision.concerns.join(", ") || "None specified")
    .replace("{INITIAL_STRENGTHS}", initialDecision.strengths.join(", ") || "None specified");

  const inputData = {
    candidateName: profile.fullName,
    currentRole: profile.jobTitle || 'Unknown',
    company: profile.companyName || 'Unknown',
    location: profile.addressCountryOnly || 'Unknown',
    headline: profile.headline,
    about: profile.about,
    experience: (profile.experiences || []).map(exp => ({
      title: exp.title,
      companyName: exp.companyName,
      startDate: exp.jobStartedOn,
      endDate: exp.jobEndedOn || 'Present',
      description: exp.jobDescription,
      companySize: exp.companySize,
      companyIndustry: exp.companyIndustry,
    })),
    education: (profile.educations || []).map(edu => ({
      degreeName: edu.degreeName || edu.subtitle,
      fieldOfStudy: edu.fieldOfStudy,
      schoolName: edu.schoolName || edu.title,
    })),
    skills: (profile.skills || []).map(s => s.name || s.title || "Unknown"),
    languages: profile.languages || [],
    companyContext: enrichedCompanies.map(c => ({
      name: c.name,
      description: c.description,
      industry: c.industry,
      fundingInfo: c.fundingInfo,
      techStack: c.techStack
    })),
    // Include the initial decision context
    initialEvaluation: {
      score: initialDecision.overallScore,
      concerns: initialDecision.concerns,
      strengths: initialDecision.strengths,
      detailedAnalysis: initialDecision.detailedAnalysis,
      reviewReason: initialDecision.reviewReason
    }
  };

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-opus-4.5",
      messages: [
        { role: "system", content: contextualPrompt + "\n\nIMPORTANT: Output ONLY valid JSON. No markdown, no explanation." },
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
      const startMarker2 = "```";
      const startIndex2 = content.indexOf(startMarker2);
      if (startIndex2 !== -1) {
        const endIndex2 = content.indexOf(endMarker, startIndex2 + startMarker2.length);
        if (endIndex2 !== -1) {
          jsonContent = content.substring(startIndex2 + startMarker2.length, endIndex2).trim();
        }
      }
    }

    const parsed = JSON.parse(jsonContent) as SecondaryEvaluationResult;
    return parsed;

  } catch (error) {
    console.error("!!! SECONDARY EVALUATION ERROR !!!");
    console.error(error);

    // On error, default to REJECT (conservative approach)
    return {
      finalDecision: "REJECT",
      reasoning: "Secondary evaluation failed due to system error. Defaulting to reject for safety.",
      keyFindings: ["System error during evaluation"],
      builderDNAEvidence: "Unable to assess",
      innovationCurrencyAssessment: "Unable to assess",
      overqualificationAssessment: "Unable to assess",
      patternMatch: "None",
      updatedScore: 0,
      confidence: 0
    };
  }
}
