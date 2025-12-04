import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Record<string, unknown> = {};

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        dateFilter.lte = endDate;
      }
      where.createdAt = dateFilter;
    }

    const sessions = await prisma.screeningSession.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Delete session - candidates are deleted via cascade
    await prisma.screeningSession.delete({
      where: { id: sessionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Creation is primarily handled by /api/upload, but we can support empty session creation here
  try {
    const body = await req.json();
    const { config, createdBy } = body;

    const session = await prisma.screeningSession.create({
      data: {
        createdBy: createdBy || "user",
        config: config || {
          enableCompanyEnrichment: true,
          targetRole: "CTO",
          minimumYearsExperience: 7
        },
        status: "pending",
        totalCandidates: 0,
        candidatesProcessed: 0,
        passedCandidates: 0,
        rejectedCandidates: 0,
        erroredCandidates: 0
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
