import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProjectHealthOverview } from '../../types/dashboard';
import { formatRelativeTime } from '../../utils/formatters';
import {
  FolderGit2,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface ProjectHealthCardProps {
  projects: ProjectHealthOverview[];
  onSelectProject?: (project: ProjectHealthOverview) => void;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({
  projects,
  onSelectProject,
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500';
    if (score >= 80) return 'text-cyan-400 bg-cyan-500';
    if (score >= 70) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
        <div>
          <CardTitle>
            <FolderGit2 className="h-4 w-4 text-cyan-400" />
            Connected Repositories & Health Matrix
          </CardTitle>
          <CardDescription>
            Live synchronization with GitHub repositories, test suites, and pull requests
          </CardDescription>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {projects.length} Repositories
        </span>
      </CardHeader>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {projects.map((proj) => {
          const colorClasses = getHealthColor(proj.healthScore);
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject && onSelectProject(proj)}
              className="rounded-xl border border-white/[0.08] bg-[#0E1424]/70 p-3.5 transition-all duration-200 hover:border-white/[0.18] hover:bg-[#131B30] cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {proj.name}
                    </span>
                    <span className="flex items-center gap-1 rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/[0.06]">
                      <GitBranch className="h-2.5 w-2.5 text-cyan-400" />
                      {proj.activeBranch}
                    </span>
                    {proj.buildStatus === 'passing' ? (
                      <Badge variant="success" size="sm" className="py-0 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> CI PASS
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm" className="py-0 text-[10px]">
                        <XCircle className="h-3 w-3 mr-1" /> CI FAIL
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block font-mono">
                    {proj.repository}
                  </span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-400">Score</span>
                    <span className="font-mono text-sm font-bold text-white">
                      {proj.healthScore}%
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors mt-1" />
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClasses.split(' ')[1]}`}
                    style={{ width: `${proj.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Footer metrics */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3 text-purple-400" />
                    {proj.openPRs} PRs
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                    {proj.openIssues} issues
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    {proj.coveragePercent}% cov
                  </span>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Clock className="h-2.5 w-2.5" />
                  {formatRelativeTime(proj.lastCommitTime)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
