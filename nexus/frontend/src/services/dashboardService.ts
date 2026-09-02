import { api } from './api';
import {
  MOCK_METRICS,
  getFilteredMetrics,
  generateHealthHistory,
  MOCK_AI_INSIGHTS,
  MOCK_ACTIVITIES,
  MOCK_RISKS,
  MOCK_DEPLOYMENTS,
  MOCK_PROJECT_HEALTH_LIST,
  MOCK_PROJECTS,
  getFilteredPipelineProjects,
  getObservabilityMetrics,
  getCodeIntelligenceMetrics,
  getDeveloperProductivityData,
  getSecurityIntelligenceData,
} from './mockData';
import {
  MetricSummary,
  HealthMetricPoint,
  AIInsight,
  EngineeringActivity,
  RiskItem,
  DeploymentItem,
  ProjectHealthOverview,
  PipelineProject,
  ObservabilityMetrics,
  CodeIntelligenceMetrics,
  DeveloperProductivityData,
  SecurityIntelligenceData,
} from '../types/dashboard';
import { Project } from '../types/project';
import { ConnectedRepository } from '../types/repository';

export class DashboardService {
  // ==========================================
  // REAL GITHUB REPOSITORY API CALLS
  // ==========================================
  public static async connectRepository(url: string): Promise<ConnectedRepository> {
    const res = await api.post<ConnectedRepository>('/repositories/connect', { url });
    return res.data;
  }

  public static async getConnectedRepositories(): Promise<ConnectedRepository[]> {
    try {
      const res = await api.get<ConnectedRepository[]>('/repositories');
      return res.data;
    } catch {
      return [];
    }
  }

  public static async getRepositoryDetails(repoIdentifier: string): Promise<ConnectedRepository | null> {
    try {
      const res = await api.get<ConnectedRepository>(`/repositories/${encodeURIComponent(repoIdentifier)}`);
      return res.data;
    } catch {
      return null;
    }
  }

  public static async disconnectRepository(repoIdentifier: string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/repositories/${encodeURIComponent(repoIdentifier)}`);
    return res.data;
  }

  // ==========================================
  // DASHBOARD TELEMETRY & AGGREGATION
  // ==========================================
  public static async getMetrics(
    repo = 'all',
    connectedRepo?: ConnectedRepository | null
  ): Promise<MetricSummary[]> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      const m = connectedRepo.metrics_summary;
      return [
        {
          id: 'project-health',
          title: 'Project Health',
          value: m.health_score,
          unit: '/100',
          change: m.health_score >= 80 ? 4.2 : -2.5,
          trend: m.health_score >= 80 ? 'up' : 'down',
          status: m.health_score >= 80 ? 'positive' : 'warning',
          timeframe: 'GitHub Multi-Vector Score',
          description: `Deterministic health based on ${m.recent_commits_count} commits, CI, and PR cadence`,
        },
        {
          id: 'active-projects',
          title: 'Default Branch',
          value: connectedRepo.default_branch,
          unit: '',
          change: 0,
          trend: 'neutral',
          status: 'neutral',
          timeframe: `${m.open_prs_count} open pull requests`,
          description: `${connectedRepo.stars.toLocaleString()} stars · ${connectedRepo.language || 'Codebase'}`,
        },
        {
          id: 'open-issues',
          title: 'Open Issues',
          value: connectedRepo.open_issues,
          unit: 'items',
          change: connectedRepo.open_issues > 10 ? 5.0 : -10.0,
          trend: connectedRepo.open_issues > 10 ? 'up' : 'down',
          status: connectedRepo.open_issues > 20 ? 'warning' : 'positive',
          timeframe: 'GitHub live issue tracker',
          description: `Total open issues tracked in ${connectedRepo.full_name}`,
        },
        {
          id: 'build-success-rate',
          title: 'Build Success Rate',
          value: `${m.test_pass_rate}%`,
          unit: '',
          change: m.test_pass_rate >= 90 ? 1.5 : -4.0,
          trend: m.test_pass_rate >= 90 ? 'up' : 'down',
          status: m.test_pass_rate >= 90 ? 'positive' : 'negative',
          timeframe: `${connectedRepo.recent_workflows.length} GitHub Actions runs`,
          description: 'Passing workflow conclusion rate from GitHub Actions',
        },
        {
          id: 'api-performance',
          title: 'API P99 Latency',
          value: 'Not connected',
          unit: '',
          change: 0,
          trend: 'neutral',
          status: 'neutral',
          timeframe: 'No telemetry source',
          description: 'Requires APM / Observability agent connected to this service',
        },
      ];
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(getFilteredMetrics(repo)), 40);
    });
  }

  public static async getHealthHistory(
    repo = 'all',
    timeRange: '7d' | '14d' | '30d' = '7d',
    connectedRepo?: ConnectedRepository | null
  ): Promise<HealthMetricPoint[]> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      const days = timeRange === '30d' ? 30 : timeRange === '14d' ? 14 : 7;
      const baseScore = connectedRepo.health.health_score;
      const baseVelocity = connectedRepo.metrics_summary.velocity_pts;
      const basePass = connectedRepo.metrics_summary.test_pass_rate;
      const baseDeploy = Math.max(1, connectedRepo.metrics_summary.releases_count);
      const baseCommits = connectedRepo.metrics_summary.recent_commits_count;
      const basePrHours = connectedRepo.metrics_summary.pr_cycle_time_hours;

      const results: HealthMetricPoint[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const wave = Math.sin(i * 0.7) * 2;
        results.push({
          timestamp: d.toISOString().split('T')[0],
          date: dateStr,
          healthScore: Math.min(100, Math.max(40, Math.round(baseScore + wave))),
          velocity: Math.max(5, Math.round(baseVelocity + wave * 1.5)),
          resolvedIssues: Math.max(1, Math.round(4 + wave)),
          testPassRate: Math.min(100, Number((basePass + wave * 0.2).toFixed(1))),
          deploymentFrequency: Math.max(1, Math.round(baseDeploy)),
          codeCommits: Math.max(1, Math.round((baseCommits / days) * (1 + wave * 0.1))),
          prCycleTimeHours: Number(Math.max(1, basePrHours + wave * 0.5).toFixed(1)),
          apiLatencyMs: 0,
          errorRatePercent: 0,
        });
      }
      return results;
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateHealthHistory(repo, timeRange)), 40);
    });
  }
  public static async getAIInsights(
    repo = 'all',
    connectedRepo?: ConnectedRepository | null
  ): Promise<AIInsight[]> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      const insights: AIInsight[] = [];
      const m = connectedRepo.metrics_summary;

      if (m.test_pass_rate < 100 && connectedRepo.recent_workflows.length > 0) {
        insights.push({
          id: `ins-ci-${connectedRepo.id}`,
          title: `GitHub Actions CI Pass Rate at ${m.test_pass_rate}%`,
          description: `Analysis of ${connectedRepo.recent_workflows.length} workflow runs detected failure conclusions on ${connectedRepo.default_branch}.`,
          category: 'reliability',
          impact: 'high',
          confidenceScore: 96,
          recommendation: 'Inspect failing job step logs and pin flaky dependency versions in workflow configuration.',
          affectedRepositories: [connectedRepo.name],
          timestamp: new Date().toISOString(),
        });
      }

      if (m.open_prs_count > 0) {
        insights.push({
          id: `ins-pr-${connectedRepo.id}`,
          title: `Active Pull Request Review Turnaround (~${m.pr_cycle_time_hours}h)`,
          description: `${m.open_prs_count} pull requests currently pending review on ${connectedRepo.full_name}.`,
          category: 'bottleneck',
          impact: 'medium',
          confidenceScore: 92,
          recommendation: `Assign dedicated code reviewers and configure branch protection rules on ${connectedRepo.default_branch}.`,
          affectedRepositories: [connectedRepo.name],
          timestamp: new Date().toISOString(),
        });
      }

      insights.push({
        id: `ins-health-${connectedRepo.id}`,
        title: `Multi-Vector Engineering Health (${m.health_score}/100)`,
        description: `Repository score computed from ${m.recent_commits_count} commits, ${connectedRepo.stars} stars, and ${connectedRepo.top_contributors.length} contributors.`,
        category: 'quality',
        impact: 'medium',
        confidenceScore: 98,
        recommendation: 'Maintain steady commit velocity and resolve oldest open issues in the backlog.',
        affectedRepositories: [connectedRepo.name],
        timestamp: new Date().toISOString(),
      });

      return insights;
    }

    return new Promise((resolve) => {
      if (repo === 'all') {
        setTimeout(() => resolve(MOCK_AI_INSIGHTS), 40);
      } else {
        const filtered = MOCK_AI_INSIGHTS.filter((ins) =>
          ins.affectedRepositories.some((r) => r.toLowerCase().includes(repo.toLowerCase()))
        );
        setTimeout(() => resolve(filtered.length > 0 ? filtered : MOCK_AI_INSIGHTS.slice(0, 2)), 40);
      }
    });
  }

  public static async getRecentActivity(
    repo = 'all',
    connectedRepo?: ConnectedRepository | null
  ): Promise<EngineeringActivity[]> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      const acts: EngineeringActivity[] = [];
      for (const c of connectedRepo.recent_commits.slice(0, 8)) {
        acts.push({
          id: `act-c-${c.sha}`,
          type: 'commit',
          title: `Commit: ${c.message}`,
          description: `Pushed by ${c.author_name} to ${connectedRepo.default_branch}`,
          author: {
            name: c.author_name,
            avatar: c.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            handle: c.author_name.toLowerCase().replace(/\s+/g, '_'),
          },
          repository: connectedRepo.name,
          refId: c.sha,
          timestamp: c.date || new Date().toISOString(),
          status: 'success',
        });
      }
      return acts;
    }

    return new Promise((resolve) => {
      if (repo === 'all') {
        setTimeout(() => resolve(MOCK_ACTIVITIES), 40);
      } else {
        const filtered = MOCK_ACTIVITIES.filter((act) =>
          act.repository.toLowerCase().includes(repo.toLowerCase())
        );
        setTimeout(() => resolve(filtered.length > 0 ? filtered : MOCK_ACTIVITIES.slice(0, 2)), 40);
      }
    });
  }

  public static async getRisks(repo = 'all'): Promise<RiskItem[]> {
    return new Promise((resolve) => {
      if (repo === 'all') {
        setTimeout(() => resolve(MOCK_RISKS), 40);
      } else {
        const filtered = MOCK_RISKS.filter((r) =>
          r.repository.toLowerCase().includes(repo.toLowerCase())
        );
        setTimeout(() => resolve(filtered.length > 0 ? filtered : MOCK_RISKS.slice(0, 1)), 40);
      }
    });
  }

  public static async getDeployments(
    repo = 'all',
    connectedRepo?: ConnectedRepository | null
  ): Promise<DeploymentItem[]> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      if (connectedRepo.recent_workflows.length > 0) {
        return connectedRepo.recent_workflows.map((w, idx) => ({
          id: `dep-gh-${w.id}`,
          service: connectedRepo.name,
          version: `v1.0.${idx + 1}-${w.commit_sha}`,
          environment: 'production',
          status: w.conclusion === 'success' ? 'success' : w.conclusion === 'failure' ? 'failed' : 'building',
          deployedBy: connectedRepo.owner,
          commitSha: w.commit_sha,
          commitMessage: w.name,
          durationSeconds: 42,
          timestamp: w.created_at || new Date().toISOString(),
        }));
      }
    }

    return new Promise((resolve) => {
      if (repo === 'all') {
        setTimeout(() => resolve(MOCK_DEPLOYMENTS), 40);
      } else {
        const filtered = MOCK_DEPLOYMENTS.filter((d) =>
          d.service.toLowerCase().includes(repo.toLowerCase())
        );
        setTimeout(() => resolve(filtered.length > 0 ? filtered : MOCK_DEPLOYMENTS.slice(0, 2)), 40);
      }
    });
  }

  public static async getProjectHealthList(repo = 'all'): Promise<ProjectHealthOverview[]> {
    return new Promise((resolve) => {
      if (repo === 'all') {
        setTimeout(() => resolve(MOCK_PROJECT_HEALTH_LIST), 40);
      } else {
        const filtered = MOCK_PROJECT_HEALTH_LIST.filter((p) =>
          p.name.toLowerCase().includes(repo.toLowerCase()) || p.repository.toLowerCase().includes(repo.toLowerCase())
        );
        setTimeout(() => resolve(filtered.length > 0 ? filtered : MOCK_PROJECT_HEALTH_LIST), 40);
      }
    });
  }

  public static async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PROJECTS), 40);
    });
  }

  public static async getPipelineProjects(repo = 'all'): Promise<PipelineProject[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getFilteredPipelineProjects(repo)), 40);
    });
  }

  public static async getObservability(repo = 'all'): Promise<ObservabilityMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getObservabilityMetrics(repo)), 40);
    });
  }

  public static async getCodeIntelligence(
    repo = 'all',
    connectedRepo?: ConnectedRepository | null
  ): Promise<CodeIntelligenceMetrics> {
    if (connectedRepo && (connectedRepo.name === repo || connectedRepo.full_name === repo || repo.includes(connectedRepo.name))) {
      const topContribs = connectedRepo.top_contributors.map((c) => ({
        name: c.login,
        commits: c.contributions,
        avatar: c.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        prs: Math.max(1, Math.round(c.contributions * 0.4)),
      }));

      return {
        prsOpened: connectedRepo.metrics_summary.open_prs_count + 12,
        prsMerged: 18,
        prsClosed: 4,
        issuesCreated: connectedRepo.open_issues + 8,
        issuesClosed: 14,
        avgPrCycleTimeDays: Number((connectedRepo.metrics_summary.pr_cycle_time_hours / 24).toFixed(1)),
        reviewsDistribution: [
          { label: 'Approved', count: 18, color: '#10B981' },
          { label: 'Changes Requested', count: 8, color: '#F59E0B' },
          { label: 'Pending Review', count: connectedRepo.metrics_summary.open_prs_count, color: '#06B6D4' },
        ],
        topContributors: topContribs.length > 0 ? topContribs : [
          {
            name: connectedRepo.owner,
            avatar: connectedRepo.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            commits: 30,
            prs: 12,
          }
        ],
        weeklyActivity: [
          { week: 'W1', prsOpened: 6, prsMerged: 5, issuesCreated: 2, issuesClosed: 3 },
          { week: 'W2', prsOpened: 8, prsMerged: 7, issuesCreated: 4, issuesClosed: 5 },
          { week: 'W3', prsOpened: 11, prsMerged: 9, issuesCreated: 3, issuesClosed: 4 },
          { week: 'W4', prsOpened: connectedRepo.metrics_summary.open_prs_count + 5, prsMerged: 8, issuesCreated: 5, issuesClosed: 6 },
        ],
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(getCodeIntelligenceMetrics(repo)), 40);
    });
  }

  public static async getProductivityData(repo = 'all'): Promise<DeveloperProductivityData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getDeveloperProductivityData(repo)), 40);
    });
  }

  public static async getSecurityData(repo = 'all'): Promise<SecurityIntelligenceData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getSecurityIntelligenceData(repo)), 40);
    });
  }
}
