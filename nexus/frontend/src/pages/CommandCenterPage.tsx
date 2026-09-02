import React, { useState, useEffect, useCallback } from 'react';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { HealthMetricChart } from '../components/dashboard/HealthMetricChart';
import { AIInsightPanel } from '../components/dashboard/AIInsightPanel';
import { ProjectHealthCard } from '../components/dashboard/ProjectHealthCard';
import { RiskSummary } from '../components/dashboard/RiskSummary';
import { DeploymentSummary } from '../components/dashboard/DeploymentSummary';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { InsightDetailModal } from '../components/dashboard/InsightDetailModal';
import { WorkflowPipelineBoard } from '../components/dashboard/WorkflowPipelineBoard';
import { ServiceHealthObservability } from '../components/dashboard/ServiceHealthObservability';
import { ProjectDetailModal } from '../components/dashboard/ProjectDetailModal';
import { DeploymentDetailDrawer } from '../components/dashboard/DeploymentDetailDrawer';
import { DashboardService } from '../services/dashboardService';
import { useRepository } from '../context/RepositoryContext';
import {
  MetricSummary,
  HealthMetricPoint,
  AIInsight,
  ProjectHealthOverview,
  RiskItem,
  DeploymentItem,
  EngineeringActivity,
  PipelineProject,
  ObservabilityMetrics,
} from '../types/dashboard';
import { RefreshCw, Download, Layers } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const CommandCenterPage: React.FC = () => {
  const { selectedRepo, activeConnectedRepo, setIsConnectModalOpen } = useRepository();
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [healthHistory, setHealthHistory] = useState<HealthMetricPoint[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [projects, setProjects] = useState<ProjectHealthOverview[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [activities, setActivities] = useState<EngineeringActivity[]>([]);
  const [pipelineProjects, setPipelineProjects] = useState<PipelineProject[]>([]);
  const [observability, setObservability] = useState<ObservabilityMetrics | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [selectedPipelineProject, setSelectedPipelineProject] = useState<PipelineProject | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [m, h, i, p, r, d, a, pipe, obs] = await Promise.all([
        DashboardService.getMetrics(selectedRepo, activeConnectedRepo),
        DashboardService.getHealthHistory(selectedRepo, '7d', activeConnectedRepo),
        DashboardService.getAIInsights(selectedRepo, activeConnectedRepo),
        DashboardService.getProjectHealthList(selectedRepo),
        DashboardService.getRisks(selectedRepo),
        DashboardService.getDeployments(selectedRepo, activeConnectedRepo),
        DashboardService.getRecentActivity(selectedRepo, activeConnectedRepo),
        DashboardService.getPipelineProjects(selectedRepo),
        DashboardService.getObservability(selectedRepo),
      ]);
      setMetrics(m);
      setHealthHistory(h);
      setInsights(i);
      setProjects(p);
      setRisks(r);
      setDeployments(d);
      setActivities(a);
      setPipelineProjects(pipe);
      setObservability(obs);
      setLastRefreshed(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedRepo, activeConnectedRepo]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleExportReport = () => {
    setIsExporting(true);
    const reportData = {
      timestamp: new Date().toISOString(),
      repositoryScope: selectedRepo,
      metrics,
      healthHistory,
      insights,
      risks,
      deployments,
      pipelineProjects,
      observability,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-telemetry-report-${selectedRepo}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-tight">Engineering Command Center</h2>
              {selectedRepo !== 'all' && (
                <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                  Scope: {selectedRepo}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {selectedRepo === 'all'
                ? 'Continuous telemetry across 8 repositories, 18 contributors, and 4 pipelines'
                : `Focused telemetry and pipeline diagnostics for ${selectedRepo}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
            Updated: <span className="text-slate-300 font-semibold">{lastRefreshed}</span>
          </span>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={loadDashboardData}
            className="text-xs"
          >
            Refresh Telemetry
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            isLoading={isExporting}
            onClick={handleExportReport}
            className="text-xs hidden sm:inline-flex"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Row 1: Key Metrics Grid (5 Cards) */}
      <MetricsGrid metrics={metrics} />

      {/* Row 2: Health Dynamics Chart (approx 65-70%) & AI Insight Panel (approx 30-35%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)] gap-5 lg:gap-6 items-stretch">
        <div className="min-w-0 flex flex-col min-h-[380px]">
          <HealthMetricChart data={healthHistory} />
        </div>
        <div className="min-w-0 flex flex-col min-h-[380px]">
          <AIInsightPanel
            insights={insights}
            onExploreInsight={(insight) => setSelectedInsight(insight)}
          />
        </div>
      </div>

      {/* Row 3: Visual Engineering Workflow Pipeline (6 Stages) */}
      <div className="w-full">
        <WorkflowPipelineBoard
          projects={pipelineProjects}
          onSelectProject={(p) => setSelectedPipelineProject(p)}
        />
      </div>

      {/* Row 4: Service Health & Telemetry Observability */}
      {observability && (
        <div className="w-full">
          <ServiceHealthObservability metrics={observability} />
        </div>
      )}

      {/* Row 5: Connected Repositories, Risk Summary, & Deployment Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="min-h-[360px] min-w-0">
          <ProjectHealthCard projects={projects} />
        </div>
        <div className="min-h-[360px] min-w-0">
          <RiskSummary risks={risks} />
        </div>
        <div className="min-h-[360px] min-w-0">
          <DeploymentSummary
            deployments={deployments}
            onSelectDeployment={(d) => setSelectedDeployment(d)}
          />
        </div>
      </div>

      {/* Row 6: Real-time Engineering Timeline Activity */}
      <div className="grid grid-cols-1 gap-5 lg:gap-6">
        <ActivityFeed activities={activities} />
      </div>

      {/* Modals & Drawers */}
      <InsightDetailModal
        insight={selectedInsight}
        isOpen={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />

      <ProjectDetailModal
        project={selectedPipelineProject}
        isOpen={!!selectedPipelineProject}
        onClose={() => setSelectedPipelineProject(null)}
      />

      <DeploymentDetailDrawer
        deployment={selectedDeployment}
        isOpen={!!selectedDeployment}
        onClose={() => setSelectedDeployment(null)}
      />
    </div>
  );
};
