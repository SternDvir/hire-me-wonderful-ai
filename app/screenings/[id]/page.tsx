"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { CandidateModal } from "@/components/CandidateModal";

export default function SessionPage() {
  const params = useParams();
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
          endDate.setDate(endDate.getDate() + 1); // Include the entire end date
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

      // Refresh the session data
      await fetchSession();
      alert("Candidate deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete candidate");
    }
  };

  useEffect(() => {
    fetchSession();
    // Poll every 5 seconds
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  const startProcessing = async () => {
    setProcessing(true);
    
    const processBatch = async () => {
      try {
        const res = await fetch(`/api/screenings/${id}/start`, { method: "POST" });
        const data = await res.json();
        
        await fetchSession(); // Refresh UI
        
        if (data.status === "processing" && data.remaining > 0) {
          // Continue processing next batch
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
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading session details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Screening Session</h1>
        <div className="space-x-4 flex items-center">
          <a
            href={`/api/screenings/${id}/export`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Export CSV
          </a>
          <span className={`px-3 py-1 rounded-full text-sm ${
            session.status === 'completed' ? 'bg-green-100 text-green-800' :
            session.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {session.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Total</div>
          <div className="text-2xl font-bold">{session.totalCandidates}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Processed</div>
          <div className="text-2xl font-bold">{session.candidatesProcessed}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Passed</div>
          <div className="text-2xl font-bold text-green-600">{session.passedCandidates}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{session.rejectedCandidates}</div>
        </div>
      </div>

      {session.status === "pending" && (
        <button
          onClick={startProcessing}
          disabled={processing}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {processing ? "Processing..." : "Start Screening"}
        </button>
      )}
      
      {session.status === "processing" && !processing && (
         <button
          onClick={startProcessing}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-8"
        >
          Resume Processing
        </button>
      )}

      {/* Filters */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision
            </label>
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
              <option value="PASS">Pass</option>
              <option value="REJECT">Reject</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {(filterDecision !== "ALL" || filterDateFrom || filterDateTo) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilterDecision("ALL");
                setFilterDateFrom("");
                setFilterDateTo("");
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
            <span className="ml-4 text-sm text-gray-600">
              Showing {filteredEvaluations.length} of {session.evaluations?.length || 0} candidates
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasoning</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvaluations.map((evaluation: any) => (
              <tr
                key={evaluation.id}
                onClick={() => setSelectedCandidate(evaluation)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{evaluation.fullName}</div>
                  <div className="text-sm text-gray-500">{evaluation.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{evaluation.currentTitle}</div>
                  <div className="text-sm text-gray-500">{evaluation.currentCompany}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    evaluation.decisionResult === 'PASS' ? 'bg-green-100 text-green-800' : 
                    evaluation.decisionResult === 'REJECT' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {evaluation.decisionResult}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {evaluation.overallScore || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {evaluation.finalDecision?.reasoning || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      deleteCandidate(evaluation.id);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                    title="Delete candidate"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
