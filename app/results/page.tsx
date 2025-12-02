"use client";

import { useState, useEffect } from "react";
import { CandidateModal } from "@/components/CandidateModal";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Globe,
  CheckCircle2,
  XCircle,
  MapPin,
  TrendingUp
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

function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default'
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'danger';
}) {
  const iconColors = {
    default: 'text-text-secondary',
    success: 'text-success',
    danger: 'text-danger',
  };

  const valueColors = {
    default: 'text-text-primary',
    success: 'text-success',
    danger: 'text-danger',
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
  const rejectedCount = candidates.filter(c => c.decisionResult === 'REJECT').length;
  const passRate = candidates.length > 0 ? `${Math.round((passedCount / candidates.length) * 100)}%` : '0%';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-text-primary">All Results</h1>
        <p className="text-body text-text-secondary mt-1">View and filter all candidate evaluations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={candidates.length} icon={Users} />
        <StatCard label="Passed" value={passedCount} icon={CheckCircle2} variant="success" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} variant="danger" />
        <StatCard label="Pass Rate" value={passRate} icon={TrendingUp} />
      </div>

      {/* Filter */}
      <div className="bg-background-secondary border border-border rounded-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary">
            <Globe className="w-4 h-4 text-text-secondary" />
            <span className="text-body font-medium">Filter by Country</span>
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="h-9 px-3 bg-background border border-border rounded text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors min-w-[180px]"
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

      {/* Results Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent mx-auto mb-3"></div>
            <p className="text-body text-text-secondary">Loading candidates...</p>
          </div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="bg-background-secondary border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-background-tertiary border-b border-border">
                <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-center text-small font-medium text-text-secondary uppercase tracking-wide">Score</th>
                <th className="px-4 py-3 text-center text-small font-medium text-text-secondary uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="border-b border-border hover:bg-background-tertiary transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="text-body text-text-primary font-medium">{candidate.fullName}</div>
                    <div className="text-small text-text-secondary md:hidden">{candidate.currentTitle}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-body text-text-primary">{candidate.currentTitle}</div>
                    <div className="text-small text-text-secondary">{candidate.currentCompany}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-body text-text-secondary">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-body font-mono font-medium text-text-primary">{candidate.overallScore}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={candidate.decisionResult === 'PASS' ? 'pass' : 'reject'}>
                      {candidate.decisionResult}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-background-secondary border border-border rounded-md">
          <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-body text-text-secondary">No candidates found for the selected criteria</p>
        </div>
      )}

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
