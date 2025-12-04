import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/countries/[id]
 *
 * Returns country details with paginated candidates.
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - decision: Filter by decision (PASS, REJECT, PENDING, or ALL)
 * - search: Search in name, title, company
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const decision = searchParams.get("decision") || "ALL";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Get country details
    const country = await prisma.country.findUnique({
      where: { id: params.id },
    });

    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    // Build where clause for candidates
    const whereClause: any = {
      countryId: params.id,
    };

    if (decision !== "ALL") {
      whereClause.decisionResult = decision;
    }

    if (search.trim()) {
      whereClause.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { currentTitle: { contains: search, mode: "insensitive" } },
        { currentCompany: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const totalCandidates = await prisma.candidateEvaluation.count({
      where: whereClause,
    });

    // Get paginated candidates
    const candidates = await prisma.candidateEvaluation.findMany({
      where: whereClause,
      orderBy: [
        { overallScore: "desc" },
        { evaluatedAt: "desc" },
      ],
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        currentTitle: true,
        currentCompany: true,
        location: true,
        linkedinUrl: true,
        decisionResult: true,
        overallScore: true,
        evaluatedAt: true,
        finalDecision: true,
        manualOverride: true,
      },
    });

    // Get stats for this country
    const stats = await prisma.candidateEvaluation.groupBy({
      by: ["decisionResult"],
      where: { countryId: params.id },
      _count: true,
    });

    const statsMap = stats.reduce((acc, s) => {
      acc[s.decisionResult || "UNKNOWN"] = s._count;
      return acc;
    }, {} as Record<string, number>);

    const totalCount = Object.values(statsMap).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      country: {
        id: country.id,
        name: country.name,
        createdAt: country.createdAt,
      },
      stats: {
        totalCandidates: totalCount,
        passedCandidates: statsMap["PASS"] || 0,
        rejectedCandidates: statsMap["REJECT"] || 0,
        pendingCandidates: statsMap["PENDING"] || 0,
        passRate: totalCount > 0
          ? Math.round(((statsMap["PASS"] || 0) / totalCount) * 100)
          : 0,
      },
      candidates,
      pagination: {
        page,
        limit,
        totalItems: totalCandidates,
        totalPages: Math.ceil(totalCandidates / limit),
        hasMore: skip + candidates.length < totalCandidates,
      },
    });
  } catch (error) {
    console.error("Failed to fetch country:", error);
    return NextResponse.json(
      { error: "Failed to fetch country" },
      { status: 500 }
    );
  }
}
