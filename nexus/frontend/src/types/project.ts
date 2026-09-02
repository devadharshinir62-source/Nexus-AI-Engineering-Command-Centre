export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  repositoryUrl: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  defaultBranch: string;
  language: string;
  healthScore: number;
  openIssuesCount: number;
  openPullRequestsCount: number;
  lastSyncedAt: string;
  starsCount: number;
  forksCount: number;
  tags: string[];
  activeContributors: number;
  isFavorite?: boolean;
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  commitsCount: number;
  prsReviewed: number;
  impactScore: number;
  status: 'active' | 'idle' | 'away';
}
