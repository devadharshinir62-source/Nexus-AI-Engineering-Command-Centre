import {
  MetricSummary,
  HealthMetricPoint,
  EngineeringActivity,
  AIInsight,
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

export const MOCK_METRICS: MetricSummary[] = [
  {
    id: 'project-health',
    title: 'Project Health',
    value: 94,
    unit: '/100',
    change: 3.4,
    trend: 'up',
    status: 'positive',
    timeframe: 'vs last sprint',
    description: 'Composite score based on test coverage, PR turnaround, and lint status',
  },
  {
    id: 'active-projects',
    title: 'Active Projects',
    value: 8,
    unit: 'repos',
    change: 1,
    trend: 'up',
    status: 'neutral',
    timeframe: 'connected repositories',
    description: 'Currently tracked and indexed code repositories',
  },
  {
    id: 'open-issues',
    title: 'Open Issues',
    value: 23,
    unit: 'items',
    change: -12.5,
    trend: 'down',
    status: 'positive',
    timeframe: 'vs last 7 days',
    description: 'Tracked engineering bugs and backlog issues across repositories',
  },
  {
    id: 'build-success-rate',
    title: 'Build Success Rate',
    value: '98.4%',
    unit: '',
    change: 1.2,
    trend: 'up',
    status: 'positive',
    timeframe: 'last 140 CI runs',
    description: 'Ratio of passing main pipeline workflows over the last 14 days',
  },
  {
    id: 'api-performance',
    title: 'API P99 Latency',
    value: '42ms',
    unit: '',
    change: -8.0,
    trend: 'down',
    status: 'positive',
    timeframe: 'edge gateway metrics',
    description: '99th percentile response time on core microservices',
  },
];

export const getFilteredMetrics = (repo = 'all'): MetricSummary[] => {
  if (repo === 'nexus-api-gateway') {
    return [
      { id: 'project-health', title: 'Project Health', value: 98, unit: '/100', change: 2.1, trend: 'up', status: 'positive', timeframe: 'vs last sprint', description: 'FastAPI gateway health score' },
      { id: 'active-projects', title: 'Active Branch', value: 'main', unit: '', change: 0, trend: 'neutral', status: 'neutral', timeframe: '3 active PRs', description: 'Selected repository' },
      { id: 'open-issues', title: 'Open Issues', value: 4, unit: 'items', change: -50.0, trend: 'down', status: 'positive', timeframe: 'vs last 7 days', description: 'Issues tracked in nexus-api-gateway' },
      { id: 'build-success-rate', title: 'Build Success Rate', value: '99.2%', unit: '', change: 0.8, trend: 'up', status: 'positive', timeframe: 'last 45 CI runs', description: 'Passing main pipeline workflows' },
      { id: 'api-performance', title: 'API P99 Latency', value: '18ms', unit: '', change: -12.0, trend: 'down', status: 'positive', timeframe: 'edge proxy latency', description: '99th percentile response time' },
    ];
  }
  if (repo === 'nexus-web-client') {
    return [
      { id: 'project-health', title: 'Project Health', value: 95, unit: '/100', change: 1.8, trend: 'up', status: 'positive', timeframe: 'vs last sprint', description: 'React dashboard health score' },
      { id: 'active-projects', title: 'Active Branch', value: 'main', unit: '', change: 0, trend: 'neutral', status: 'neutral', timeframe: '5 active PRs', description: 'Selected repository' },
      { id: 'open-issues', title: 'Open Issues', value: 6, unit: 'items', change: -25.0, trend: 'down', status: 'positive', timeframe: 'vs last 7 days', description: 'Issues tracked in nexus-web-client' },
      { id: 'build-success-rate', title: 'Build Success Rate', value: '97.8%', unit: '', change: 1.5, trend: 'up', status: 'positive', timeframe: 'last 52 CI runs', description: 'Passing Vite client workflows' },
      { id: 'api-performance', title: 'Bundle Load Time', value: '140ms', unit: '', change: -15.0, trend: 'down', status: 'positive', timeframe: 'client initial load', description: 'Initial render performance' },
    ];
  }
  if (repo === 'nexus-auth-core') {
    return [
      { id: 'project-health', title: 'Project Health', value: 84, unit: '/100', change: -4.2, trend: 'down', status: 'warning', timeframe: 'vs last sprint', description: 'Auth & JWT engine health score' },
      { id: 'active-projects', title: 'Active Branch', value: 'main', unit: '', change: 0, trend: 'neutral', status: 'neutral', timeframe: '4 active PRs', description: 'Selected repository' },
      { id: 'open-issues', title: 'Open Issues', value: 8, unit: 'items', change: 14.3, trend: 'up', status: 'warning', timeframe: 'vs last 7 days', description: 'Issues tracked in nexus-auth-core' },
      { id: 'build-success-rate', title: 'Build Success Rate', value: '94.5%', unit: '', change: -2.1, trend: 'down', status: 'warning', timeframe: 'last 38 CI runs', description: 'Passing security & auth suites' },
      { id: 'api-performance', title: 'JWT Sign Latency', value: '8ms', unit: '', change: 0, trend: 'neutral', status: 'positive', timeframe: 'RS256 token verification', description: 'Cryptographic token generation time' },
    ];
  }
  if (repo === 'nexus-billing-engine') {
    return [
      { id: 'project-health', title: 'Project Health', value: 78, unit: '/100', change: -8.5, trend: 'down', status: 'negative', timeframe: 'vs last sprint', description: 'Billing service health score' },
      { id: 'active-projects', title: 'Active Branch', value: 'main', unit: '', change: 0, trend: 'neutral', status: 'neutral', timeframe: '2 active PRs', description: 'Selected repository' },
      { id: 'open-issues', title: 'Open Issues', value: 5, unit: 'items', change: 25.0, trend: 'up', status: 'negative', timeframe: 'vs last 7 days', description: 'Issues tracked in nexus-billing-engine' },
      { id: 'build-success-rate', title: 'Build Success Rate', value: '88.0%', unit: '', change: -6.4, trend: 'down', status: 'negative', timeframe: 'last 28 CI runs', description: 'Failing Stripe webhook tests' },
      { id: 'api-performance', title: 'Webhook P99', value: '85ms', unit: '', change: 18.0, trend: 'up', status: 'warning', timeframe: 'Stripe ingestion', description: '99th percentile webhook response' },
    ];
  }
  return MOCK_METRICS;
};

export const MOCK_HEALTH_HISTORY: HealthMetricPoint[] = [
  { timestamp: '2026-08-21', date: 'Aug 21', healthScore: 88, velocity: 42, resolvedIssues: 5, testPassRate: 95.2 },
  { timestamp: '2026-08-22', date: 'Aug 22', healthScore: 89, velocity: 48, resolvedIssues: 8, testPassRate: 96.0 },
  { timestamp: '2026-08-23', date: 'Aug 23', healthScore: 87, velocity: 36, resolvedIssues: 3, testPassRate: 94.8 },
  { timestamp: '2026-08-24', date: 'Aug 24', healthScore: 91, velocity: 55, resolvedIssues: 12, testPassRate: 97.4 },
  { timestamp: '2026-08-25', date: 'Aug 25', healthScore: 93, velocity: 62, resolvedIssues: 14, testPassRate: 98.1 },
  { timestamp: '2026-08-26', date: 'Aug 26', healthScore: 92, velocity: 58, resolvedIssues: 9, testPassRate: 97.9 },
  { timestamp: '2026-08-27', date: 'Aug 27', healthScore: 94, velocity: 68, resolvedIssues: 16, testPassRate: 98.4 },
];

export const generateHealthHistory = (repo = 'all', timeRange: '7d' | '14d' | '30d' = '7d'): HealthMetricPoint[] => {
  const days = timeRange === '30d' ? 30 : timeRange === '14d' ? 14 : 7;
  const baseScore = repo === 'nexus-api-gateway' ? 96 : repo === 'nexus-web-client' ? 93 : repo === 'nexus-auth-core' ? 82 : repo === 'nexus-billing-engine' ? 76 : 89;
  const baseVelocity = repo === 'nexus-api-gateway' ? 60 : repo === 'nexus-web-client' ? 50 : repo === 'nexus-auth-core' ? 38 : repo === 'nexus-billing-engine' ? 30 : 48;
  const basePass = repo === 'nexus-api-gateway' ? 98.5 : repo === 'nexus-web-client' ? 96.0 : repo === 'nexus-auth-core' ? 92.0 : repo === 'nexus-billing-engine' ? 86.5 : 95.0;
  const baseDeploy = repo === 'nexus-api-gateway' ? 8 : repo === 'nexus-web-client' ? 6 : repo === 'nexus-auth-core' ? 4 : repo === 'nexus-billing-engine' ? 2 : 5;
  const baseCommits = repo === 'nexus-api-gateway' ? 34 : repo === 'nexus-web-client' ? 28 : repo === 'nexus-auth-core' ? 19 : repo === 'nexus-billing-engine' ? 14 : 25;
  const basePrHours = repo === 'nexus-api-gateway' ? 14.2 : repo === 'nexus-web-client' ? 18.5 : repo === 'nexus-auth-core' ? 38.4 : repo === 'nexus-billing-engine' ? 42.0 : 22.8;
  const baseLatency = repo === 'nexus-api-gateway' ? 18 : repo === 'nexus-web-client' ? 32 : repo === 'nexus-auth-core' ? 45 : repo === 'nexus-billing-engine' ? 85 : 42;
  const baseErrorRate = repo === 'nexus-api-gateway' ? 0.02 : repo === 'nexus-web-client' ? 0.08 : repo === 'nexus-auth-core' ? 0.45 : repo === 'nexus-billing-engine' ? 1.82 : 0.24;

  const results: HealthMetricPoint[] = [];
  const now = new Date('2026-08-27T00:00:00Z');

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const wave = Math.sin(i * 0.8) * 3 + Math.cos(i * 0.4) * 2;
    results.push({
      timestamp: d.toISOString().split('T')[0],
      date: dateStr,
      healthScore: Math.min(100, Math.max(60, Math.round(baseScore + wave))),
      velocity: Math.max(10, Math.round(baseVelocity + wave * 2)),
      resolvedIssues: Math.max(1, Math.round(8 + wave)),
      testPassRate: Math.min(100, Number((basePass + wave * 0.4).toFixed(1))),
      deploymentFrequency: Math.max(1, Math.round(baseDeploy + wave * 0.8)),
      codeCommits: Math.max(5, Math.round(baseCommits + wave * 3)),
      prCycleTimeHours: Math.max(4, Number((basePrHours - wave * 1.5).toFixed(1))),
      apiLatencyMs: Math.max(10, Math.round(baseLatency + wave * 4)),
      errorRatePercent: Math.max(0.01, Number((baseErrorRate + wave * 0.05).toFixed(2))),
    });
  }
  return results;
};

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    category: 'bottleneck',
    title: 'PR Review Bottleneck in Auth Service',
    description: 'Pull requests in nexus-auth-core are averaging 38.4 hours to merge due to single-reviewer dependencies on @alexc.',
    impact: 'high',
    recommendation: 'Redistribute code review assignments to include @sarah_k and enable automated review rotation rules.',
    affectedRepositories: ['nexus-auth-core', 'nexus-api-gateway'],
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    confidenceScore: 96,
  },
  {
    id: 'ins-2',
    category: 'security',
    title: 'Potential JWT Algorithm Confusion Detected',
    description: 'Recent commit to token parser does not enforce explicit algorithm whitelist in RS256 decoding verification.',
    impact: 'high',
    recommendation: 'Enforce algorithms=["RS256"] explicitly in jwt.decode call in token_manager.py:44.',
    affectedRepositories: ['nexus-auth-core'],
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    confidenceScore: 99,
  },
  {
    id: 'ins-3',
    category: 'quality',
    title: 'Test Coverage Drop on Payment Webhook Router',
    description: 'Coverage dropped from 94.2% to 81.0% following the recent Stripe webhook reconciliation refactor in PR #319.',
    impact: 'medium',
    recommendation: 'Add edge-case fixture tests covering duplicate event payload deduplication.',
    affectedRepositories: ['nexus-billing-engine'],
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    confidenceScore: 92,
  },
  {
    id: 'ins-4',
    category: 'velocity',
    title: 'Sprint Velocity Up 18% Following CI Caching Optimization',
    description: 'Pipeline run times decreased from 7m 45s to 2m 12s after Docker layer multi-stage caching was activated.',
    impact: 'low',
    recommendation: 'Apply equivalent cache strategies to the nexus-analytics-worker pipeline.',
    affectedRepositories: ['nexus-web-client', 'nexus-analytics-worker'],
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    confidenceScore: 94,
  },
];

export const MOCK_ACTIVITIES: EngineeringActivity[] = [
  {
    id: 'act-1',
    type: 'pull_request',
    title: 'Merged PR #412: Refactor distributed rate limiter to Redis Token Bucket',
    description: 'Improves burst tolerance under 50k req/s load tests with sub-millisecond lock acquisition.',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      handle: 'erostova',
    },
    repository: 'nexus-api-gateway',
    branch: 'main',
    refId: '#412',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'merged',
  },
  {
    id: 'act-2',
    type: 'deployment',
    title: 'Deployed v2.4.1 to Production (US-East-1)',
    description: '12 containers updated across ECS cluster. Zero downtime rolling update completed.',
    author: {
      name: 'Nexus CI/CD Bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      handle: 'nexus-bot',
    },
    repository: 'nexus-api-gateway',
    refId: 'v2.4.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    status: 'success',
  },
  {
    id: 'act-3',
    type: 'commit',
    title: 'fix(engine): resolve race condition in websocket heartbeat timeout',
    description: 'Add atomic check on client reconnect state before evicting socket session.',
    author: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      handle: 'mchen_dev',
    },
    repository: 'nexus-realtime-engine',
    branch: 'fix/ws-heartbeat',
    refId: '8f4c21a',
    timestamp: new Date(Date.now() - 1000 * 60 * 68).toISOString(),
    status: 'success',
  },
  {
    id: 'act-4',
    type: 'security_alert',
    title: 'Automated remediation generated for CVE-2026-2189',
    description: 'Dependency vulnerability in transitive parser updated from 3.1.0 to 3.1.4.',
    author: {
      name: 'Nexus Security Shield',
      avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
      handle: 'nexus-sec',
    },
    repository: 'nexus-billing-engine',
    refId: 'SEC-892',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    status: 'success',
  },
  {
    id: 'act-5',
    type: 'issue',
    title: 'Opened Issue #88: P99 latency spike during bulk webhook ingestion',
    description: 'Identified database thread pool exhaustion during batch partner sync.',
    author: {
      name: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      handle: 'dvance',
    },
    repository: 'nexus-data-pipeline',
    refId: '#88',
    timestamp: new Date(Date.now() - 1000 * 60 * 195).toISOString(),
    status: 'pending',
  },
];

export const MOCK_RISKS: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Stale High-Impact PR (#308) Pending Review > 5 Days',
    severity: 'high',
    category: 'pr_staleness',
    repository: 'nexus-billing-engine',
    details: 'Touches payment processing logic with 843 lines changed across 18 files.',
    detectedAt: '2026-08-25T10:00:00Z',
    status: 'open',
  },
  {
    id: 'risk-2',
    title: 'Flaky Integration Test Suite (TestAuthSessionReplay)',
    severity: 'medium',
    category: 'flaky_tests',
    repository: 'nexus-auth-core',
    details: 'Failed 4 out of last 22 CI pipeline runs due to asynchronous timing jitter.',
    detectedAt: '2026-08-26T14:30:00Z',
    status: 'investigating',
  },
  {
    id: 'risk-3',
    title: 'Deprecated cryptographic hash in legacy migration script',
    severity: 'low',
    category: 'dependency',
    repository: 'nexus-data-pipeline',
    details: 'SHA1 reference discovered in legacy migration file 0012_old_tokens.py.',
    detectedAt: '2026-08-27T08:15:00Z',
    status: 'open',
  },
];

export const MOCK_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: 'dep-1',
    service: 'nexus-api-gateway',
    environment: 'production',
    status: 'success',
    version: 'v2.4.1',
    commitSha: '9e1a8b2',
    commitMessage: 'feat(proxy): intelligent upstream load balancing',
    deployedBy: 'Elena Rostova',
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    durationSeconds: 142,
    deployUrl: 'https://api.nexus.internal',
  },
  {
    id: 'dep-2',
    service: 'nexus-web-client',
    environment: 'production',
    status: 'success',
    version: 'v1.18.0',
    commitSha: '4f28cb1',
    commitMessage: 'feat(ui): dark developer command center shell',
    deployedBy: 'Marcus Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    durationSeconds: 88,
    deployUrl: 'https://app.nexus.internal',
  },
  {
    id: 'dep-3',
    service: 'nexus-analytics-worker',
    environment: 'staging',
    status: 'building',
    version: 'v0.9.4-rc2',
    commitSha: '110d9fe',
    commitMessage: 'perf(worker): vectorize clickstream aggregations',
    deployedBy: 'David Vance',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    durationSeconds: 45,
  },
  {
    id: 'dep-4',
    service: 'nexus-billing-engine',
    environment: 'staging',
    status: 'failed',
    version: 'v2.1.0-beta',
    commitSha: 'a7b32ef',
    commitMessage: 'fix(stripe): webhook signature verification bug',
    deployedBy: 'Sarah Kim',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    durationSeconds: 195,
  },
];

export const MOCK_PROJECT_HEALTH_LIST: ProjectHealthOverview[] = [
  {
    id: 'proj-1',
    name: 'nexus-api-gateway',
    repository: 'nexus-ai/nexus-api-gateway',
    healthScore: 98,
    status: 'optimal',
    activeBranch: 'main',
    openPRs: 3,
    openIssues: 4,
    buildStatus: 'passing',
    lastCommitTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    contributorsCount: 14,
    coveragePercent: 94.6,
  },
  {
    id: 'proj-2',
    name: 'nexus-web-client',
    repository: 'nexus-ai/nexus-web-client',
    healthScore: 95,
    status: 'optimal',
    activeBranch: 'main',
    openPRs: 5,
    openIssues: 6,
    buildStatus: 'passing',
    lastCommitTime: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    contributorsCount: 18,
    coveragePercent: 91.2,
  },
  {
    id: 'proj-3',
    name: 'nexus-auth-core',
    repository: 'nexus-ai/nexus-auth-core',
    healthScore: 84,
    status: 'warning',
    activeBranch: 'main',
    openPRs: 4,
    openIssues: 8,
    buildStatus: 'passing',
    lastCommitTime: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    contributorsCount: 8,
    coveragePercent: 88.0,
  },
  {
    id: 'proj-4',
    name: 'nexus-billing-engine',
    repository: 'nexus-ai/nexus-billing-engine',
    healthScore: 78,
    status: 'warning',
    activeBranch: 'main',
    openPRs: 2,
    openIssues: 5,
    buildStatus: 'failing',
    lastCommitTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    contributorsCount: 6,
    coveragePercent: 81.0,
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'nexus-api-gateway',
    slug: 'nexus-api-gateway',
    description: 'High-throughput asynchronous API gateway and rate-limiting proxy with WebSocket multiplexing.',
    repositoryUrl: 'https://github.com/nexus-ai/nexus-api-gateway',
    provider: 'github',
    defaultBranch: 'main',
    language: 'Python',
    healthScore: 98,
    openIssuesCount: 4,
    openPullRequestsCount: 3,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    starsCount: 342,
    forksCount: 48,
    tags: ['FastAPI', 'Redis', 'High Performance'],
    activeContributors: 14,
    isFavorite: true,
  },
  {
    id: 'p2',
    name: 'nexus-web-client',
    slug: 'nexus-web-client',
    description: 'Modern developer dashboard and command center built with React, Vite, Tailwind CSS, and TypeScript.',
    repositoryUrl: 'https://github.com/nexus-ai/nexus-web-client',
    provider: 'github',
    defaultBranch: 'main',
    language: 'TypeScript',
    healthScore: 95,
    openIssuesCount: 6,
    openPullRequestsCount: 5,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    starsCount: 512,
    forksCount: 64,
    tags: ['React', 'TypeScript', 'Tailwind'],
    activeContributors: 18,
    isFavorite: true,
  },
  {
    id: 'p3',
    name: 'nexus-auth-core',
    slug: 'nexus-auth-core',
    description: 'Enterprise SSO, RBAC permission engine, and cryptographic JWT issuance service.',
    repositoryUrl: 'https://github.com/nexus-ai/nexus-auth-core',
    provider: 'github',
    defaultBranch: 'main',
    language: 'Python',
    healthScore: 84,
    openIssuesCount: 8,
    openPullRequestsCount: 4,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    starsCount: 190,
    forksCount: 22,
    tags: ['Security', 'OAuth2', 'JWT'],
    activeContributors: 8,
    isFavorite: false,
  },
  {
    id: 'p4',
    name: 'nexus-billing-engine',
    slug: 'nexus-billing-engine',
    description: 'Subscription lifecycle, usage-based metering, Stripe webhook synchronizer, and invoice generator.',
    repositoryUrl: 'https://github.com/nexus-ai/nexus-billing-engine',
    provider: 'github',
    defaultBranch: 'main',
    language: 'Go',
    healthScore: 78,
    openIssuesCount: 5,
    openPullRequestsCount: 2,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    starsCount: 145,
    forksCount: 19,
    tags: ['Billing', 'Stripe', 'FinTech'],
    activeContributors: 6,
    isFavorite: false,
  },
];

// ==========================================
// WORKFLOW PIPELINE PROJECTS
// ==========================================
export const MOCK_PIPELINE_PROJECTS: PipelineProject[] = [
  {
    id: 'pipe-1',
    name: 'Project Alpha (NLP Router)',
    repository: 'nexus-api-gateway',
    stage: 'research',
    progressPercent: 25,
    owner: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Staff ML Engineer' },
    dueDate: 'Sep 15, 2026',
    healthScore: 94,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'Evaluating token routing optimizations across multi-region LLM inferencing clusters.',
    tags: ['NLP', 'Token Bucket', 'Python'],
  },
  {
    id: 'pipe-2',
    name: 'Project Beta (Vision Cache)',
    repository: 'nexus-web-client',
    stage: 'research',
    progressPercent: 30,
    owner: { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Frontend Lead' },
    dueDate: 'Sep 20, 2026',
    healthScore: 91,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'Benchmarking WebAssembly GPU canvas caching for real-time telemetry streaming.',
    tags: ['WASM', 'WebGL', 'Canvas'],
  },
  {
    id: 'pipe-3',
    name: 'Project Delta (Recommender)',
    repository: 'nexus-api-gateway',
    stage: 'development',
    progressPercent: 68,
    owner: { name: 'David Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Backend Engineer' },
    dueDate: 'Oct 01, 2026',
    healthScore: 92,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'Real-time contextual recommendation engine leveraging vector embeddings and Redis.',
    tags: ['Redis', 'FastAPI', 'Vectors'],
  },
  {
    id: 'pipe-4',
    name: 'Project Epsilon (Fraud Shield)',
    repository: 'nexus-billing-engine',
    stage: 'development',
    progressPercent: 55,
    owner: { name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Security Architect' },
    dueDate: 'Oct 07, 2026',
    healthScore: 78,
    riskLevel: 'high',
    buildStatus: 'building',
    deploymentStatus: 'pending',
    description: 'Heuristic anomaly detection for webhook idempotency and token replay attacks.',
    tags: ['Security', 'Stripe', 'Go'],
  },
  {
    id: 'pipe-5',
    name: 'Project Zeta (Chatbot V2)',
    repository: 'nexus-web-client',
    stage: 'development',
    progressPercent: 80,
    owner: { name: 'Devadharshini R', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', role: 'Engineering Lead' },
    dueDate: 'Sep 19, 2026',
    healthScore: 96,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'Neural conversation drawer with streaming Markdown syntax highlighting and code execution.',
    tags: ['React', 'AI', 'Streaming'],
  },
  {
    id: 'pipe-6',
    name: 'Project Theta (Speech-to-Text)',
    repository: 'nexus-api-gateway',
    stage: 'review',
    progressPercent: 88,
    owner: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', role: 'Lead Architect' },
    dueDate: 'Sep 12, 2026',
    healthScore: 89,
    riskLevel: 'medium',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'WebSocket duplex audio streaming with whisper.cpp transcription server.',
    tags: ['C++', 'WebSocket', 'Speech'],
  },
  {
    id: 'pipe-7',
    name: 'Project Iota (Auth Cryptography)',
    repository: 'nexus-auth-core',
    stage: 'security_review',
    progressPercent: 92,
    owner: { name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Security Architect' },
    dueDate: 'Sep 10, 2026',
    healthScore: 84,
    riskLevel: 'high',
    buildStatus: 'passing',
    deploymentStatus: 'pending',
    description: 'Rigorous RS256 token verification audit and algorithm confusion attack prevention.',
    tags: ['JWT', 'Crypto', 'Audit'],
  },
  {
    id: 'pipe-8',
    name: 'Project Kappa (Sentiment Engine)',
    repository: 'nexus-api-gateway',
    stage: 'staging',
    progressPercent: 95,
    owner: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Staff ML Engineer' },
    dueDate: 'Sep 08, 2026',
    healthScore: 98,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'staging',
    description: 'Canary release running on Staging-US-East with 10% live customer traffic mirror.',
    tags: ['Canary', 'Prometheus', 'ML'],
  },
  {
    id: 'pipe-9',
    name: 'Project Lambda (Anomaly Radar)',
    repository: 'nexus-api-gateway',
    stage: 'production',
    progressPercent: 100,
    owner: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', role: 'Lead Architect' },
    dueDate: 'Sep 01, 2026',
    healthScore: 99,
    riskLevel: 'low',
    buildStatus: 'passing',
    deploymentStatus: 'deployed',
    description: 'Live in Production ECS Cluster. P99 latency stable at 18ms under 40k req/sec.',
    tags: ['Production', 'Live', 'ECS'],
  },
  {
    id: 'pipe-10',
    name: 'Project Mu (Billing Reconciliation)',
    repository: 'nexus-billing-engine',
    stage: 'production',
    progressPercent: 100,
    owner: { name: 'David Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Backend Engineer' },
    dueDate: 'Aug 28, 2026',
    healthScore: 82,
    riskLevel: 'medium',
    buildStatus: 'passing',
    deploymentStatus: 'deployed',
    description: 'Automated nightly ledger audit against Stripe Connect API.',
    tags: ['Stripe', 'Audit', 'Ledger'],
  },
];

export const getFilteredPipelineProjects = (repo = 'all'): PipelineProject[] => {
  if (repo === 'all') return MOCK_PIPELINE_PROJECTS;
  return MOCK_PIPELINE_PROJECTS.filter((p) => p.repository === repo);
};

// ==========================================
// SERVICE OBSERVABILITY METRICS
// ==========================================
export const getObservabilityMetrics = (repo = 'all'): ObservabilityMetrics => {
  if (repo === 'nexus-api-gateway') {
    return {
      detectedProblems: 0,
      totalRequests: '42.15k',
      requestsGrowth: 14.2,
      avgResponseTimeMs: 12.4,
      p95LatencyMs: 15.2,
      p99LatencyMs: 18.0,
      errorRatePercent: 0.02,
      throughputReqSec: 684.2,
      runningRequests: 218,
      cacheUtilizationPercent: 94.8,
      tokenConsumption: '1.24M tokens',
      serviceHealthStatus: 'optimal',
    };
  }
  if (repo === 'nexus-web-client') {
    return {
      detectedProblems: 1,
      totalRequests: '28.90k',
      requestsGrowth: 8.5,
      avgResponseTimeMs: 45.2,
      p95LatencyMs: 92.0,
      p99LatencyMs: 140.0,
      errorRatePercent: 0.08,
      throughputReqSec: 342.1,
      runningRequests: 142,
      cacheUtilizationPercent: 88.5,
      tokenConsumption: '480k tokens',
      serviceHealthStatus: 'optimal',
    };
  }
  if (repo === 'nexus-auth-core') {
    return {
      detectedProblems: 2,
      totalRequests: '19.40k',
      requestsGrowth: -2.4,
      avgResponseTimeMs: 8.2,
      p95LatencyMs: 24.5,
      p99LatencyMs: 45.0,
      errorRatePercent: 0.45,
      throughputReqSec: 215.0,
      runningRequests: 86,
      cacheUtilizationPercent: 78.2,
      tokenConsumption: '120k tokens',
      serviceHealthStatus: 'degraded',
    };
  }
  if (repo === 'nexus-billing-engine') {
    return {
      detectedProblems: 4,
      totalRequests: '14.20k',
      requestsGrowth: 6.8,
      avgResponseTimeMs: 38.5,
      p95LatencyMs: 64.0,
      p99LatencyMs: 85.0,
      errorRatePercent: 1.82,
      throughputReqSec: 145.8,
      runningRequests: 94,
      cacheUtilizationPercent: 62.4,
      tokenConsumption: '320k tokens',
      serviceHealthStatus: 'critical',
    };
  }
  return {
    detectedProblems: 4,
    totalRequests: '104.65k',
    requestsGrowth: 10.43,
    avgResponseTimeMs: 24.8,
    p95LatencyMs: 48.0,
    p99LatencyMs: 82.0,
    errorRatePercent: 0.47,
    throughputReqSec: 514.44,
    runningRequests: 532,
    cacheUtilizationPercent: 84.6,
    tokenConsumption: '2.16M tokens',
    serviceHealthStatus: 'optimal',
  };
};

// ==========================================
// CODE INTELLIGENCE METRICS
// ==========================================
export const getCodeIntelligenceMetrics = (repo = 'all'): CodeIntelligenceMetrics => {
  const isAll = repo === 'all';
  return {
    prsOpened: isAll ? 70 : repo === 'nexus-api-gateway' ? 24 : repo === 'nexus-web-client' ? 28 : repo === 'nexus-auth-core' ? 12 : 6,
    prsMerged: isAll ? 68 : repo === 'nexus-api-gateway' ? 22 : repo === 'nexus-web-client' ? 26 : repo === 'nexus-auth-core' ? 11 : 5,
    prsClosed: isAll ? 2 : repo === 'nexus-api-gateway' ? 1 : 1,
    issuesCreated: isAll ? 8 : repo === 'nexus-api-gateway' ? 2 : repo === 'nexus-web-client' ? 3 : 2,
    issuesClosed: isAll ? 4 : repo === 'nexus-api-gateway' ? 2 : repo === 'nexus-web-client' ? 1 : 1,
    avgPrCycleTimeDays: repo === 'nexus-api-gateway' ? 0.35 : repo === 'nexus-web-client' ? 0.42 : repo === 'nexus-auth-core' ? 1.6 : 1.8,
    reviewsDistribution: [
      { label: '0 Reviews', count: isAll ? 4 : 1, color: '#3B82F6' },
      { label: '1 Review', count: isAll ? 22 : 8, color: '#10B981' },
      { label: '2 Reviews', count: isAll ? 34 : 12, color: '#06B6D4' },
      { label: '3 Reviews', count: isAll ? 8 : 3, color: '#F59E0B' },
      { label: '4+ Reviews', count: isAll ? 2 : 1, color: '#EF4444' },
    ],
    topContributors: [
      { name: 'Elena Rostova', commits: 48, prs: 14, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { name: 'Marcus Chen', commits: 36, prs: 11, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { name: 'Devadharshini R', commits: 32, prs: 10, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      { name: 'David Vance', commits: 24, prs: 8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { name: 'Sarah Kim', commits: 19, prs: 6, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    ],
    weeklyActivity: [
      { week: 'Feb 20', prsOpened: 24, prsMerged: 22, issuesCreated: 2, issuesClosed: 2 },
      { week: 'Feb 27', prsOpened: 22, prsMerged: 21, issuesCreated: 6, issuesClosed: 4 },
      { week: 'Mar 06', prsOpened: 16, prsMerged: 15, issuesCreated: 3, issuesClosed: 2 },
      { week: 'Mar 13', prsOpened: 6, prsMerged: 4, issuesCreated: 2, issuesClosed: 1 },
      { week: 'Mar 20', prsOpened: 4, prsMerged: 4, issuesCreated: 1, issuesClosed: 1 },
    ],
  };
};

// ==========================================
// DEVELOPER PRODUCTIVITY & DORA METRICS
// ==========================================
export const getDeveloperProductivityData = (repo = 'all'): DeveloperProductivityData => {
  const isAll = repo === 'all';
  return {
    totalCommits: isAll ? 326 : repo === 'nexus-api-gateway' ? 142 : repo === 'nexus-web-client' ? 98 : 45,
    linesChanged: isAll ? '+18.4k / -4.2k' : '+6.8k / -1.4k',
    prsCreated: isAll ? 70 : 24,
    prsMerged: isAll ? 68 : 22,
    reviewsCompleted: isAll ? 142 : 56,
    issuesResolved: isAll ? 48 : 18,
    leadTimeHours: repo === 'nexus-api-gateway' ? 8.5 : repo === 'nexus-auth-core' ? 24.2 : 14.4,
    cycleTimeHours: repo === 'nexus-api-gateway' ? 4.2 : repo === 'nexus-auth-core' ? 12.8 : 6.1,
    changeFailureRatePercent: repo === 'nexus-api-gateway' ? 0.5 : repo === 'nexus-billing-engine' ? 4.5 : 2.0,
    mttrHours: repo === 'nexus-api-gateway' ? 0.8 : repo === 'nexus-billing-engine' ? 3.5 : 1.8,
    commitTimeline: [
      { month: 'Jan', commits: 42 },
      { month: 'Feb', commits: 98 },
      { month: 'Mar', commits: 86 },
      { month: 'Apr', commits: 142 },
      { month: 'May', commits: 215 },
      { month: 'Jun', commits: 326 },
    ],
    workloadDistribution: [
      { name: 'Elena Rostova', activePRs: 3, reviewsPending: 1, velocityScore: 94 },
      { name: 'Marcus Chen', activePRs: 2, reviewsPending: 2, velocityScore: 91 },
      { name: 'Devadharshini R', activePRs: 4, reviewsPending: 2, velocityScore: 96 },
      { name: 'David Vance', activePRs: 2, reviewsPending: 4, velocityScore: 84 },
      { name: 'Sarah Kim', activePRs: 1, reviewsPending: 5, velocityScore: 88 },
    ],
  };
};

// ==========================================
// SECURITY INTELLIGENCE DATA
// ==========================================
export const getSecurityIntelligenceData = (repo = 'all'): SecurityIntelligenceData => {
  const isAll = repo === 'all';
  return {
    criticalCount: isAll ? 1 : repo === 'nexus-auth-core' ? 1 : 0,
    highCount: isAll ? 3 : repo === 'nexus-billing-engine' ? 2 : repo === 'nexus-auth-core' ? 1 : 0,
    mediumCount: isAll ? 6 : repo === 'nexus-web-client' ? 3 : 2,
    secretsDetectedCount: 0,
    dependenciesScanned: isAll ? 1482 : 380,
    vulnerabilities: [
      {
        id: 'sec-1',
        cve: 'CVE-2026-2189',
        severity: 'critical' as const,
        repository: 'nexus-auth-core',
        package: 'pyjwt-core',
        vulnerableVersions: '< 2.9.2',
        patchedVersion: '>= 2.9.2',
        description: 'Key confusion in RS256 token verification when algorithm parameter is not pinned in verify header.',
        detectedDate: '2026-08-27',
        status: 'open' as const,
        remediation: 'Upgrade pyjwt-core to 2.9.2 and specify explicit algorithms=["RS256"] in token decoder.',
      },
      {
        id: 'sec-2',
        cve: 'CVE-2026-1840',
        severity: 'high' as const,
        repository: 'nexus-billing-engine',
        package: 'stripe-go-webhook',
        vulnerableVersions: '< 1.4.0',
        patchedVersion: '>= 1.4.1',
        description: 'Timing discrepancy in webhook signature HMAC verification allowing side-channel inference.',
        detectedDate: '2026-08-26',
        status: 'triaged' as const,
        remediation: 'Apply constant-time hmac.Equal comparison during webhook header authentication.',
      },
      {
        id: 'sec-3',
        cve: 'CVE-2026-0912',
        severity: 'medium' as const,
        repository: 'nexus-web-client',
        package: 'dompurify-lite',
        vulnerableVersions: '< 3.0.6',
        patchedVersion: '>= 3.0.7',
        description: 'Mutation XSS bypass in nested SVG foreignObject tag serialization.',
        detectedDate: '2026-08-25',
        status: 'patch_pending' as const,
        remediation: 'Update package.json dompurify dependency to latest semantic release 3.0.7.',
      },
    ].filter((v) => isAll || v.repository === repo),
  };
};

export const getFilteredDeployments = (repo = 'all'): DeploymentItem[] => {
  if (repo === 'all') return MOCK_DEPLOYMENTS;
  return MOCK_DEPLOYMENTS.filter((d) => d.service === repo);
};

