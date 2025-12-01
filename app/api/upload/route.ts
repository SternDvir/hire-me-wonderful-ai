import { NextRequest, NextResponse } from "next/server";
import { ApifyOutputSchema } from "@/lib/schemas/linkedin";
import { prisma } from "@/lib/prisma"; // We need to create this client instance
import { ScreeningSessionSchema } from "@/lib/schemas/session";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
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

    // 3. Store Candidates (Batch create)
    // We store the raw profile data in the CandidateEvaluation table
    // The evaluation fields will be populated later by the workflow
    
    // Prisma createMany doesn't support nested relations easily with JSON fields in the way we might want if we were doing complex things,
    // but here we are just dumping JSON.
    // However, we need to map the Apify profile to our DB schema.
    
    // 3. Store Candidates (Batch create)
    // We store the raw profile data in the CandidateEvaluation table
    // The evaluation fields will be populated later by the workflow
    
    // Insert candidates in batches to avoid transaction timeout
    try {
      const batchSize = 10; // Insert 10 at a time
      for (let i = 0; i < candidates.length; i += batchSize) {
        const batch = candidates.slice(i, i + batchSize);
        await prisma.$transaction(
          batch.map(profile =>
            prisma.candidateEvaluation.create({
              data: {
                screeningSessionId: session.id,
                candidateId: profile.linkedinUrl, // Use URL as ID
                linkedinUrl: profile.linkedinUrl,
                fullName: profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
                currentTitle: profile.jobTitle || "",
                currentCompany: profile.companyName || "",
                location: profile.addressCountryOnly || "", // Fixed property access
                profileData: profile as any, // Cast to any to satisfy Prisma Json type

                // Evaluation fields are now nullable/optional in schema
                // decisionResult is PENDING
                decisionResult: "PENDING",
                overallScore: 0,
                evaluationCost: 0,
                processingTimeMs: 0
              }
            })
          ),
          {
            timeout: 15000 // 15 seconds timeout per batch
          }
        );
      }

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        count: candidates.length
      });
    } catch (dbError) {
      console.error("Database transaction error:", dbError);
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
