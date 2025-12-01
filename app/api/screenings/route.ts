import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessions = await prisma.screeningSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
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
