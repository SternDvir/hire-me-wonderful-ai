import { z } from "zod";

// Language proficiency schema
export const LanguageSchema = z.object({
  name: z.string(),
  proficiency: z.union([
    z.enum([
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ]),
    z.literal(""),
    z.null()
  ]).optional()
});

// Experience entry schema
export const ExperienceSchema = z.object({
  companyId: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(), // Sometimes missing or null
  companySize: z.string().nullable().optional(),
  companyWebsite: z.string().nullable().optional(),
  companyIndustry: z.string().nullable().optional(),
  title: z.string().nullable().optional(), // Sometimes null
  jobDescription: z.string().nullable().optional(),
  jobStartedOn: z.string().nullable().optional(),
  jobEndedOn: z.string().nullable().optional(),
  jobStillWorking: z.boolean().nullable().optional(),
  jobLocation: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional()
});

// Education entry schema
export const EducationSchema = z.object({
  schoolName: z.string().nullable().optional(),
  degreeName: z.string().nullable().optional(),
  fieldOfStudy: z.string().nullable().optional(),
  startedOn: z.string().nullable().optional(),
  endedOn: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  // Add fields for alternative format
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  period: z.any().nullable().optional(),
});

// Skill schema
export const SkillSchema = z.object({
  name: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  endorsements: z.number().nullable().optional()
});

// Main LinkedIn Profile Schema
export const LinkedInProfileSchema = z.object({
  linkedinUrl: z.string().url(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(), // Sometimes constructed
  headline: z.string().nullable().optional(),
  connections: z.number().nullable().optional(),
  followers: z.number().nullable().optional(),
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  jobTitle: z.string().nullable().optional(),
  jobLocation: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  addressCountryOnly: z.string().nullable().optional(),
  addressWithCountry: z.string().nullable().optional(),
  profilePic: z.string().nullable().optional(),
  linkedinId: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  experiences: z.array(ExperienceSchema).nullable().optional().default([]),
  educations: z.array(EducationSchema).nullable().optional().default([]),
  skills: z.array(SkillSchema).nullable().optional().default([]),
  languages: z.array(LanguageSchema).nullable().optional().default([]),
  licenseAndCertificates: z.array(z.any()).nullable().optional().default([]),

  // Additional fields from Apify scraper (all optional)
  mobileNumber: z.any().nullable().optional(),
  jobStartedOn: z.string().nullable().optional(),
  jobStillWorking: z.boolean().nullable().optional(),
  companyIndustry: z.string().nullable().optional(),
  companyWebsite: z.string().nullable().optional(),
  companyLinkedin: z.string().nullable().optional(),
  companyFoundedIn: z.any().nullable().optional(),
  companySize: z.any().nullable().optional(),
  currentJobDuration: z.string().nullable().optional(),
  currentJobDurationInYrs: z.number().nullable().optional(),
  topSkillsByEndorsements: z.any().nullable().optional(),
  addressWithoutCountry: z.string().nullable().optional(),
  isPremium: z.boolean().nullable().optional(),
  isVerified: z.boolean().nullable().optional(),
  isJobSeeker: z.boolean().nullable().optional(),
  isRetired: z.boolean().nullable().optional(),
  isCreator: z.boolean().nullable().optional(),
  isInfluencer: z.boolean().nullable().optional(),
  publicIdentifier: z.string().nullable().optional(),
  linkedinPublicUrl: z.string().nullable().optional(),
  openConnection: z.boolean().nullable().optional(),
  urn: z.string().nullable().optional(),
  associatedHashtag: z.any().nullable().optional(),
  updates: z.any().nullable().optional(),
  creatorWebsite: z.any().nullable().optional(),
  honorsAndAwards: z.any().nullable().optional(),
  volunteerAndAwards: z.any().nullable().optional(),
  verifications: z.any().nullable().optional(),
  promos: z.any().nullable().optional(),
  highlights: z.any().nullable().optional(),
  projects: z.any().nullable().optional(),
  publications: z.any().nullable().optional(),
  patents: z.any().nullable().optional(),
  courses: z.any().nullable().optional(),
  testScores: z.any().nullable().optional(),
  organizations: z.any().nullable().optional(),
  volunteerCauses: z.any().nullable().optional(),
  interests: z.any().nullable().optional(),
  recommendationsReceived: z.any().nullable().optional(),
  recommendations: z.any().nullable().optional(),
  peopleAlsoViewed: z.any().nullable().optional()
}).passthrough(); // Allow any additional fields we haven't defined

// Array of profiles (Apify output)
export const ApifyOutputSchema = z.array(LinkedInProfileSchema);

export type LinkedInProfile = z.infer<typeof LinkedInProfileSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Language = z.infer<typeof LanguageSchema>;
