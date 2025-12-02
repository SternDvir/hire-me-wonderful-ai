"use client";

import { X, CheckCircle2, XCircle, ExternalLink, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CandidateModalProps {
  candidate: any;
  onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  if (!candidate) return null;

  const { finalDecision } = candidate;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-5xl h-[calc(100vh-2rem)] max-h-[700px] flex flex-col shadow-elevated animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Compact */}
        <div className="shrink-0 bg-background-secondary border-b border-border px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-h2 text-text-primary">{candidate.fullName}</h2>
              <p className="text-small text-text-secondary">
                {candidate.currentTitle} at {candidate.currentCompany}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Score inline with header */}
            <div className="text-right">
              <div className="text-tiny text-text-tertiary uppercase tracking-wide flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3" />
                Score
              </div>
              <div className="text-h1 font-bold text-text-primary font-mono">
                {candidate.overallScore}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
            </button>
          </div>
        </div>

        {/* Main Content - Flex grow to fill space */}
        <div className="flex-1 p-5 flex flex-col gap-4 min-h-0">
          {/* Decision Banner - Compact, neutral colors */}
          <div className="shrink-0 bg-background-tertiary/50 border border-border p-4 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant={candidate.decisionResult === 'PASS' ? 'pass' : 'reject'}
                  className="text-body px-3 py-1.5"
                >
                  {candidate.decisionResult}
                </Badge>
              </div>
              <p className="text-body text-text-primary flex-1 leading-relaxed">
                {finalDecision?.reasoning}
              </p>
            </div>
          </div>

          {/* Strengths & Concerns - Side by side, neutral backgrounds, larger text */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
            <div className="bg-background-tertiary/30 border border-border p-5 rounded-xl flex flex-col min-h-0">
              <h3 className="shrink-0 text-body font-semibold mb-3 text-text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-text-secondary" />
                <span>Strengths</span>
              </h3>
              <ul className="flex-1 space-y-2.5 overflow-y-auto">
                {finalDecision?.strengths?.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent mt-0.5 text-body font-bold">+</span>
                    <span className="text-body text-text-primary leading-relaxed">{strength}</span>
                  </li>
                ))}
                {(!finalDecision?.strengths || finalDecision.strengths.length === 0) && (
                  <li className="text-body text-text-tertiary">No strengths recorded</li>
                )}
              </ul>
            </div>
            <div className="bg-background-tertiary/30 border border-border p-5 rounded-xl flex flex-col min-h-0">
              <h3 className="shrink-0 text-body font-semibold mb-3 text-text-primary flex items-center gap-2">
                <XCircle className="w-4 h-4 text-text-secondary" />
                <span>Concerns</span>
              </h3>
              <ul className="flex-1 space-y-2.5 overflow-y-auto">
                {finalDecision?.concerns?.map((concern: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-text-tertiary mt-0.5 text-body font-bold">−</span>
                    <span className="text-body text-text-primary leading-relaxed">{concern}</span>
                  </li>
                ))}
                {(!finalDecision?.concerns || finalDecision.concerns.length === 0) && (
                  <li className="text-body text-text-tertiary">No concerns recorded</li>
                )}
              </ul>
            </div>
          </div>

          {/* Scores - Compact row */}
          {finalDecision?.detailedAnalysis && Object.keys(finalDecision.detailedAnalysis).length > 0 && (
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-small font-medium text-text-secondary">Detailed Scores</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(finalDecision.detailedAnalysis).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-background-tertiary/50 border border-border px-3 py-2.5 rounded-lg text-center"
                  >
                    <div className="text-tiny text-text-tertiary uppercase tracking-wide mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-h3 font-bold text-accent font-mono">{value as number}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Compact */}
        <div className="shrink-0 px-5 py-3 border-t border-border flex justify-end">
          <a
            href={candidate.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm">
              View LinkedIn
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
