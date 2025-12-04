"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Users, CheckCircle2, XCircle } from "lucide-react";

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
  stats: CountryStats;
}

export function CountryList() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-h2 text-text-primary flex items-center gap-2">
            <Globe className="w-5 h-5 text-text-secondary" />
            Countries
          </h2>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-border border-t-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-h2 text-text-primary flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" />
          Countries
        </h2>
        {countries.length > 0 && (
          <span className="text-tiny text-text-tertiary">{countries.length} regions</span>
        )}
      </div>

      <div className="p-4">
        {/* Info text */}
        <p className="text-tiny text-text-tertiary mb-4">
          Countries are auto-detected from candidate locations
        </p>

        {/* Countries List */}
        <div className="space-y-2">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/countries/${country.id}`}
              className="flex justify-between items-center px-4 py-3 rounded-lg bg-background-tertiary/30 hover:bg-background-tertiary/60 border border-transparent hover:border-border transition-all duration-150 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-body text-text-primary font-medium block">{country.name}</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-tiny text-text-tertiary flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {country.stats.totalCandidates}
                    </span>
                    <span className="text-tiny text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {country.stats.passedCandidates}
                    </span>
                    <span className="text-tiny text-danger flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {country.stats.rejectedCandidates}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {country.stats.passRate > 0 && (
                  <span className="text-small font-medium text-text-secondary">
                    {country.stats.passRate}% pass
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-150" />
              </div>
            </Link>
          ))}
          {countries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-text-tertiary" />
              </div>
              <p className="text-body text-text-primary mb-2">No countries yet</p>
              <p className="text-small text-text-secondary">
                Countries will appear here when you screen candidates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
