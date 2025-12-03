import { z } from "zod";
import { LinkedInProfileSchema } from "./linkedin";
import { EnrichedCompanySchema } from "./company";

// Experience Evaluation
export const ExperienceEvaluationSchema = z.object({
  totalYearsOfExperience: z.number(),
  yearsOfBackendExperience: z.number(),
  yearsOfLeadershipExperience: z.number(),
  hasHandsOnExperience: z.boolean(),
  isCurrentlyHandsOn: z.boolean(),
  technologiesUsed: z.array(z.string()),
  hasAIMLExperience: z.boolean(),
  passesMinimumYears: z.boolean(), // >= 7 years
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Leadership Evaluation
export const LeadershipEvaluationSchema = z.object({
  highestTitleLevel: z.enum(["IC", "Lead", "Manager", "Director", "VP", "SVP", "CTO", "CEO", "Unknown"]),
  hasBuiltTeams: z.boolean(),
  teamSizesLed: z.array(z.number()),
  hasVPOrAbove: z.boolean(),
  hasHiringExperience: z.boolean(),
  evidenceOfCharisma: z.array(z.string()), // Speaking engagements, blog posts, etc.
  evidenceOfEQ: z.array(z.string()),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Language Check
export const LanguageCheckSchema = z.object({
  hasEnglishProficiency: z.boolean(),
  englishLevel: z.enum([
    "Elementary",
    "Limited",
    "Professional",
    "Full Professional",
    "Native",
    "Unknown"
  ]).optional(),
  hasNativeLanguageProficiency: z.boolean(),
  nativeLanguage: z.string().optional(),
  currentCountry: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Company Background Evaluation
export const CompanyBackgroundEvaluationSchema = z.object({
  workedAtStartups: z.boolean(),
  workedAtProductCompanies: z.boolean(),
  hasFounderExperience: z.boolean(),
  companyQualityScore: z.number().min(0).max(100), // Average quality of companies
  notableCompanies: z.array(z.string()),
  industryDiversity: z.number().min(0).max(100), // How diverse is experience
  reasoning: z.string(),
  confidence: z.number().min(0).max(100)
});

// Bonus Factors Evaluation
export const BonusFactorsSchema = z.object({
  hasCustomerFacingExperience: z.boolean(),
  hasPreSalesExperience: z.boolean(),
  hasSolutionArchitectExperience: z.boolean(),
  hasPersonalGrowthTrajectory: z.boolean(),
  hasInternationalExperience: z.boolean(),
  hasStrongOnlinePresence: z.boolean(),
  reasoning: z.string()
});

// Final Decision Schema
export const FinalDecisionSchema = z.object({
  decision: z.enum(["PASS", "REVIEW", "REJECT"]), // Three-tier system
  reasoning: z.string(), // Allow any length reasoning
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  strengths: z.array(z.string()).max(10).default([]), // Allow empty strengths
  concerns: z.array(z.string()).max(10).default([]), // Allow empty concerns
  interviewRecommendation: z.enum([
    "Highly Recommended",
    "Recommended",
    "Consider",
    "Not Recommended"
  ]),
  detailedAnalysis: z.object({
    technicalDepth: z.number().min(0).max(100),
    leadershipCapability: z.number().min(0).max(100),
    customerFacing: z.number().min(0).max(100),
    culturalFit: z.number().min(0).max(100),
    handsOnCurrent: z.number().min(0).max(100),
    // New holistic dimensions - optional with defaults for backward compatibility
    builderDNA: z.number().min(0).max(100).optional().default(0),
    startupFit: z.number().min(0).max(100).optional().default(0),
    innovationCurrency: z.number().min(0).max(100).optional().default(0)
  }),
  redFlags: z.array(z.string()).optional(),
  suggestedInterviewQuestions: z.array(z.string()).optional(),
  // New field for REVIEW cases
  reviewReason: z.string().optional(), // Why this candidate needs secondary evaluation
  // New field for pattern matching
  similarToKnownCTOs: z.boolean().optional(), // Does profile pattern match successful hires?
  // Short rejection reason for spreadsheet (5-10 words max)
  shortRejectReason: z.string().optional() // e.g., "Executive drift, no hands-on in 8 years"
});

// Complete Candidate Evaluation Result
export const CandidateEvaluationResultSchema = z.object({
  // Identity
  candidateId: z.string(), // Generated UUID
  linkedinUrl: z.string().url(),
  fullName: z.string(),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  location: z.string().optional(),
  
  // Raw data
  profile: LinkedInProfileSchema,
  
  // Enriched data
  enrichedCompanies: z.array(EnrichedCompanySchema).optional(),
  
  // Agent evaluations
  experienceEvaluation: ExperienceEvaluationSchema,
  leadershipEvaluation: LeadershipEvaluationSchema,
  languageCheck: LanguageCheckSchema,
  companyBackgroundEvaluation: CompanyBackgroundEvaluationSchema,
  bonusFactors: BonusFactorsSchema,
  
  // Final decision
  finalDecision: FinalDecisionSchema,
  
  // Metadata
  screeningSessionId: z.string(), // UUID of the screening session
  evaluatedAt: z.string().datetime(),
  evaluationCost: z.number(), // USD
  processingTimeMs: z.number(),
  
  // Manual overrides (for future use)
  manualOverride: z.object({
    overridden: z.boolean(),
    newDecision: z.enum(["PASS", "REJECT"]).optional(),
    overrideReason: z.string().optional(),
    overriddenBy: z.string().optional(),
    overriddenAt: z.string().datetime().optional()
  }).optional()
});

export type ExperienceEvaluation = z.infer<typeof ExperienceEvaluationSchema>;
export type LeadershipEvaluation = z.infer<typeof LeadershipEvaluationSchema>;
export type LanguageCheck = z.infer<typeof LanguageCheckSchema>;
export type CompanyBackgroundEvaluation = z.infer<typeof CompanyBackgroundEvaluationSchema>;
export type BonusFactors = z.infer<typeof BonusFactorsSchema>;
export type FinalDecision = z.infer<typeof FinalDecisionSchema>;
export type CandidateEvaluationResult = z.infer<typeof CandidateEvaluationResultSchema>;
