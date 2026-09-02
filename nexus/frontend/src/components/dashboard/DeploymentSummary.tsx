import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Badge } from '../common/Badge';
import { DeploymentItem, DeploymentEnvironment, DeploymentStatus } from '../../types/dashboard';
import { formatRelativeTime } from '../../utils/formatters';
import { Rocket, CheckCircle2, Loader2, XCircle, ExternalLink, GitCommit } from 'lucide-react';

interface DeploymentSummaryProps {
  deployments: DeploymentItem[];
  onSelectDeployment?: (deployment: DeploymentItem) => void;
}

const envBadgeMap: Record<DeploymentEnvironment, { variant: 'emerald' | 'purple' | 'cyan'; label: string }> = {
  production: { variant: 'emerald', label: 'PROD' },
  staging: { variant: 'purple', label: 'STAGING' },
  preview: { variant: 'cyan', label: 'PREVIEW' },
};

const statusConfigMap: Record<DeploymentStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Deployed' },
  building: { icon: Loader2, color: 'text-cyan-400 animate-spin', label: 'Building' },
  failed: { icon: XCircle, color: 'text-rose-400', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'text-slate-400', label: 'Cancelled' },
  rollback: { icon: XCircle, color: 'text-amber-400', label: 'Rolled back' },
};

export const DeploymentSummary: React.FC<DeploymentSummaryProps> = ({
  deployments,
  onSelectDeployment,
}) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
        <div>
          <CardTitle>
            <Rocket className="h-4 w-4 text-emerald-400" />
            Deployment Radar & Releases
          </CardTitle>
          <CardDescription>
            Multi-cluster deployment statuses, canary rollouts, and commit shas
          </CardDescription>
        </div>

        <Badge variant="emerald" size="sm" dot pulse className="font-mono text-[10px]">
          Pipelines Operational
        </Badge>
      </CardHeader>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {deployments.map((dep) => {
          const envConfig = envBadgeMap[dep.environment];
          const statusConfig = statusConfigMap[dep.status];
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={dep.id}
              onClick={() => onSelectDeployment && onSelectDeployment(dep)}
              className="rounded-xl border border-white/[0.08] bg-[#0E1424]/70 p-3.5 transition-all duration-150 hover:border-cyan-500/30 hover:bg-[#131B30] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-white">
                      {dep.service}
                    </span>
                    <Badge variant={envConfig.variant} size="sm" className="font-mono text-[10px] py-0">
                      {envConfig.label}
                    </Badge>
                    <span className="font-mono text-[11px] text-slate-400">
                      {dep.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {dep.commitMessage}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                  <span className="text-xs font-medium text-slate-200 capitalize">
                    {dep.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <GitCommit className="h-3 w-3 text-cyan-400" />
                    {dep.commitSha}
                  </span>
                  <span>by {dep.deployedBy}</span>
                  <span className="font-mono">{dep.durationSeconds}s</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono">
                    {formatRelativeTime(dep.timestamp)}
                  </span>
                  {dep.deployUrl && (
                    <a
                      href={dep.deployUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-cyan-300 transition-colors"
                      title="View live URL"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
