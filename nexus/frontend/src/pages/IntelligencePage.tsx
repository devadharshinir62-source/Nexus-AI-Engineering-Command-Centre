import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useRepository } from '../context/RepositoryContext';
import { DashboardService } from '../services/dashboardService';
import { CodeIntelligenceMetrics } from '../types/dashboard';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BrainCircuit,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  GitPullRequest,
  GitMerge,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const { selectedRepo, activeConnectedRepo } = useRepository();
  const [data, setData] = useState<CodeIntelligenceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    DashboardService.getCodeIntelligence(selectedRepo, activeConnectedRepo)
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, [selectedRepo, activeConnectedRepo]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-purple-400" />
              GitHub & Code Intelligence Center
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous analysis of pull request velocity, code review load distributions, and contributor metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="purple" size="sm" className="font-mono text-xs">
            Neural Heuristics Active
          </Badge>
        </div>
      </div>

      {/* 5 Top Summary Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRs Opened</span>
            <GitPullRequest className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{data.prsOpened}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Past 30 days</div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRs Merged</span>
            <GitMerge className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{data.prsMerged}</div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">97.1% merge rate</div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PR Cycle Time</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {data.avgPrCycleTimeDays} <span className="text-xs font-normal">days</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Avg open-to-merge</div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Issues Created</span>
            <span className="h-2 w-2 rounded-full bg-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{data.issuesCreated}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tracked backlog</div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Issues Closed</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{data.issuesClosed}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Resolved this sprint</div>
        </Card>
      </div>

      {/* Row 2: Visual Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Review Distribution Donut */}
        <Card className="p-4 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Reviews Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-400">Reviewers per pull request</CardDescription>
          </CardHeader>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.reviewsDistribution}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  isAnimationActive={false}
                >
                  {data.reviewsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/[0.05]">
            {data.reviewsDistribution.map((item) => (
              <span key={item.label} className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}: {item.count}
              </span>
            ))}
          </div>
        </Card>

        {/* Top Contributors Bar Chart */}
        <Card className="p-4 flex flex-col lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              Top Engineering Contributors
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Commit frequency and pull requests completed across active repositories
            </CardDescription>
          </CardHeader>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topContributors} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="commits" fill="#06B6D4" radius={[0, 4, 4, 0]} isAnimationActive={false} name="Commits" />
                <Bar dataKey="prs" fill="#8B5CF6" radius={[0, 4, 4, 0]} isAnimationActive={false} name="PRs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Weekly Activity Timeline Chart */}
      <Card className="p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Pull Requests & Issue Resolution Velocity
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            PRs opened vs merged and issues created vs resolved over time
          </CardDescription>
        </CardHeader>

        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyActivity} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="week" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="prsOpened" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} name="PRs Opened" />
              <Line type="monotone" dataKey="prsMerged" stroke="#34D399" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} name="PRs Merged" />
              <Line type="monotone" dataKey="issuesCreated" stroke="#F472B6" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} name="Issues Created" />
              <Line type="monotone" dataKey="issuesClosed" stroke="#FBBF24" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} name="Issues Closed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
