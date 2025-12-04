import { prisma } from "@/lib/prisma";
import { checkLanguages } from "@/lib/ai/agents/language-checker";
import { enrichCompany } from "@/lib/enrichment/tavily";
import { evaluateCandidate } from "@/lib/ai/agents/final-decision";
import { performSecondaryEvaluation } from "@/lib/ai/agents/secondary-evaluation";
import { LinkedInProfile } from "@/lib/schemas/linkedin";

export async function processCandidate(
  candidateId: string, 
  sessionId: string
) {
  try {
    // 1. Fetch candidate data
    const candidateRecord = await prisma.candidateEvaluation.findUnique({
      where: { id: candidateId }
    });

    if (!candidateRecord) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    const profile = candidateRecord.profileData as unknown as LinkedInProfile;
    const startTime = Date.now();

    // 2. Language Check
    // We need to know the target country. 
    // Ideally this comes from the session config, but we'll use the candidate's country for now 
    // or fetch the session config.
    const session = await prisma.screeningSession.findUnique({
      where: { id: sessionId }
    });
    
    // Default to candidate's country if not specified in config
    // The config schema has targetCountry optional.
    const targetCountry = (session?.config as any)?.targetCountry || profile.addressCountryOnly;
    
    const languageCheck = checkLanguages(profile, targetCountry);

    // IMPORTANT: Do NOT auto-reject based on language check alone.
    // According to the edge cases documentation, we should:
    // 1. Infer languages when possible
    // 2. Add notes about inference
    // 3. Reduce confidence
    // 4. Let the final AI evaluation consider language as part of overall assessment

    let enrichedCompanies: any[] = [];
    let finalDecision: any = null;
    let decisionResult = "PENDING";
    let overallScore = 0;

    // Always run the full evaluation
    // 3. Company Enrichment
    // Extract unique companies from experience
    const companiesToEnrich = Array.from(new Set(
      (profile.experiences || [])
        .filter((exp): exp is typeof exp & { companyName: string } => !!exp.companyName)
        .map(exp => exp.companyName)
        .slice(0, 3) // Limit to top 3 recent companies to save cost/time
    ));

    enrichedCompanies = await Promise.all(
      companiesToEnrich.map(name => enrichCompany(name))
    );

    // 4. AI Evaluation
    // The AI will consider the language check results and confidence
    // If language info is inferred or uncertain, it will be noted in the concerns
    finalDecision = await evaluateCandidate(profile, enrichedCompanies, languageCheck);
    decisionResult = finalDecision.decision;
    overallScore = finalDecision.overallScore;

    // 5. Secondary Evaluation for REVIEW cases
    // If the initial decision is REVIEW, perform deeper analysis
    let secondaryEvaluation = null;
    if (decisionResult === "REVIEW") {
      console.log(`[${candidateId}] Initial decision: REVIEW (score: ${overallScore}). Running secondary evaluation...`);

      secondaryEvaluation = await performSecondaryEvaluation(
        profile,
        enrichedCompanies,
        languageCheck,
        finalDecision
      );

      // Update decision based on secondary evaluation
      decisionResult = secondaryEvaluation.finalDecision;
      overallScore = secondaryEvaluation.updatedScore;

      // Merge secondary evaluation findings into final decision
      finalDecision = {
        ...finalDecision,
        decision: secondaryEvaluation.finalDecision,
        overallScore: secondaryEvaluation.updatedScore,
        confidence: secondaryEvaluation.confidence,
        reasoning: `[Secondary Eval] ${secondaryEvaluation.reasoning}`,
        concerns: [...finalDecision.concerns, ...secondaryEvaluation.keyFindings.filter(f => !f.includes("positive"))],
        strengths: [...finalDecision.strengths, ...secondaryEvaluation.keyFindings.filter(f => f.includes("positive") || f.includes("strong"))],
        redFlags: [
          ...(finalDecision.redFlags || []),
          secondaryEvaluation.builderDNAEvidence.includes("manager") ? "Manager mentality detected in secondary eval" : null,
          secondaryEvaluation.innovationCurrencyAssessment.includes("outdated") ? "Skills not current" : null,
        ].filter(Boolean) as string[],
        // Add shortRejectReason from secondary evaluation for REJECT decisions
        ...(secondaryEvaluation.finalDecision === "REJECT" && secondaryEvaluation.shortRejectReason && {
          shortRejectReason: secondaryEvaluation.shortRejectReason
        })
      };

      console.log(`[${candidateId}] Secondary evaluation result: ${decisionResult} (updated score: ${overallScore})`);
    }

    const processingTimeMs = Date.now() - startTime;

    // 6. Save Results
    await prisma.candidateEvaluation.update({
      where: { id: candidateId },
      data: {
        languageCheck: languageCheck as any,
        enrichedCompanies: enrichedCompanies as any,
        finalDecision: finalDecision as any,
        decisionResult,
        overallScore,
        processingTimeMs,
        evaluatedAt: new Date(),
        // Store secondary evaluation if it was performed
        ...(secondaryEvaluation && {
          secondaryEvaluation: secondaryEvaluation as any
        })
      }
    });

    // Update session stats
    if (decisionResult === "PASS") {
      await prisma.screeningSession.update({
        where: { id: sessionId },
        data: {
          candidatesProcessed: { increment: 1 },
          passedCandidates: { increment: 1 }
        }
      });
    } else {
      await prisma.screeningSession.update({
        where: { id: sessionId },
        data: {
          candidatesProcessed: { increment: 1 },
          rejectedCandidates: { increment: 1 }
        }
      });
    }

    return { success: true, decision: decisionResult };

  } catch (error: unknown) {
    console.error(`!!! ERROR PROCESSING CANDIDATE ${candidateId} !!!`);
    console.error(error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    try {
      console.error("Stringified:", JSON.stringify(error, null, 2));
    } catch (e) {
      console.error("Could not stringify error");
    }
    
    // Log error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    await prisma.sessionError.create({
      data: {
        screeningSessionId: sessionId,
        candidateId,
        errorMessage,
        errorStack
      }
    });

    await prisma.screeningSession.update({
      where: { id: sessionId },
      data: {
        candidatesProcessed: { increment: 1 },
        erroredCandidates: { increment: 1 }
      }
    });

    return { success: false, error: errorMessage };
  }
}
