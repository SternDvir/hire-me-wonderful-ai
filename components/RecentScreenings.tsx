"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Users, Globe } from "lucide-react";

interface Session {
  id: string;
  createdAt: Date;
  status: string;
  totalCandidates: number;
  country?: {
    id: string;
    name: string;
  } | null;
}

interface RecentScreeningsProps {
  initialSessions: Session[];
  totalCount: number;
}

export function RecentScreenings({ initialSessions, totalCount }: RecentScreeningsProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchPage = async (page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const res = await fetch(`/api/screenings?skip=${skip}&take=${pageSize}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Recent Screenings</h2>
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || loading}
            className="p-2 rounded-wonderful-lg bg-card-light dark:bg-card-dark border border-white/20 dark:border-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg dark:shadow-wonderful-xl border border-white/20 dark:border-gray-800/50 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Date</span>
                </div>
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Country</span>
                </div>
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Candidates</span>
                </div>
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="px-4 md:px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(session.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  {session.country ? (
                    <Link
                      href={`/countries/${session.country.id}`}
                      className="text-sm font-semibold text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 dark:hover:text-wonderful-purple-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {session.country.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">No country</span>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                  {session.totalCandidates}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                    session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    session.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}>
                    {session.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                  <Link href={`/screenings/${session.id}`} className="text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 dark:hover:text-wonderful-purple-300 transition-colors">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-700 dark:text-gray-300 font-medium">
                  No screenings yet. Create your first screening session!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {sessions.length} of {totalCount} total screenings
        </div>
      )}
    </div>
  );
}
