import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CountryList } from "@/components/CountryList";
import { RecentScreenings } from "@/components/RecentScreenings";
import { Users, CheckCircle2, TrendingUp, XCircle, Plus } from "lucide-react";
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

export default async function Dashboard() {
  let stats = {
    totalCandidates: 0,
    passedCandidates: 0,
    rejectedCandidates: 0,
    passRate: '0%'
  };

  try {
    const sessions = await prisma.screeningSession.findMany({
      select: {
        totalCandidates: true,
        candidatesProcessed: true,
        passedCandidates: true,
      }
    });

    const totalCandidates = sessions.reduce((acc, s) => acc + s.totalCandidates, 0);
    const passedCandidates = sessions.reduce((acc, s) => acc + s.passedCandidates, 0);
    const processedCandidates = sessions.reduce((acc, s) => acc + s.candidatesProcessed, 0);
    const rejectedCandidates = processedCandidates - passedCandidates;
    const passRate = processedCandidates > 0 ? `${Math.round((passedCandidates / processedCandidates) * 100)}%` : '0%';

    stats = { totalCandidates, passedCandidates, rejectedCandidates, passRate };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
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
          <StatCard label="Total Candidates" value={stats.totalCandidates} icon={Users} />
          <StatCard label="Passed" value={stats.passedCandidates} icon={CheckCircle2} variant="success" />
          <StatCard label="Rejected" value={stats.rejectedCandidates} icon={XCircle} variant="danger" />
          <StatCard label="Pass Rate" value={stats.passRate} icon={TrendingUp} variant="accent" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Screenings with CRUD */}
          <RecentScreenings />

          {/* Country List */}
          <CountryList />
        </div>
      </div>
    </div>
  );
}
