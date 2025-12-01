"use client";

import { X } from "lucide-react";

interface CandidateModalProps {
  candidate: any;
  onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  if (!candidate) return null;

  const { finalDecision, profileData } = candidate;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">{candidate.fullName}</h2>
            <p className="text-gray-500">{candidate.currentTitle} at {candidate.currentCompany}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Decision Banner */}
          <div className={`p-6 rounded-xl border-2 ${
            candidate.decisionResult === 'PASS' 
              ? 'bg-green-50 border-green-100' 
              : 'bg-red-50 border-red-100'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                  candidate.decisionResult === 'PASS' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Final Decision
                </div>
                <div className={`text-4xl font-bold mb-2 ${
                  candidate.decisionResult === 'PASS' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {candidate.decisionResult}
                </div>
                <p className="text-gray-700 max-w-2xl text-lg">
                  {finalDecision.reasoning}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Overall Score</div>
                <div className="text-5xl font-bold text-gray-900">{candidate.overallScore}</div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Strengths</h3>
              <ul className="space-y-2">
                {finalDecision.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Concerns</h3>
              <ul className="space-y-2">
                {finalDecision.concerns.map((concern: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">!</span>
                    <span className="text-gray-700">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-lg font-bold mb-4">Detailed Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(finalDecision.detailedAnalysis).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{value as number}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <a 
              href={candidate.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              View LinkedIn Profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
