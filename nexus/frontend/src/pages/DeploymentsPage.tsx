import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { DeploymentItem } from '../types/dashboard';
import { DeploymentSummary } from '../components/dashboard/DeploymentSummary';
import { DeploymentDetailDrawer } from '../components/dashboard/DeploymentDetailDrawer';
import { useRepository } from '../context/RepositoryContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Rocket, RefreshCw, CheckCircle2, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';

export const DeploymentsPage: React.FC = () => {
  const { selectedRepo, activeConnectedRepo } = useRepository();
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    DashboardService.getDeployments(selectedRepo, activeConnectedRepo).then(setDeployments);
  }, [selectedRepo, activeConnectedRepo]);

  const handleSync = () => {
    setIsSyncing(true);
    DashboardService.getDeployments(selectedRepo, activeConnectedRepo).then((res) => {
      setDeployments(res);
      setIsSyncing(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Rocket className="h-5 w-5 text-emerald-400" />
              Deployments & Release Pipelines
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pipeline logs, multi-region cluster health, and zero-downtime rollbacks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={isSyncing}
            onClick={handleSync}
            className="text-xs"
          >
            Sync Clusters
          </Button>
        </div>
      </div>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400">Production (US-East-1)</span>
          <div className="flex items-center gap-2 pt-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-lg font-bold text-white font-mono">100% Healthy</span>
          </div>
          <p className="text-[11px] text-slate-400">12 ECS tasks active</p>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400">Staging (EU-Central-1)</span>
          <div className="flex items-center gap-2 pt-1">
            <CheckCircle2 className="h-5 w-5 text-cyan-400" />
            <span className="text-lg font-bold text-white font-mono">Active (1 building)</span>
          </div>
          <p className="text-[11px] text-slate-400">Continuous deployment branch</p>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400">Rollback Radar</span>
          <div className="flex items-center gap-2 pt-1">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-bold text-white font-mono">4.2% Risk</span>
          </div>
          <p className="text-[11px] text-slate-400">Automated canary traffic gating</p>
        </Card>
      </div>

      {/* Main Deployments Feed */}
      <div className="min-h-[420px]">
        <DeploymentSummary
          deployments={deployments}
          onSelectDeployment={(d) => setSelectedDeployment(d)}
        />
      </div>

      {/* Deployment Detail Drawer */}
      <DeploymentDetailDrawer
        deployment={selectedDeployment}
        isOpen={!!selectedDeployment}
        onClose={() => setSelectedDeployment(null)}
      />
    </div>
  );
};
