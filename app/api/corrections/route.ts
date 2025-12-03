import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// POST - Save a manual override / correction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, newDecision, reason, overriddenBy } = body;

    if (!candidateId || !newDecision || !reason) {
      return NextResponse.json(
        { error: "candidateId, newDecision, and reason are required" },
        { status: 400 }
      );
    }

    if (!["PASS", "REJECT"].includes(newDecision)) {
      return NextResponse.json(
        { error: "newDecision must be PASS or REJECT" },
        { status: 400 }
      );
    }

    // Get the candidate evaluation
    const candidate = await prisma.candidateEvaluation.findUnique({
      where: { id: candidateId },
      include: { session: true }
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const originalDecision = candidate.decisionResult;

    // Create the manual override object
    const manualOverride = {
      overridden: true,
      originalDecision,
      newDecision,
      overrideReason: reason,
      overriddenBy: overriddenBy || "admin",
      overriddenAt: new Date().toISOString(),
      // Store snapshot of candidate data for learning
      candidateSnapshot: {
        fullName: candidate.fullName,
        currentTitle: candidate.currentTitle,
        currentCompany: candidate.currentCompany,
        location: candidate.location,
        linkedinUrl: candidate.linkedinUrl,
        overallScore: candidate.overallScore,
        finalDecision: candidate.finalDecision,
        secondaryEvaluation: candidate.secondaryEvaluation,
        profileData: candidate.profileData
      }
    };

    // Update the candidate with the override
    await prisma.candidateEvaluation.update({
      where: { id: candidateId },
      data: {
        decisionResult: newDecision,
        manualOverride: manualOverride as Prisma.InputJsonValue
      }
    });

    // Update session stats
    // If original was PASS and new is REJECT, decrement passed, increment rejected
    // If original was REJECT and new is PASS, decrement rejected, increment passed
    if (originalDecision === "PASS" && newDecision === "REJECT") {
      await prisma.screeningSession.update({
        where: { id: candidate.screeningSessionId },
        data: {
          passedCandidates: { decrement: 1 },
          rejectedCandidates: { increment: 1 }
        }
      });
    } else if (originalDecision === "REJECT" && newDecision === "PASS") {
      await prisma.screeningSession.update({
        where: { id: candidate.screeningSessionId },
        data: {
          passedCandidates: { increment: 1 },
          rejectedCandidates: { decrement: 1 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      candidateId,
      originalDecision,
      newDecision,
      reason
    });

  } catch (error) {
    console.error("Error saving correction:", error);
    return NextResponse.json(
      { error: "Failed to save correction" },
      { status: 500 }
    );
  }
}

// GET - Retrieve all corrections for learning/export
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const decision = searchParams.get("decision"); // PASS or REJECT (the new decision)
    const format = searchParams.get("format") || "json"; // json or summary

    // Build the where clause
    const where: Record<string, unknown> = {
      manualOverride: {
        not: null
      }
    };

    if (name) {
      where.fullName = {
        contains: name,
        mode: "insensitive"
      };
    }

    // Get all candidates with manual overrides
    const corrections = await prisma.candidateEvaluation.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        currentTitle: true,
        currentCompany: true,
        location: true,
        linkedinUrl: true,
        overallScore: true,
        decisionResult: true,
        manualOverride: true,
        finalDecision: true,
        secondaryEvaluation: true,
        profileData: true,
        evaluatedAt: true,
        session: {
          select: {
            id: true,
            createdAt: true,
            config: true
          }
        }
      },
      orderBy: {
        evaluatedAt: "desc"
      }
    });

    // Filter by date if provided
    let filtered = corrections;
    if (dateFrom || dateTo) {
      filtered = corrections.filter(c => {
        const override = c.manualOverride as { overriddenAt?: string } | null;
        if (!override?.overriddenAt) return false;
        const overrideDate = new Date(override.overriddenAt);
        if (dateFrom && overrideDate < new Date(dateFrom)) return false;
        if (dateTo && overrideDate > new Date(dateTo)) return false;
        return true;
      });
    }

    // Filter by new decision if provided
    if (decision) {
      filtered = filtered.filter(c => {
        const override = c.manualOverride as { newDecision?: string } | null;
        return override?.newDecision === decision;
      });
    }

    if (format === "summary") {
      // Return a summary format for quick analysis
      const summary = filtered.map(c => {
        const override = c.manualOverride as {
          originalDecision?: string;
          newDecision?: string;
          overrideReason?: string;
          overriddenAt?: string;
        } | null;
        return {
          name: c.fullName,
          title: c.currentTitle,
          company: c.currentCompany,
          originalDecision: override?.originalDecision,
          newDecision: override?.newDecision,
          reason: override?.overrideReason,
          overriddenAt: override?.overriddenAt,
          originalScore: c.overallScore
        };
      });
      return NextResponse.json({ corrections: summary, total: summary.length });
    }

    // Return full data for export/learning
    return NextResponse.json({
      corrections: filtered,
      total: filtered.length
    });

  } catch (error) {
    console.error("Error fetching corrections:", error);
    return NextResponse.json(
      { error: "Failed to fetch corrections" },
      { status: 500 }
    );
  }
}
