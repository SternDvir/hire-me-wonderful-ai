"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandidateModal } from "@/components/CandidateModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default'
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'danger' | 'info';
}) {
  const iconColors = {
    default: 'text-text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    info: 'text-accent',
  };

  const valueColors = {
    default: 'text-text-primary',
    success: 'text-success',
    danger: 'text-danger',
    info: 'text-accent',
  };

  return (
    <div className="bg-background-secondary border border-border rounded-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-small text-text-secondary uppercase tracking-wide mb-1">{label}</div>
          <div className={`text-h1 font-semibold ${valueColors[variant]}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        <Icon className={`w-8 h-8 ${iconColors[variant]} opacity-50`} />
      </div>
    </div>
  );
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [session, setSession] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterDecision, setFilterDecision] = useState<string>("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filteredEvaluations, setFilteredEvaluations] = useState<any[]>([]);

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

  useEffect(() => {
    if (!session?.evaluations) {
      setFilteredEvaluations([]);
      return;
    }

    let filtered = [...session.evaluations];

    if (filterDecision !== "ALL") {
      filtered = filtered.filter((e: any) => e.decisionResult === filterDecision);
    }

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
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const res = await fetch(`/api/candidates?id=${candidateId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete candidate");
      await fetchSession();
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-danger-muted border border-danger-border text-red-400 px-4 py-3 rounded-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent mx-auto mb-3"></div>
          <p className="text-body text-text-secondary">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="mb-4 text-text-secondary hover:text-text-primary flex items-center gap-2 text-body transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-display text-text-primary">Screening Session</h1>
            <p className="text-body text-text-secondary mt-1">
              Created {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/api/screenings/${id}/export`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 bg-transparent border border-border hover:bg-background-tertiary text-text-primary text-body font-medium rounded flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </a>
            <Badge variant={session.status === 'completed' ? 'pass' : session.status === 'processing' ? 'info' : 'pending'}>
              {session.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={session.totalCandidates} icon={Users} />
        <StatCard label="Processed" value={session.candidatesProcessed} icon={Clock} variant="info" />
        <StatCard label="Passed" value={session.passedCandidates} icon={CheckCircle2} variant="success" />
        <StatCard label="Rejected" value={session.rejectedCandidates} icon={XCircle} variant="danger" />
      </div>

      {/* Action Button */}
      {(session.status === "pending" || (session.status === "processing" && !processing)) && (
        <div className="mb-6">
          <Button onClick={startProcessing} disabled={processing}>
            <Play className="w-4 h-4 mr-2" />
            {processing ? "Processing..." : session.status === "pending" ? "Start Screening" : "Resume Processing"}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-background-secondary border border-border rounded-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-text-secondary" />
          <h2 className="text-h3 text-text-primary">Filter Results</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-small text-text-secondary mb-2">Decision</label>
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-border rounded text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            >
              <option value="ALL">All</option>
              <option value="PASS">Pass</option>
              <option value="REJECT">Reject</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Date From
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-border rounded text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Date To
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-border rounded text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
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
              className="text-small text-accent hover:text-accent-hover font-medium transition-colors"
            >
              Clear Filters
            </button>
            <span className="text-small text-text-secondary">
              Showing {filteredEvaluations.length} of {session.evaluations?.length || 0} candidates
            </span>
          </div>
        )}
      </div>

      {/* Candidates Table */}
      <div className="bg-background-secondary border border-border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-background-tertiary border-b border-border">
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Candidate</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide hidden md:table-cell">Role</th>
              <th className="px-4 py-3 text-center text-small font-medium text-text-secondary uppercase tracking-wide">Result</th>
              <th className="px-4 py-3 text-center text-small font-medium text-text-secondary uppercase tracking-wide">Score</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide hidden lg:table-cell">Reasoning</th>
              <th className="px-4 py-3 text-center text-small font-medium text-text-secondary uppercase tracking-wide w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((evaluation: any) => (
              <tr
                key={evaluation.id}
                onClick={() => setSelectedCandidate(evaluation)}
                className="border-b border-border hover:bg-background-tertiary cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-body text-text-primary font-medium">{evaluation.fullName}</div>
                  <div className="text-small text-text-secondary">{evaluation.location}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-body text-text-primary">{evaluation.currentTitle}</div>
                  <div className="text-small text-text-secondary">{evaluation.currentCompany}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={
                      evaluation.decisionResult === 'PASS' ? 'pass' :
                      evaluation.decisionResult === 'REJECT' ? 'reject' :
                      'pending'
                    }
                  >
                    {evaluation.decisionResult}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-body font-mono font-medium text-text-primary">
                    {evaluation.overallScore || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-small text-text-secondary line-clamp-2">
                    {evaluation.finalDecision?.reasoning || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCandidate(evaluation.id);
                    }}
                    className="p-1.5 text-text-tertiary hover:text-danger hover:bg-danger-muted rounded transition-colors"
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
            <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-body text-text-secondary">No candidates found</p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
