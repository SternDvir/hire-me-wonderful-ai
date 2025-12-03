import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processCandidate } from "@/lib/workflows/screening";

// This endpoint triggers the screening for a session
// Since we can't process 100 candidates in one request (timeout),
// we will process a batch (e.g., 5) and return.
// The client (UI) will need to call this recursively until finished.
// Alternatively, we could use Vercel Functions with maxDuration, but 100 * 10s = 1000s which is too long even for maxDuration (usually 60s or 300s).

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
    // Check if session exists
    const session = await prisma.screeningSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update status to processing if not already
    if (session.status === "pending") {
      await prisma.screeningSession.update({
        where: { id: sessionId },
        data: { status: "processing", startedAt: new Date() }
      });
    }

    // Fetch next batch of pending candidates
    const pendingCandidates = await prisma.candidateEvaluation.findMany({
      where: {
        screeningSessionId: sessionId,
        decisionResult: "PENDING"
      },
      take: 2 // Process 2 at a time to stay within timeout and DB connection limits
    });

    if (pendingCandidates.length === 0) {
      // Check if all are done
      const remaining = await prisma.candidateEvaluation.count({
        where: {
          screeningSessionId: sessionId,
          decisionResult: "PENDING"
        }
      });
      
      if (remaining === 0) {
        // Mark session as completed
        await prisma.screeningSession.update({
          where: { id: sessionId },
          data: { status: "completed", completedAt: new Date() }
        });
        return NextResponse.json({ status: "completed", processed: 0, remaining: 0 });
      }
      
      return NextResponse.json({ status: "processing", processed: 0, remaining });
    }

    // Process batch sequentially to avoid exhausting DB connection pool
    const results = [];
    for (const candidate of pendingCandidates) {
      const result = await processCandidate(candidate.id, sessionId);
      results.push(result);
    }

    const remaining = await prisma.candidateEvaluation.count({
      where: {
        screeningSessionId: sessionId,
        decisionResult: "PENDING"
      }
    });

    return NextResponse.json({
      status: "processing",
      processed: results.length,
      remaining,
      results
    });

  } catch (error) {
    console.error("Error starting screening:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
