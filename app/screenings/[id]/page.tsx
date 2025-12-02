"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandidateModal } from "@/components/CandidateModal";
import { GradientOrbs } from "@/components/GradientOrbs";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  Download,
  Play,
  Trash2,
  AlertCircle
} from "lucide-react";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [session, setSession] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterDecision, setFilterDecision] = useState<string>("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filteredEvaluations, setFilteredEvaluations] = useState<any[]>([]);

  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/screenings/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Session not found");
        throw new Error("Failed to fetch session");
      }
      const data = await res.json();
      setSession(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [id]);

  // Apply filters to evaluations
  useEffect(() => {
    if (!session?.evaluations) {
      setFilteredEvaluations([]);
      return;
    }

    let filtered = [...session.evaluations];

    // Filter by decision
    if (filterDecision !== "ALL") {
      filtered = filtered.filter((e: any) => e.decisionResult === filterDecision);
    }

    // Filter by date range
    if (filterDateFrom || filterDateTo) {
      filtered = filtered.filter((e: any) => {
        if (!e.evaluatedAt) return false;
        const evalDate = new Date(e.evaluatedAt);
        if (filterDateFrom && evalDate < new Date(filterDateFrom)) return false;
        if (filterDateTo) {
          const endDate = new Date(filterDateTo);
          endDate.setDate(endDate.getDate() + 1);
          if (evalDate >= endDate) return false;
        }
        return true;
      });
    }

    setFilteredEvaluations(filtered);
  }, [session, filterDecision, filterDateFrom, filterDateTo]);

  const deleteCandidate = async (candidateId: string) => {
    if (!confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/candidates?id=${candidateId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete candidate");
      }

      await fetchSession();
      alert("Candidate deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete candidate");
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  const startProcessing = async () => {
    setProcessing(true);

    const processBatch = async () => {
      try {
        const res = await fetch(`/api/screenings/${id}/start`, { method: "POST" });
        const data = await res.json();

        await fetchSession();

        if (data.status === "processing" && data.remaining > 0) {
          setTimeout(processBatch, 1000);
        } else {
          setProcessing(false);
        }
      } catch (error) {
        console.error("Processing error:", error);
        setProcessing(false);
        alert("Error starting processing");
      }
    };

    processBatch();
  };

  if (error) {
    return (
      <div className="relative min-h-screen">
        <GradientOrbs variant="minimal" />
        <div className="container mx-auto p-8 relative">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-wonderful-lg flex items-center space-x-3" role="alert">
            <AlertCircle className="w-5 h-5" />
            <div>
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-btn-primary hover:bg-btn-primary-hover text-white px-6 py-3 rounded-wonderful-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <GradientOrbs variant="minimal" />
        <div className="text-center relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-wonderful-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading session details...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent mb-2">Screening Session</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Created {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`/api/screenings/${id}/export`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card-light dark:bg-card-dark backdrop-blur-sm border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-wonderful-lg hover:shadow-wonderful-md transition-all duration-200 font-semibold flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </a>
              <span className={`px-4 py-2 rounded-wonderful-lg text-sm font-bold ${
                session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                session.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
              }`}>
                {session.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Total</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{session.totalCandidates}</div>
              </div>
              <Users className="w-10 h-10 text-wonderful-purple-600 dark:text-wonderful-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Processed</div>
                <div className="text-4xl font-bold bg-text-accent bg-clip-text text-transparent">{session.candidatesProcessed}</div>
              </div>
              <Clock className="w-10 h-10 text-wonderful-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Passed</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{session.passedCandidates}</div>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Rejected</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">{session.rejectedCandidates}</div>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(session.status === "pending" || (session.status === "processing" && !processing)) && (
          <div className="mb-8">
            <button
              onClick={startProcessing}
              disabled={processing}
              className="bg-btn-primary hover:bg-btn-primary-hover text-white px-8 py-3 rounded-wonderful-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>{processing ? "Processing..." : session.status === "pending" ? "Start Screening" : "Resume Processing"}</span>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-wonderful-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter Results</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="PENDING">Pending</option>
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

          {(filterDecision !== "ALL" || filterDateFrom || filterDateTo) && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setFilterDecision("ALL");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="text-sm text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 font-semibold transition-colors"
              >
                Clear Filters
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                Showing {filteredEvaluations.length} of {session.evaluations?.length || 0} candidates
              </span>
            </div>
          )}
        </div>

        {/* Candidates Table */}
        <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Result</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Reasoning</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredEvaluations.map((evaluation: any) => (
                <tr
                  key={evaluation.id}
                  onClick={() => setSelectedCandidate(evaluation)}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{evaluation.fullName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{evaluation.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{evaluation.currentTitle}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{evaluation.currentCompany}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex items-center space-x-1 text-xs leading-5 font-bold rounded-wonderful-md ${
                      evaluation.decisionResult === 'PASS' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      evaluation.decisionResult === 'REJECT' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                    }`}>
                      {evaluation.decisionResult === 'PASS' ? <CheckCircle2 className="w-3 h-3" /> : evaluation.decisionResult === 'REJECT' ? <XCircle className="w-3 h-3" /> : null}
                      <span>{evaluation.decisionResult}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold bg-text-accent bg-clip-text text-transparent">
                      {evaluation.overallScore || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {evaluation.finalDecision?.reasoning || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCandidate(evaluation.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-wonderful-md transition-all duration-200"
                      title="Delete candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvaluations.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">No candidates found.</p>
            </div>
          )}
        </div>

        {/* Candidate Detail Modal */}
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
