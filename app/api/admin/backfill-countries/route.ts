import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractCountryFromProfile } from "@/lib/utils/country-detection";

/**
 * POST /api/admin/backfill-countries
 *
 * Backfills country data for all candidates that don't have a country assigned.
 * Also cleans up orphan countries (countries with no candidates).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get all candidates without a country
    const candidatesWithoutCountry = await prisma.candidateEvaluation.findMany({
      where: { countryId: null },
      select: {
        id: true,
        profileData: true,
        location: true,
      },
    });

    console.log(`Found ${candidatesWithoutCountry.length} candidates without country`);

    // 2. Detect and assign countries
    let updated = 0;
    let skipped = 0;
    const countryMap = new Map<string, string>();

    for (const candidate of candidatesWithoutCountry) {
      const profile = candidate.profileData as any;

      const countryName = extractCountryFromProfile({
        addressCountryOnly: profile?.addressCountryOnly,
        addressWithCountry: profile?.addressWithCountry,
        location: candidate.location || profile?.addressCountryOnly,
        jobLocation: profile?.jobLocation,
      });

      if (!countryName) {
        skipped++;
        continue;
      }

      // Get or create country
      let countryId = countryMap.get(countryName);
      if (!countryId) {
        const country = await prisma.country.upsert({
          where: { name: countryName },
          create: { name: countryName },
          update: {},
        });
        countryId = country.id;
        countryMap.set(countryName, countryId);
      }

      // Update candidate
      await prisma.candidateEvaluation.update({
        where: { id: candidate.id },
        data: { countryId },
      });

      updated++;
    }

    // 3. Clean up orphan countries (countries with no candidates)
    const orphanCountries = await prisma.country.findMany({
      where: {
        candidates: {
          none: {},
        },
      },
    });

    const deletedCountries = orphanCountries.map(c => c.name);

    if (orphanCountries.length > 0) {
      await prisma.country.deleteMany({
        where: {
          id: { in: orphanCountries.map(c => c.id) },
        },
      });
    }

    // 4. Get final country stats
    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { candidates: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      stats: {
        candidatesProcessed: candidatesWithoutCountry.length,
        candidatesUpdated: updated,
        candidatesSkipped: skipped,
        orphanCountriesDeleted: deletedCountries,
      },
      countries: countries.map(c => ({
        name: c.name,
        candidateCount: c._count.candidates,
      })),
    });

  } catch (error) {
    console.error("Backfill error:", error);
    return NextResponse.json(
      { error: "Backfill failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/backfill-countries
 *
 * Returns current country stats without making changes.
 */
export async function GET() {
  try {
    const candidatesWithoutCountry = await prisma.candidateEvaluation.count({
      where: { countryId: null },
    });

    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { candidates: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const orphanCountries = countries.filter(c => c._count.candidates === 0);

    return NextResponse.json({
      candidatesWithoutCountry,
      orphanCountries: orphanCountries.map(c => c.name),
      countries: countries.map(c => ({
        id: c.id,
        name: c.name,
        candidateCount: c._count.candidates,
      })),
    });
  } catch (error) {
    console.error("Error fetching country stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
