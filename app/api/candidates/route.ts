import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countryId = searchParams.get("countryId");
    const sessionId = searchParams.get("sessionId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const decision = searchParams.get("decision"); // PASS, REJECT, PENDING

    const where: Record<string, unknown> = {};

    // Filter by session ID if provided
    if (sessionId) {
      where.screeningSessionId = sessionId;
    }

    // Filter by country if provided (now on candidate directly)
    if (countryId) {
      where.countryId = countryId;
    }

    // Filter by decision result
    if (decision && decision !== "ALL") {
      where.decisionResult = decision;
    }

    // Filter by date range if provided
    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        dateFilter.lt = endDate;
      }
      where.evaluatedAt = dateFilter;
    }

    const candidates = await prisma.candidateEvaluation.findMany({
      where,
      include: {
        country: true,
        session: {
          select: {
            id: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        evaluatedAt: "desc"
      }
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("id");

    if (!candidateId) {
      return NextResponse.json(
        { error: "Candidate ID is required" },
        { status: 400 }
      );
    }

    // Delete the candidate
    await prisma.candidateEvaluation.delete({
      where: {
        id: candidateId
      }
    });

    return NextResponse.json({
      success: true,
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete candidate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
