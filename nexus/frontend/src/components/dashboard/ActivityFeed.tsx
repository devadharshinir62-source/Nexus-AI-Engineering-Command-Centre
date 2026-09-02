import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Badge } from '../common/Badge';
import { EngineeringActivity, ActivityType } from '../../types/dashboard';
import { formatRelativeTime } from '../../utils/formatters';
import {
  History,
  GitCommit,
  GitPullRequest,
  Rocket,
  ShieldAlert,
  AlertCircle,
  MessageSquare,
  GitBranch,
} from 'lucide-react';

interface ActivityFeedProps {
  activities: EngineeringActivity[];
}

const activityIconMap: Record<ActivityType, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  commit: { icon: GitCommit, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  pull_request: { icon: GitPullRequest, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  deployment: { icon: Rocket, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  security_alert: { icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  issue: { icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  review: { icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
        <div>
          <CardTitle>
            <History className="h-4 w-4 text-cyan-400" />
            Live Engineering Timeline
          </CardTitle>
          <CardDescription>
            Chronological log of pull requests, commits, and security events
          </CardDescription>
        </div>

        <Badge variant="cyan" size="sm" dot pulse className="font-mono text-[10px]">
          Streaming Live
        </Badge>
      </CardHeader>

      <div className="relative pl-6 space-y-5 flex-1 overflow-y-auto before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.08]">
        {activities.map((act) => {
          const config = activityIconMap[act.type] || activityIconMap.commit;
          const Icon = config.icon;

          return (
            <div key={act.id} className="relative group">
              {/* Timeline dot icon */}
              <div
                className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm ${config.color}`}
              >
                <Icon className="h-3 w-3" />
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#0E1424]/60 p-3 transition-all duration-150 group-hover:border-white/[0.14] group-hover:bg-[#121A2E]">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px]">
                  <div className="flex items-center gap-2">
                    <img
                      src={act.author.avatar}
                      alt={act.author.name}
                      className="h-4 w-4 rounded-full object-cover border border-white/[0.1]"
                    />
                    <span className="text-slate-300 font-medium">{act.author.name}</span>
                    <span className="text-slate-400 font-mono">@{act.author.handle}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <span className="text-cyan-400/90">{act.repository}</span>
                    {act.branch && (
                      <span className="flex items-center gap-0.5">
                        <GitBranch className="h-2.5 w-2.5" />
                        {act.branch}
                      </span>
                    )}
                    {act.refId && (
                      <span className="rounded bg-white/[0.05] px-1 py-0.2 text-[9px] text-slate-300">
                        {act.refId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
