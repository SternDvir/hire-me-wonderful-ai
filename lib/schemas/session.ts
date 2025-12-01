import { z } from "zod";
import { CandidateEvaluationResultSchema } from "./evaluation";

export const ScreeningConfigSchema = z.object({
  enableCompanyEnrichment: z.boolean().default(true),
  targetRole: z.enum(["CTO", "VP_Engineering", "Engineering_Manager", "Custom"]).default("CTO"),
  targetCountry: z.string().optional(),
  customCriteria: z.string().optional(), // Additional criteria in natural language
  minimumYearsExperience: z.number().min(0).default(7),
  requireVPOrAbove: z.boolean().default(false),
  requireStartupExperience: z.boolean().default(false)
});

export const ScreeningSessionSchema = z.object({
  sessionId: z.string(), // UUID
  createdAt: z.string().datetime(),
  createdBy: z.string(), // User ID or email
  config: ScreeningConfigSchema,
  status: z.enum(["pending", "processing", "completed", "failed"]),
  
  // Statistics
  totalCandidates: z.number(),
  candidatesProcessed: z.number(),
  passedCandidates: z.number(),
  rejectedCandidates: z.number(),
  erroredCandidates: z.number(),
  
  // Costs
  totalCost: z.number(), // USD
  tavilyCost: z.number(),
  aiCost: z.number(),
  
  // Timing
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  totalProcessingTimeMs: z.number().optional(),
  
  // Results
  results: z.array(CandidateEvaluationResultSchema).optional(),
  
  // Errors
  errors: z.array(z.object({
    candidateId: z.string(),
    error: z.string(),
    timestamp: z.string().datetime()
  })).optional()
});

export type ScreeningConfig = z.infer<typeof ScreeningConfigSchema>;
export type ScreeningSession = z.infer<typeof ScreeningSessionSchema>;
