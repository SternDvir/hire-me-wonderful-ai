import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.screeningSession.findUnique({
      where: { id: params.id },
      include: {
        evaluations: {
          orderBy: { overallScore: "desc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const headers = [
      "Candidate Name",
      "LinkedIn URL",
      "Current Title",
      "Current Company",
      "Location",
      "Decision",
      "Score",
      "Reasoning",
      "English",
      "Native Language",
      "Technical Depth",
      "Leadership",
      "Cultural Fit",
      "Customer Facing",
      "Hands On",
      "Recommendation"
    ];

    const rows = session.evaluations.map((ev: any) => {
      const decision = ev.finalDecision || {};
      const analysis = decision.detailedAnalysis || {};
      const lang = ev.languageCheck || {};

      return [
        ev.fullName,
        ev.linkedinUrl,
        ev.currentTitle,
        ev.currentCompany,
        ev.location,
        ev.decisionResult,
        ev.overallScore,
        decision.reasoning?.replace(/,/g, ";"), // Escape commas
        lang.english,
        lang.native,
        analysis.technicalDepth,
        analysis.leadershipCapability,
        analysis.culturalFit,
        analysis.customerFacing,
        analysis.handsOnCurrent,
        decision.interviewRecommendation
      ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="screening-results-${session.id}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
