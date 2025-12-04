"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandidateModal } from "@/components/CandidateModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";

interface CountryStats {
  totalCandidates: number;
  passedCandidates: number;
  rejectedCandidates: number;
  pendingCandidates: number;
  passRate: number;
}

interface Country {
  id: string;
  name: string;
  createdAt: string;
}

interface Candidate {
  id: string;
  fullName: string;
  currentTitle: string | null;
  currentCompany: string | null;
  location: string | null;
  linkedinUrl: string;
  decisionResult: string | null;
  overallScore: number | null;
  evaluatedAt: string | null;
  finalDecision: any;
  manualOverride: any;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default'
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'danger' | 'accent';
}) {
  const iconColors = {
    default: 'text-text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    accent: 'text-accent',
  };

  const valueColors = {
    default: 'text-text-primary',
    success: 'text-success',
    danger: 'text-danger',
    accent: 'text-accent',
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

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [stats, setStats] = useState<CountryStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Filter states
  const [filterDecision, setFilterDecision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCountryData = useCallback(async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (filterDecision !== "ALL") {
        params.set("decision", filterDecision);
      }

      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }

      const res = await fetch(`/api/countries/${id}?${params}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Country not found");
        }
        throw new Error("Failed to fetch country data");
      }

      const data = await res.json();

      setCountry(data.country);
      setStats(data.stats);
      setPagination(data.pagination);

      if (append) {
        setCandidates(prev => [...prev, ...data.candidates]);
      } else {
        setCandidates(data.candidates);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch country data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [id, filterDecision, debouncedSearch]);

  // Initial load and filter changes
  useEffect(() => {
    fetchCountryData(1, false);
  }, [fetchCountryData]);

  const loadMore = () => {
    if (pagination && pagination.hasMore && !loadingMore) {
      fetchCountryData(pagination.page + 1, true);
    }
  };

  const clearFilters = () => {
    setFilterDecision("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters = filterDecision !== "ALL" || searchQuery.trim() !== "";

  const handleDecisionChange = () => {
    // Refresh the data after a decision change
    fetchCountryData(1, false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent mx-auto mb-3"></div>
          <p className="text-body text-text-secondary">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-danger-muted border border-danger-border text-red-400 px-4 py-3 rounded-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        </div>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!country || !stats) {
    return null;
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-display text-text-primary">{country.name}</h1>
            <p className="text-body text-text-secondary mt-1">
              Candidate screening analytics
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Candidates" value={stats.totalCandidates} icon={Users} />
        <StatCard label="Passed" value={stats.passedCandidates} icon={CheckCircle2} variant="success" />
        <StatCard label="Rejected" value={stats.rejectedCandidates} icon={XCircle} variant="danger" />
        <StatCard label="Pass Rate" value={`${stats.passRate}%`} icon={TrendingUp} variant="accent" />
      </div>

      {/* Filters */}
      <div className="bg-background-secondary border border-border rounded-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-text-secondary" />
          <h2 className="text-h3 text-text-primary">Filter Candidates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-small text-text-secondary mb-2 flex items-center gap-1">
              <Search className="w-3 h-3" />
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, title, company..."
              className="w-full h-9 px-3 bg-background border border-border rounded text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">Decision</label>
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-border rounded text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            >
              <option value="ALL">All Decisions</option>
              <option value="PASS">Pass</option>
              <option value="REJECT">Reject</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-small text-accent hover:text-accent-hover font-medium transition-colors"
            >
              Clear Filters
            </button>
            <span className="text-small text-text-secondary">
              Showing {candidates.length} of {pagination?.totalItems || 0} candidates
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
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="border-b border-border hover:bg-background-tertiary cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-body text-text-primary font-medium">{candidate.fullName}</div>
                  <div className="text-small text-text-secondary">
                    {candidate.location || "Unknown location"}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-body text-text-primary">{candidate.currentTitle || "-"}</div>
                  <div className="text-small text-text-secondary">{candidate.currentCompany || "-"}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={
                      candidate.decisionResult === 'PASS' ? 'pass' :
                      candidate.decisionResult === 'REVIEW' ? 'review' :
                      candidate.decisionResult === 'REJECT' ? 'reject' :
                      'pending'
                    }
                  >
                    {candidate.decisionResult || 'PENDING'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-body font-mono font-medium text-text-primary">
                    {candidate.overallScore || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-small text-text-secondary line-clamp-2">
                    {candidate.finalDecision?.reasoning || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {candidates.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-body text-text-secondary">
              {hasActiveFilters ? "No candidates match your filters" : "No candidates found for this country"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-small text-accent hover:text-accent-hover font-medium transition-colors"
              >
                Clear filters to see all candidates
              </button>
            )}
          </div>
        )}

        {/* Load More Button */}
        {pagination && pagination.hasMore && candidates.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="secondary"
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Load More ({pagination.totalItems - candidates.length} remaining)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination && candidates.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-center">
            <span className="text-small text-text-tertiary">
              Showing {candidates.length} of {pagination.totalItems} candidates
            </span>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onDecisionChange={handleDecisionChange}
        />
      )}
    </div>
  );
}
