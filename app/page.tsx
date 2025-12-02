import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CountryManager } from "@/components/CountryManager";
import { GradientOrbs } from "@/components/GradientOrbs";
import { Users, CheckCircle2, TrendingUp, Calendar, ArrowRight } from "lucide-react";

// Force dynamic rendering to ensure we get the latest sessions
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let sessions: any[] = [];
  try {
    sessions = await prisma.screeningSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 10
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return (
      <div className="relative min-h-screen">
        <GradientOrbs variant="minimal" />
        <div className="container mx-auto p-8 relative">
          <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent mb-2">Dashboard</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-wonderful-lg mt-8" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Failed to load sessions. Please check your database connection.</span>
          </div>
        </div>
      </div>
    );
  }

  const totalCandidates = sessions.reduce((acc, s) => acc + s.totalCandidates, 0);
  const passedCandidates = sessions.reduce((acc, s) => acc + s.passedCandidates, 0);
  const processedCandidates = sessions.reduce((acc, s) => acc + s.candidatesProcessed, 0);
  const passRate = processedCandidates > 0 ? Math.round((passedCandidates / processedCandidates) * 100) : 0;

  return (
    <div className="relative min-h-screen">
      <GradientOrbs variant="section" />

      <div className="container mx-auto p-8 relative">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-lg text-gray-700">Overview of your screening sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card-light backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-1 uppercase tracking-wide">Total Candidates</div>
                <div className="text-4xl font-bold text-gray-900">{totalCandidates}</div>
              </div>
              <Users className="w-10 h-10 text-wonderful-purple-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-1 uppercase tracking-wide">Passed</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  {passedCandidates}
                </div>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-card-light backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-1 uppercase tracking-wide">Pass Rate</div>
                <div className="text-4xl font-bold bg-text-accent bg-clip-text text-transparent">{passRate}%</div>
              </div>
              <TrendingUp className="w-10 h-10 text-wonderful-blue-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Screenings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Screenings</h2>
            <div className="bg-card-light backdrop-blur-sm rounded-wonderful-xl shadow-wonderful-lg border border-white/20 overflow-hidden">
              {sessions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/screenings/${session.id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-wonderful-purple-100 rounded-wonderful-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-wonderful-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {new Date(session.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {session.totalCandidates} candidates
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status.toUpperCase()}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-wonderful-purple-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No screenings yet.</p>
                  <Link
                    href="/upload"
                    className="inline-flex items-center mt-4 text-wonderful-purple-600 hover:text-wonderful-purple-700 font-semibold"
                  >
                    Start your first screening
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Country Manager */}
          <div>
            <CountryManager />
          </div>
        </div>
      </div>
    </div>
  );
}
