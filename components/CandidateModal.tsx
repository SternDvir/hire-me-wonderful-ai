"use client";

import { X, CheckCircle2, XCircle, ExternalLink, Award } from "lucide-react";

interface CandidateModalProps {
  candidate: any;
  onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  if (!candidate) return null;

  const { finalDecision } = candidate;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card-light dark:bg-card-dark backdrop-blur-md rounded-wonderful-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-wonderful-xl border border-white/20 dark:border-gray-800/50">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold bg-text-primary bg-clip-text text-transparent">{candidate.fullName}</h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">{candidate.currentTitle} at {candidate.currentCompany}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-wonderful-lg transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Decision Banner */}
          <div className={`p-6 rounded-wonderful-xl border-2 ${
            candidate.decisionResult === 'PASS'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center space-x-2 ${
                  candidate.decisionResult === 'PASS' ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                }`}>
                  {candidate.decisionResult === 'PASS' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Final Decision</span>
                </div>
                <div className={`text-4xl font-bold mb-3 ${
                  candidate.decisionResult === 'PASS'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent'
                }`}>
                  {candidate.decisionResult}
                </div>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-lg leading-relaxed">
                  {finalDecision?.reasoning}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Overall Score</div>
                <div className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent">{candidate.overallScore}</div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-wonderful-xl border border-green-100 dark:border-green-900/30">
              <h3 className="text-lg font-bold mb-4 text-green-800 dark:text-green-400 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Strengths</span>
              </h3>
              <ul className="space-y-3">
                {finalDecision?.strengths?.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 font-bold">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-wonderful-xl border border-red-100 dark:border-red-900/30">
              <h3 className="text-lg font-bold mb-4 text-red-800 dark:text-red-400 flex items-center space-x-2">
                <XCircle className="w-5 h-5" />
                <span>Concerns</span>
              </h3>
              <ul className="space-y-3">
                {finalDecision?.concerns?.map((concern: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5 font-bold">!</span>
                    <span className="text-gray-700 dark:text-gray-300">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-wonderful-purple-600" />
              <span>Detailed Scores</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {finalDecision?.detailedAnalysis && Object.entries(finalDecision.detailedAnalysis).map(([key, value]) => (
                <div key={key} className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-4 rounded-wonderful-lg text-center border border-white/20 dark:border-gray-800/50 shadow-wonderful-sm">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-semibold">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold bg-text-accent bg-clip-text text-transparent">{value as number}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end">
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-btn-primary hover:bg-btn-primary-hover text-white px-6 py-3 rounded-wonderful-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>View LinkedIn Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
