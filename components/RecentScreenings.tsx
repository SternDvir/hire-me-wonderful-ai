"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Calendar,
  Trash2,
  ArrowRight,
  Filter,
  Users,
  X,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Country {
  id: string;
  name: string;
}

interface Session {
  id: string;
  createdAt: string;
  totalCandidates: number;
  candidatesProcessed: number;
  passedCandidates: number;
  status: string;
  country?: Country | null;
  countryId?: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === 'completed' ? 'pass'
    : status === 'processing' ? 'info'
    : 'pending';

  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function RecentScreenings() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Actions state
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filterCountry, filterDateFrom, filterDateTo]);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCountry) params.set("countryId", filterCountry);
      if (filterDateFrom) params.set("dateFrom", filterDateFrom);
      if (filterDateTo) params.set("dateTo", filterDateTo);

      const res = await fetch(`/api/screenings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    setDeleting(sessionId);
    try {
      const res = await fetch(`/api/screenings?id=${sessionId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setExpandedId(null);
        setConfirmDelete(null);
      } else {
        alert("Failed to delete session");
      }
    } catch (error) {
      console.error("Failed to delete session", error);
      alert("Failed to delete session");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateCountry = async (sessionId: string, countryId: string | null) => {
    setUpdating(sessionId);
    try {
      const res = await fetch("/api/screenings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, countryId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      } else {
        alert("Failed to update session");
      }
    } catch (error) {
      console.error("Failed to update session", error);
      alert("Failed to update session");
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpand = (sessionId: string) => {
    setExpandedId(prev => prev === sessionId ? null : sessionId);
    setConfirmDelete(null);
  };

  const clearFilters = () => {
    setFilterCountry("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasActiveFilters = filterCountry || filterDateFrom || filterDateTo;

  if (loading && sessions.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-h2 text-text-primary">Recent Screenings</h2>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-border border-t-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header with filter toggle */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-text-primary">Recent Screenings</h2>
          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <span className="text-tiny text-text-tertiary">{sessions.length} sessions</span>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-accent-muted text-accent'
                  : 'hover:bg-background-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            <div className="flex flex-wrap items-end gap-3">
              {/* Country Filter */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-tiny text-text-tertiary mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Country
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full h-9 px-3 bg-background-tertiary/50 border border-border rounded-md text-small text-text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-tiny text-text-tertiary mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  From
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full h-9 px-3 bg-background-tertiary/50 border border-border rounded-md text-small text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Date To */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-tiny text-text-tertiary mb-1.5">To</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full h-9 px-3 bg-background-tertiary/50 border border-border rounded-md text-small text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Clear button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-9 px-3 text-small text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div key={session.id}>
              {/* Session Row */}
              <div className="flex items-center">
                {/* Expand Toggle */}
                <button
                  onClick={() => toggleExpand(session.id)}
                  className="shrink-0 w-10 h-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-background-tertiary/50 transition-colors py-4"
                >
                  {expandedId === session.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Session Info - Clickable to view */}
                <Link
                  href={`/screenings/${session.id}`}
                  className="flex-1 flex items-center justify-between py-4 pr-5 hover:bg-background-tertiary/30 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-body text-text-primary font-medium">
                      {new Date(session.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-small text-text-secondary flex items-center gap-2 mt-1">
                      <span className="font-mono text-accent">{session.totalCandidates}</span>
                      <span>candidates</span>
                      {session.country && (
                        <>
                          <span className="text-text-tertiary">•</span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.country.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <StatusBadge status={session.status} />
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-150" />
                  </div>
                </Link>
              </div>

              {/* Expanded Actions Panel */}
              {expandedId === session.id && (
                <div className="bg-background-tertiary/30 border-t border-border px-5 py-4 animate-fade-in">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Change Country */}
                    <div className="flex items-center gap-2">
                      <label className="text-small text-text-secondary">Move to:</label>
                      <select
                        value={session.countryId || ""}
                        onChange={(e) => handleUpdateCountry(session.id, e.target.value || null)}
                        disabled={updating === session.id}
                        className="h-8 px-3 bg-background-secondary border border-border rounded-md text-small text-text-primary focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                      >
                        <option value="">No country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {updating === session.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-border border-t-accent"></div>
                      )}
                    </div>

                    <div className="flex-1" />

                    {/* Delete Action */}
                    {confirmDelete === session.id ? (
                      <div className="flex items-center gap-2 bg-danger-muted border border-danger-border rounded-lg px-3 py-2">
                        <AlertTriangle className="w-4 h-4 text-danger-light" />
                        <span className="text-small text-danger-light">Delete session and all candidates?</span>
                        <button
                          onClick={() => handleDelete(session.id)}
                          disabled={deleting === session.id}
                          className="p-1.5 bg-danger hover:bg-danger/80 text-white rounded-md transition-colors disabled:opacity-50"
                        >
                          {deleting === session.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="p-1.5 bg-background-tertiary hover:bg-background-highlight text-text-secondary hover:text-text-primary rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setConfirmDelete(session.id)}
                        className="text-danger-light hover:bg-danger-muted hover:border-danger-border"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-background-tertiary flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-text-tertiary" />
          </div>
          <p className="text-body text-text-primary mb-2">
            {hasActiveFilters ? "No screenings match filters" : "No screenings yet"}
          </p>
          <p className="text-small text-text-secondary mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Upload candidate data to start screening"
            }
          </p>
          {hasActiveFilters ? (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Link href="/upload">
              <Button variant="secondary" size="sm">
                Start your first screening
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
