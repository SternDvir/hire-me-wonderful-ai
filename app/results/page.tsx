"use client";

import { useState, useEffect } from "react";
import { CandidateModal } from "@/components/CandidateModal";
import { GradientOrbs } from "@/components/GradientOrbs";
import {
  Users,
  Globe,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  BarChart3
} from "lucide-react";

interface Country {
  id: string;
  name: string;
}

interface Candidate {
  id: string;
  fullName: string;
  linkedinUrl: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  decisionResult: string;
  overallScore: number;
  evaluatedAt: string;
  countryId?: string;
  finalDecision: any;
  session: {
    countryId?: string;
  };
}

export default function ResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchCountries();
    fetchCandidates();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        setCountries(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const url = selectedCountry === "all"
        ? "/api/candidates"
        : `/api/candidates?countryId=${selectedCountry}`;

      const res = await fetch(url);
      if (res.ok) {
        setCandidates(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    } finally {
      setLoading(false);
    }
  };

  const passedCount = candidates.filter(c => c.decisionResult === 'PASS').length;
  const passRate = candidates.length > 0 ? Math.round((passedCount / candidates.length) * 100) : 0;

  return (
    <div className="relative min-h-screen">
      <GradientOrbs variant="section" />

      <div className="container mx-auto p-8 relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-btn-primary rounded-wonderful-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent">All Results</h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">View and filter all candidate evaluations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Total Candidates</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{candidates.length}</div>
              </div>
              <Users className="w-10 h-10 text-wonderful-purple-600 dark:text-wonderful-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Passed</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{passedCount}</div>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Pass Rate</div>
                <div className="text-4xl font-bold bg-text-accent bg-clip-text text-transparent">{passRate}%</div>
              </div>
              <BarChart3 className="w-10 h-10 text-wonderful-blue-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-wonderful-purple-600" />
              <span className="font-semibold text-gray-900 dark:text-white">Filter by Country</span>
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-4 py-2.5 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-wonderful-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading candidates...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-md border border-white/20 dark:border-gray-800/50 hover:shadow-wonderful-lg hover:shadow-glow-light dark:hover:shadow-glow-dark transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{candidate.fullName}</h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {candidate.currentTitle} at {candidate.currentCompany}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(candidate.evaluatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase mb-1">Score</div>
                    <div className="text-2xl font-bold bg-text-accent bg-clip-text text-transparent">{candidate.overallScore}</div>
                  </div>
                  <div className={`px-5 py-2.5 rounded-wonderful-lg font-bold text-sm flex items-center space-x-2 ${
                    candidate.decisionResult === 'PASS'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}>
                    {candidate.decisionResult === 'PASS' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>{candidate.decisionResult}</span>
                  </div>
                </div>
              </div>
            ))}

            {candidates.length === 0 && (
              <div className="text-center py-16 bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl border border-white/20 dark:border-gray-800/50">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">No candidates found for the selected criteria.</p>
              </div>
            )}
          </div>
        )}

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </div>
    </div>
  );
}
