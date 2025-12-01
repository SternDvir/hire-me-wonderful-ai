import { z } from "zod";

export const EnrichedCompanySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  founded: z.string().optional(),
  headquarters: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  fundingInfo: z.string().optional(),
  reputation: z.enum(["excellent", "good", "average", "poor", "unknown"]).optional(),
  techStack: z.array(z.string()).optional(),
  isStartup: z.boolean().optional(),
  isProductCompany: z.boolean().optional(),
  notableAchievements: z.array(z.string()).optional(),
  searchTimestamp: z.string().datetime().optional()
});

export type EnrichedCompany = z.infer<typeof EnrichedCompanySchema>;
