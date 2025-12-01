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

    const where: any = {};

    // Filter by session ID if provided
    if (sessionId) {
      where.screeningSessionId = sessionId;
    }

    // Filter by country if provided
    if (countryId) {
      where.session = {
        countryId: countryId
      };
    }

    // Filter by decision result
    if (decision && decision !== "ALL") {
      where.decisionResult = decision;
    }

    // Filter by date range if provided
    if (dateFrom || dateTo) {
      where.evaluatedAt = {};
      if (dateFrom) {
        where.evaluatedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        where.evaluatedAt.lt = endDate;
      }
    }

    const candidates = await prisma.candidateEvaluation.findMany({
      where,
      include: {
        session: {
          select: {
            id: true,
            countryId: true,
            country: true,
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
