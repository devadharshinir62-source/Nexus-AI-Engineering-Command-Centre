import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useRepository } from '../context/RepositoryContext';
import { DashboardService } from '../services/dashboardService';
import { DeveloperProductivityData } from '../types/dashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Rocket,
  Zap,
  Users,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { selectedRepo } = useRepository();
  const [data, setData] = useState<DeveloperProductivityData | null>(null);

  useEffect(() => {
    DashboardService.getProductivityData(selectedRepo).then((res) => setData(res));
  }, [selectedRepo]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-cyan-400" />
              Engineering Analytics & DORA Metrics
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            DORA performance benchmarks, lead time for changes, cycle times, and commit throughput
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" className="font-mono">
            <Calendar className="h-3 w-3 mr-1" /> DORA Elite Tier
          </Badge>
        </div>
      </div>

      {/* 4 DORA Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Deployment Frequency</span>
            <Badge variant="success" size="sm">Elite</Badge>
          </div>
          <p className="text-3xl font-bold font-mono text-white">12.4 / wk</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8.2% vs previous sprint
          </span>
        </Card>

        <Card variant="elevated" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Lead Time for Changes</span>
            <Badge variant="success" size="sm">Elite</Badge>
          </div>
          <p className="text-3xl font-bold font-mono text-white">{data.leadTimeHours} hrs</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> 12% faster commit-to-prod
          </span>
        </Card>

        <Card variant="elevated" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Change Failure Rate</span>
            <Badge variant="success" size="sm">Elite</Badge>
          </div>
          <p className="text-3xl font-bold font-mono text-white">{data.changeFailureRatePercent}%</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Industry benchmark &lt; 5%
          </span>
        </Card>

        <Card variant="elevated" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Mean Time to Restore (MTTR)</span>
            <Badge variant="success" size="sm">Elite</Badge>
          </div>
          <p className="text-3xl font-bold font-mono text-white">{data.mttrHours} hrs</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Automated rollbacks
          </span>
        </Card>
      </div>

      {/* Row 2: Commit Timeline Chart & Engineering Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Code Commits Timeline ({data.totalCommits} Total)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Monthly commit frequency across active branches
            </CardDescription>
          </CardHeader>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.commitTimeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="commits" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} name="Commits" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Workload Distribution */}
        <Card className="p-4 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              Engineering Delivery Health & Workload
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Active pull requests and pending review queue distribution
            </CardDescription>
          </CardHeader>
          <div className="space-y-3 pt-2">
            {data.workloadDistribution.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
                <div>
                  <div className="text-xs font-semibold text-white">{member.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {member.activePRs} active PRs · {member.reviewsPending} reviews in queue
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-cyan-400 font-bold">{member.velocityScore}</span>
                  <span className="text-[10px] text-slate-500 block">Velocity</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
