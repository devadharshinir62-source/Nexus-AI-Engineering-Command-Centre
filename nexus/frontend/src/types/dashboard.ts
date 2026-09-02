export type HealthStatus = 'optimal' | 'healthy' | 'warning' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ActivityType = 'commit' | 'pull_request' | 'deployment' | 'security_alert' | 'issue' | 'review';
export type DeploymentEnvironment = 'production' | 'staging' | 'preview';
export type DeploymentStatus = 'success' | 'building' | 'failed' | 'cancelled' | 'rollback';
export type PipelineStage = 'research' | 'development' | 'review' | 'security_review' | 'staging' | 'production';

export interface MetricSummary {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change: number; // percentage change e.g. +4.2 or -1.5
  trend: 'up' | 'down' | 'neutral';
  status: 'positive' | 'warning' | 'negative' | 'neutral';
  timeframe: string;
  description: string;
}

export interface HealthMetricPoint {
  timestamp: string;
  date: string;
  healthScore: number;
  velocity: number;
  resolvedIssues: number;
  testPassRate: number;
  deploymentFrequency?: number;
  codeCommits?: number;
  prCycleTimeHours?: number;
  apiLatencyMs?: number;
  errorRatePercent?: number;
}

export interface EngineeringActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  repository: string;
  branch?: string;
  refId?: string; // e.g. #482 or git sha
  timestamp: string;
  status?: 'success' | 'pending' | 'failed' | 'merged';
}

export interface AIInsight {
  id: string;
  category: 'bottleneck' | 'security' | 'architecture' | 'velocity' | 'quality' | 'performance' | 'reliability' | 'deployment';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  affectedRepositories: string[];
  timestamp: string;
  confidenceScore: number; // 0 to 100
  evidence?: string[];
  estimatedImpact?: string;
  isRead?: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: RiskLevel;
  category: 'code_decay' | 'flaky_tests' | 'dependency' | 'pr_staleness' | 'coverage_drop' | 'cve';
  repository: string;
  details: string;
  detectedAt: string;
  status: 'open' | 'investigating' | 'mitigated';
}

export interface DeploymentItem {
  id: string;
  service: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  version: string;
  commitSha: string;
  commitMessage: string;
  deployedBy: string;
  timestamp: string;
  durationSeconds: number;
  deployUrl?: string;
  logsSummary?: string[];
  riskAssessment?: 'Low Risk' | 'Medium Risk' | 'High Risk';
  relatedPR?: string;
  relatedIssues?: string[];
}

export interface ProjectHealthOverview {
  id: string;
  name: string;
  repository: string;
  healthScore: number; // 0 - 100
  status: HealthStatus;
  activeBranch: string;
  openPRs: number;
  openIssues: number;
  buildStatus: 'passing' | 'failing' | 'running';
  lastCommitTime: string;
  contributorsCount: number;
  coveragePercent: number;
}

export interface PipelineProject {
  id: string;
  name: string;
  repository: string;
  stage: PipelineStage;
  progressPercent: number;
  owner: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  healthScore: number;
  riskLevel: RiskLevel;
  buildStatus: 'passing' | 'failing' | 'building';
  deploymentStatus: 'deployed' | 'pending' | 'failed' | 'staging';
  description: string;
  tags: string[];
}

export interface ObservabilityMetrics {
  detectedProblems: number;
  totalRequests: string;
  requestsGrowth: number;
  avgResponseTimeMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  throughputReqSec: number;
  runningRequests: number;
  cacheUtilizationPercent: number;
  tokenConsumption?: string;
  serviceHealthStatus: 'optimal' | 'degraded' | 'critical';
}

export interface CodeIntelligenceMetrics {
  prsOpened: number;
  prsMerged: number;
  prsClosed: number;
  issuesCreated: number;
  issuesClosed: number;
  avgPrCycleTimeDays: number;
  reviewsDistribution: { label: string; count: number; color: string }[];
  topContributors: { name: string; commits: number; avatar: string; prs: number }[];
  weeklyActivity: { week: string; prsOpened: number; prsMerged: number; issuesCreated: number; issuesClosed: number }[];
}

export interface DeveloperProductivityData {
  totalCommits: number;
  linesChanged: string;
  prsCreated: number;
  prsMerged: number;
  reviewsCompleted: number;
  issuesResolved: number;
  leadTimeHours: number;
  cycleTimeHours: number;
  changeFailureRatePercent: number;
  mttrHours: number;
  commitTimeline: { month: string; commits: number }[];
  workloadDistribution: { name: string; activePRs: number; reviewsPending: number; velocityScore: number }[];
}

export interface SecurityIntelligenceData {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  secretsDetectedCount: number;
  dependenciesScanned: number;
  vulnerabilities: {
    id: string;
    cve: string;
    severity: RiskLevel;
    repository: string;
    package: string;
    vulnerableVersions: string;
    patchedVersion: string;
    description: string;
    detectedDate: string;
    status: 'open' | 'triaged' | 'patch_pending' | 'resolved';
    remediation: string;
  }[];
}
