import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const session = await prisma.screeningSession.findUnique({
      where: { id },
      include: {
        evaluations: {
          orderBy: { overallScore: "desc" },
          include: {
            country: true, // Include country data for filtering
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get distinct countries from this session's candidates
    const countries = await prisma.country.findMany({
      where: {
        candidates: {
          some: {
            screeningSessionId: id,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Get distinct companies from this session's candidates
    const companies = await prisma.candidateEvaluation.findMany({
      where: { screeningSessionId: id },
      select: { currentCompany: true },
      distinct: ["currentCompany"],
    });

    const uniqueCompanies = companies
      .map((c) => c.currentCompany)
      .filter((c): c is string => !!c && c.trim() !== "")
      .sort();

    return NextResponse.json({
      ...session,
      filterOptions: {
        countries,
        companies: uniqueCompanies,
      },
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
