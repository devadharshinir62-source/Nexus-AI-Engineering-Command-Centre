export interface RepositoryHealthData {
  health_score: number;
  code_activity: number;
  pull_request_health: number;
  issue_health: number;
  ci_health: number;
  maintenance: number;
  release_health: number;
  security_health: number;
}

export interface RepositoryMetricsSummary {
  health_score: number;
  velocity_pts: number;
  test_pass_rate: number;
  pr_cycle_time_hours: number;
  recent_commits_count: number;
  open_prs_count: number;
  releases_count: number;
  contributors_count: number;
}

export interface GitHubCommitItem {
  sha: string;
  message: string;
  author_name: string;
  author_avatar?: string;
  date: string;
  html_url?: string;
}

export interface GitHubPullRequestItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: string;
  avatar_url?: string;
  created_at: string;
  merged_at?: string;
  html_url?: string;
}

export interface GitHubReleaseItem {
  tag_name: string;
  name: string;
  published_at: string;
  html_url?: string;
}

export interface GitHubWorkflowRunItem {
  id: number;
  name: string;
  status: string;
  conclusion: 'success' | 'failure' | 'cancelled' | string;
  branch: string;
  commit_sha: string;
  created_at: string;
  html_url?: string;
}

export interface GitHubContributorItem {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface ConnectedRepository {
  id: string;
  name: string;
  full_name: string;
  owner: string;
  owner_avatar?: string;
  url: string;
  description?: string;
  default_branch: string;
  language: string;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  is_private: boolean;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  size: number;
  license?: string;
  health: RepositoryHealthData;
  metrics_summary: RepositoryMetricsSummary;
  recent_commits: GitHubCommitItem[];
  recent_pull_requests: GitHubPullRequestItem[];
  recent_releases: GitHubReleaseItem[];
  recent_workflows: GitHubWorkflowRunItem[];
  top_contributors: GitHubContributorItem[];
  branches: string[];
  is_real_github: boolean;
  analyzed_at: string;
}
