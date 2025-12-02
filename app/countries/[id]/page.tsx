"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GradientOrbs } from "@/components/GradientOrbs";
import { CandidateModal } from "@/components/CandidateModal";
import {
  ArrowLeft,
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Filter,
  Search,
  Briefcase,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Country {
  id: string;
  name: string;
}

interface Session {
  id: string;
  createdAt: string;
  status: string;
  totalCandidates: number;
  passedCandidates: number;
  rejectedCandidates: number;
}

interface Candidate {
  id: string;
  fullName: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  decisionResult: string;
  overallScore: number;
  evaluatedAt: string;
  linkedinUrl: string;
  finalDecision: {
    reasoning: string;
    strengths: string[];
    concerns: string[];
    detailedAnalysis: Record<string, number>;
  };
}

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Filter states
  const [filterDecision, setFilterDecision] = useState<string>("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 50;

  useEffect(() => {
    fetchCountryData();
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [candidates, filterDecision, filterDateFrom, filterDateTo, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDecision, filterDateFrom, filterDateTo, searchQuery]);

  const fetchCountryData = async () => {
    setLoading(true);
    try {
      // Fetch country details
      const countryRes = await fetch(`/api/countries/${id}`);
      if (countryRes.ok) {
        const countryData = await countryRes.json();
        setCountry(countryData);
      }

      // Fetch sessions for this country
      const sessionsRes = await fetch(`/api/screenings?countryId=${id}`);
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      // Fetch candidates for this country
      const candidatesRes = await fetch(`/api/candidates?countryId=${id}`);
      if (candidatesRes.ok) {
        const candidatesData = await candidatesRes.json();
        setCandidates(candidatesData);
      }
    } catch (error) {
      console.error("Failed to fetch country data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    // Filter by decision
    if (filterDecision !== "ALL") {
      filtered = filtered.filter((c) => c.decisionResult === filterDecision);
    }

    // Filter by date range
    if (filterDateFrom || filterDateTo) {
      filtered = filtered.filter((c) => {
        if (!c.evaluatedAt) return false;
        const evalDate = new Date(c.evaluatedAt);
        if (filterDateFrom && evalDate < new Date(filterDateFrom)) return false;
        if (filterDateTo) {
          const endDate = new Date(filterDateTo);
          endDate.setDate(endDate.getDate() + 1);
          if (evalDate >= endDate) return false;
        }
        return true;
      });
    }

    // Filter by search query (name or company)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.currentCompany.toLowerCase().includes(query) ||
          c.currentTitle.toLowerCase().includes(query)
      );
    }

    setFilteredCandidates(filtered);
  };

  const clearFilters = () => {
    setFilterDecision("ALL");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <GradientOrbs variant="minimal" />
        <div className="text-center relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-wonderful-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="relative min-h-screen">
        <GradientOrbs variant="minimal" />
        <div className="container mx-auto p-8 relative">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-wonderful-lg">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Country not found.</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-btn-primary hover:bg-btn-primary-hover text-white px-6 py-3 rounded-wonderful-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const passedCount = filteredCandidates.filter((c) => c.decisionResult === "PASS").length;
  const passRate = filteredCandidates.length > 0
    ? Math.round((passedCount / filteredCandidates.length) * 100)
    : 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      <GradientOrbs variant="section" />

      <div className="container mx-auto p-8 relative">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-btn-primary rounded-wonderful-xl flex items-center justify-center shadow-glow-light dark:shadow-glow-dark">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent">{country.name}</h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Screening analytics and candidate management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Total Sessions</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{sessions.length}</div>
              </div>
              <Briefcase className="w-10 h-10 text-wonderful-purple-600 dark:text-wonderful-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Total Candidates</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{filteredCandidates.length}</div>
              </div>
              <Users className="w-10 h-10 text-wonderful-purple-600 dark:text-wonderful-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Passed</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{passedCount}</div>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Pass Rate</div>
                <div className="text-4xl font-bold bg-text-accent bg-clip-text text-transparent">{passRate}%</div>
              </div>
              <TrendingUp className="w-10 h-10 text-wonderful-blue-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Screening Sessions</h2>
            <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
              <div className="grid gap-4 p-4">
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/screenings/${session.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-wonderful-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-5 h-5 text-wonderful-purple-600 dark:text-wonderful-purple-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {session.totalCandidates} candidates • {session.passedCandidates} passed • {session.rejectedCandidates} rejected
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      session.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-wonderful-purple-600 dark:text-wonderful-purple-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter Candidates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-wide">
                <div className="flex items-center space-x-1">
                  <Search className="w-3 h-3" />
                  <span>Search</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="Name, company, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-wide">
                Decision
              </label>
              <select
                value={filterDecision}
                onChange={(e) => setFilterDecision(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
              >
                <option value="ALL">All</option>
                <option value="PASS">Pass</option>
                <option value="REJECT">Reject</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-wide flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Date From</span>
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-wide flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Date To</span>
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          {(filterDecision !== "ALL" || filterDateFrom || filterDateTo || searchQuery) && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 dark:hover:text-wonderful-purple-300 font-semibold transition-colors"
              >
                Clear Filters
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </span>
            </div>
          )}
        </div>

        {/* Candidates List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Candidates</h2>

          {/* Top Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid gap-3">
            {paginatedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-4 rounded-wonderful-lg shadow-wonderful-md dark:shadow-wonderful-lg border border-white/20 dark:border-gray-800/50 hover:shadow-glow-light dark:hover:shadow-glow-dark transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{candidate.fullName}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {candidate.currentTitle} at {candidate.currentCompany}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(candidate.evaluatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase">Score</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{candidate.overallScore}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-wonderful-md font-bold text-sm flex items-center space-x-1.5 ${
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

            {paginatedCandidates.length === 0 && filteredCandidates.length > 0 && (
              <div className="text-center py-16 bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl border border-white/20 dark:border-gray-800/50">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">No candidates on this page.</p>
              </div>
            )}

            {filteredCandidates.length === 0 && (
              <div className="text-center py-16 bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl border border-white/20 dark:border-gray-800/50">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                  {candidates.length === 0
                    ? "No candidates found for this country yet."
                    : "No candidates match your filters."}
                </p>
                {candidates.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 dark:hover:text-wonderful-purple-300 font-semibold"
                  >
                    Clear filters to see all candidates
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} - {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
              </div>
            </div>
          )}
        </div>

        {/* Candidate Modal */}
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
