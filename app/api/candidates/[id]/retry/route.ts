import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processCandidate } from "@/lib/workflows/screening";
import { Prisma } from "@prisma/client";

// POST - Retry screening for a single candidate
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;

    // Get the candidate
    const candidate = await prisma.candidateEvaluation.findUnique({
      where: { id: candidateId },
      include: { session: true }
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Reset the candidate to PENDING state before retry
    await prisma.candidateEvaluation.update({
      where: { id: candidateId },
      data: {
        decisionResult: "PENDING",
        finalDecision: Prisma.JsonNull,
        secondaryEvaluation: Prisma.JsonNull,
        enrichedCompanies: Prisma.JsonNull,
        languageCheck: Prisma.JsonNull,
        overallScore: null,
        processingTimeMs: null,
        evaluatedAt: null
      }
    });

    // Update session stats - decrement the appropriate counter
    if (candidate.decisionResult === "PASS") {
      await prisma.screeningSession.update({
        where: { id: candidate.screeningSessionId },
        data: {
          candidatesProcessed: { decrement: 1 },
          passedCandidates: { decrement: 1 }
        }
      });
    } else if (candidate.decisionResult === "REJECT") {
      await prisma.screeningSession.update({
        where: { id: candidate.screeningSessionId },
        data: {
          candidatesProcessed: { decrement: 1 },
          rejectedCandidates: { decrement: 1 }
        }
      });
    }

    // Process the candidate
    const result = await processCandidate(candidateId, candidate.screeningSessionId);

    return NextResponse.json({
      success: result.success,
      candidateId,
      decision: result.decision,
      error: result.error
    });

  } catch (error) {
    console.error("Error retrying candidate:", error);
    return NextResponse.json(
      { error: "Failed to retry candidate screening" },
      { status: 500 }
    );
  }
}
