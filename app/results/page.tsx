"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { CandidateModal } from "@/components/CandidateModal";

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

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Candidate Results</h1>
        
        <div className="flex items-center gap-4">
          <label className="font-medium">Filter by Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border p-2 rounded-lg min-w-[200px]"
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

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900">{candidate.fullName}</h3>
                <p className="text-gray-600">{candidate.currentTitle} at {candidate.currentCompany}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(candidate.evaluatedAt).toLocaleDateString()} • {candidate.location}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  candidate.decisionResult === 'PASS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {candidate.decisionResult}
                </div>
                <div className="text-sm text-gray-500">Score: {candidate.overallScore}</div>
              </div>
            </div>
          ))}
          
          {candidates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No candidates found for the selected criteria.
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
  );
}
