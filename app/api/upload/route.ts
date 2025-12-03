import { NextRequest, NextResponse } from "next/server";
import { ApifyOutputSchema } from "@/lib/schemas/linkedin";
import { prisma } from "@/lib/prisma"; // We need to create this client instance
import { ScreeningSessionSchema } from "@/lib/schemas/session";
import { z } from "zod";

// Recursively sanitize an object to remove null characters that PostgreSQL can't handle
function sanitizeForPostgres(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Remove null characters and other problematic unicode
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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    // Sanitize the input to remove null characters before processing
    const body = sanitizeForPostgres(rawBody) as Record<string, unknown>;
    
    // 1. Validate input structure
    // Expecting { candidates: ApifyOutput, config: ScreeningConfig }
    const UploadSchema = z.object({
      candidates: ApifyOutputSchema,
      config: ScreeningSessionSchema.shape.config.optional(),
      createdBy: z.string().default("user"), // Placeholder for auth
      countryId: z.string().nullable().optional(), // Add countryId to the schema
    });

    const result = UploadSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation error:", JSON.stringify(result.error.format(), null, 2));
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: result.error.format(),
          message: "Check console for detailed validation errors"
        },
        { status: 400 }
      );
    }

    const { candidates, config, createdBy, countryId } = result.data; // Extract countryId

    // 2. Create Screening Session
    const session = await prisma.screeningSession.create({
      data: {
        createdBy,
        config: config || {
          enableCompanyEnrichment: true,
          targetRole: "CTO",
          minimumYearsExperience: 7
        },
        status: "pending",
        totalCandidates: candidates.length,
        candidatesProcessed: 0,
        passedCandidates: 0,
        rejectedCandidates: 0,
        erroredCandidates: 0,
        totalCost: 0,
        tavilyCost: 0,
        aiCost: 0,
        countryId: countryId || null // Save the countryId if provided
      }
    });

    // 3. Store Candidates using createMany for better performance
    try {
      const candidateData = candidates.map(profile => ({
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
        processingTimeMs: 0
      }));

      // Use createMany for bulk insert - much faster than individual creates
      await prisma.candidateEvaluation.createMany({
        data: candidateData,
        skipDuplicates: true // Skip if candidateId already exists
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        count: candidates.length
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Delete the session if candidate insertion failed
      await prisma.screeningSession.delete({ where: { id: session.id } }).catch(() => {});
      throw dbError;
    }

  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({
      error: "Internal Server Error",
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}
