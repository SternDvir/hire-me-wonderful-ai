import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/countries
 *
 * Returns all countries with candidate statistics.
 * Countries are auto-created when candidates are screened, so no manual creation needed.
 */
export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { candidates: true },
        },
        candidates: {
          select: {
            decisionResult: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Calculate stats for each country
    const countriesWithStats = countries.map(country => {
      const totalCandidates = country._count.candidates;
      const passedCandidates = country.candidates.filter(c => c.decisionResult === "PASS").length;
      const rejectedCandidates = country.candidates.filter(c => c.decisionResult === "REJECT").length;
      const pendingCandidates = country.candidates.filter(c => c.decisionResult === "PENDING").length;

      return {
        id: country.id,
        name: country.name,
        createdAt: country.createdAt,
        stats: {
          totalCandidates,
          passedCandidates,
          rejectedCandidates,
          pendingCandidates,
          passRate: totalCandidates > 0 ? Math.round((passedCandidates / totalCandidates) * 100) : 0,
        },
      };
    });

    // Filter out countries with no candidates
    const activeCountries = countriesWithStats.filter(c => c.stats.totalCandidates > 0);

    return NextResponse.json(activeCountries);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Note: POST and DELETE removed - countries are now auto-managed
// They are created automatically when candidates are detected from new countries
// They are cleaned up via the backfill endpoint when they have no candidates
