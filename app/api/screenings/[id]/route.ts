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
          take: 100 // Limit for now
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
