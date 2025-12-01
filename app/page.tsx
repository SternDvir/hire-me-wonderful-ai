import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CountryManager } from "@/components/CountryManager";

// Force dynamic rendering to ensure we get the latest sessions
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let sessions = [];
  try {
    sessions = await prisma.screeningSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 10
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    // Return a basic UI indicating error, or let sessions be empty but show a warning
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Hire Me, Wonderful AI</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-8" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load sessions. Please check your database connection.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your screening sessions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Candidates</div>
          <div className="text-3xl font-bold">
            {sessions.reduce((acc, s) => acc + s.totalCandidates, 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Passed</div>
          <div className="text-3xl font-bold text-green-600">
            {sessions.reduce((acc, s) => acc + s.passedCandidates, 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Avg. Pass Rate</div>
          <div className="text-3xl font-bold text-blue-600">
            {sessions.length > 0 
              ? Math.round((sessions.reduce((acc, s) => acc + s.passedCandidates, 0) / Math.max(1, sessions.reduce((acc, s) => acc + s.candidatesProcessed, 0))) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Screenings</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/screenings/${session.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No screenings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <CountryManager />
        </div>
      </div>
    </div>
  );
}
