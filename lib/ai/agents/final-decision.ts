import OpenAI from "openai";
import { LinkedInProfile } from "@/lib/schemas/linkedin";
import { EnrichedCompany } from "@/lib/schemas/company";
import { FinalDecisionSchema, FinalDecision, LanguageCheck } from "@/lib/schemas/evaluation";
import { zodResponseFormat } from "openai/helpers/zod";

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

    let content = completion.choices[0].message.content;
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
    return {
      decision: "REJECT",
      reasoning: "AI Evaluation Failed",
      concerns: ["System error during evaluation"],
      strengths: [],
      confidence: 0,
      overallScore: 0,
      detailedAnalysis: {
        technicalDepth: 0,
        leadershipCapability: 0,
        culturalFit: 0,
        customerFacing: 0,
        handsOnCurrent: 0
      },
      interviewRecommendation: "Not Recommended"
    };
  }
}
