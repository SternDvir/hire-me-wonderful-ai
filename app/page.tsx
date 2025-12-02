import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CountryManager } from "@/components/CountryManager";
import { Users, CheckCircle2, TrendingUp, XCircle, ArrowRight, Globe, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

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
  const styles = {
    default: {
      icon: 'text-text-secondary',
      value: 'text-text-primary',
      glow: '',
    },
    success: {
      icon: 'text-success-light',
      value: 'text-success-light',
      glow: 'shadow-glow-success',
    },
    danger: {
      icon: 'text-danger-light',
      value: 'text-danger-light',
      glow: 'shadow-glow-danger',
    },
    accent: {
      icon: 'text-accent',
      value: 'text-accent',
      glow: 'shadow-glow',
    },
  };

  const style = styles[variant];

  return (
    <div className={`card p-5 ${style.glow}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg bg-background-tertiary flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
        <span className="text-small text-text-secondary">{label}</span>
      </div>
      <div className={`text-display font-semibold ${style.value}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
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

export default async function Dashboard() {
  let sessions: any[] = [];
  try {
    sessions = await prisma.screeningSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        country: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return (
      <div className="page-gradient min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-display text-text-primary mb-2">Dashboard</h1>
          <div className="bg-danger-muted border border-danger-border text-danger-light px-4 py-3 rounded-lg mt-8">
            <strong className="font-semibold">Error:</strong> Failed to load sessions. Please check your database connection.
          </div>
        </div>
      </div>
    );
  }

  const totalCandidates = sessions.reduce((acc, s) => acc + s.totalCandidates, 0);
  const passedCandidates = sessions.reduce((acc, s) => acc + s.passedCandidates, 0);
  const rejectedCandidates = sessions.reduce((acc, s) => acc + (s.candidatesProcessed - s.passedCandidates), 0);
  const processedCandidates = sessions.reduce((acc, s) => acc + s.candidatesProcessed, 0);
  const passRate = processedCandidates > 0 ? `${Math.round((passedCandidates / processedCandidates) * 100)}%` : '0%';

  return (
    <div className="page-gradient min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-display text-text-primary">Dashboard</h1>
            <p className="text-body text-text-secondary mt-2">
              Overview of your candidate screening pipeline
            </p>
          </div>
          <Link href="/upload">
            <Button size="lg">
              <Plus className="w-4 h-4" />
              New Screening
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Candidates" value={totalCandidates} icon={Users} />
          <StatCard label="Passed" value={passedCandidates} icon={CheckCircle2} variant="success" />
          <StatCard label="Rejected" value={rejectedCandidates} icon={XCircle} variant="danger" />
          <StatCard label="Pass Rate" value={passRate} icon={TrendingUp} variant="accent" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Screenings */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-h2 text-text-primary">Recent Screenings</h2>
              {sessions.length > 0 && (
                <span className="text-tiny text-text-tertiary">{sessions.length} sessions</span>
              )}
            </div>

            {sessions.length > 0 ? (
              <div className="divide-y divide-border">
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/screenings/${session.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-background-tertiary/50 transition-all duration-150 group"
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
                ))}
              </div>
            ) : (
              <div className="px-5 py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-text-tertiary" />
                </div>
                <p className="text-body text-text-primary mb-2">No screenings yet</p>
                <p className="text-small text-text-secondary mb-4">
                  Upload candidate data to start screening
                </p>
                <Link href="/upload">
                  <Button variant="secondary" size="sm">
                    Start your first screening
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Country Manager */}
          <CountryManager />
        </div>
      </div>
    </div>
  );
}
