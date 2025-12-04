import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { scrapeLinkedInProfiles, validateLinkedInUrls } from "@/lib/services/apify";
import { extractCountryFromProfile } from "@/lib/utils/country-detection";

// Recursively sanitize an object to remove null characters that PostgreSQL can't handle
function sanitizeForPostgres(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return obj.replace(/\u0000/g, '');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForPostgres);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeForPostgres(value);
    }
    return sanitized;
  }
  return obj;
}

const ScrapeRequestSchema = z.object({
  urls: z.array(z.string()).min(1, "At least one URL is required"),
  createdBy: z.string().default("user"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ScrapeRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { urls, createdBy } = result.data;

    // Validate and normalize URLs
    const { valid: validUrls, invalid: invalidUrls } = validateLinkedInUrls(urls);

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid LinkedIn URLs provided", invalidUrls },
        { status: 400 }
      );
    }

    console.log(`Scraping ${validUrls.length} LinkedIn profiles...`);

    // Scrape profiles using Apify
    const scrapeResult = await scrapeLinkedInProfiles(validUrls);

    if (!scrapeResult.success) {
      return NextResponse.json(
        { error: "Scraping failed", message: scrapeResult.error },
        { status: 500 }
      );
    }

    if (scrapeResult.profiles.length === 0) {
      return NextResponse.json(
        { error: "No profiles were scraped successfully" },
        { status: 400 }
      );
    }

    // Sanitize profile data for PostgreSQL
    const sanitizedProfiles = scrapeResult.profiles.map(p => sanitizeForPostgres(p)) as typeof scrapeResult.profiles;

    // Collect unique countries from profiles
    const countryNames = new Set<string>();
    for (const profile of sanitizedProfiles) {
      const country = extractCountryFromProfile({
        addressCountryOnly: profile.addressCountryOnly,
        addressWithCountry: profile.addressWithCountry,
        location: profile.addressCountryOnly || profile.addressWithCountry,
        jobLocation: profile.jobLocation,
      });
      if (country) {
        countryNames.add(country);
      }
    }

    // Upsert countries and create a map of name -> id
    const countryMap = new Map<string, string>();
    for (const name of Array.from(countryNames)) {
      const country = await prisma.country.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      countryMap.set(name, country.id);
    }

    // Create screening session
    const session = await prisma.screeningSession.create({
      data: {
        createdBy,
        config: {
          enableCompanyEnrichment: true,
          targetRole: "CTO",
          minimumYearsExperience: 7,
          source: "apify_scrape",
        },
        status: "pending",
        totalCandidates: sanitizedProfiles.length,
        candidatesProcessed: 0,
        passedCandidates: 0,
        rejectedCandidates: 0,
        erroredCandidates: 0,
        totalCost: 0,
        tavilyCost: 0,
        aiCost: 0,
      },
    });

    // Prepare candidate data with country detection and input order
    const candidateData = sanitizedProfiles.map((profile, index) => {
      const country = extractCountryFromProfile({
        addressCountryOnly: profile.addressCountryOnly,
        addressWithCountry: profile.addressWithCountry,
        location: profile.addressCountryOnly || profile.addressWithCountry,
        jobLocation: profile.jobLocation,
      });
      const countryId = country ? countryMap.get(country) : null;

      return {
        screeningSessionId: session.id,
        candidateId: profile.linkedinUrl,
        linkedinUrl: profile.linkedinUrl,
        fullName: profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        currentTitle: profile.jobTitle || "",
        currentCompany: profile.companyName || "",
        location: profile.addressCountryOnly || "",
        profileData: profile as any,
        decisionResult: "PENDING" as const,
        overallScore: 0,
        evaluationCost: 0,
        processingTimeMs: 0,
        countryId: countryId || null,
        inputOrder: index,
      };
    });

    // Bulk insert candidates
    await prisma.candidateEvaluation.createMany({
      data: candidateData,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      count: sanitizedProfiles.length,
      invalidUrls: [...invalidUrls, ...scrapeResult.failedUrls],
      countriesDetected: Array.from(countryNames) as string[],
    });

  } catch (error) {
    console.error("Scrape API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
