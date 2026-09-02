from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RepositoryConnectRequest(BaseModel):
    url: str = Field(
        ...,
        description="Public GitHub repository URL (e.g. https://github.com/facebook/react or owner/repo)",
        examples=["https://github.com/facebook/react"],
    )


class HealthBreakdown(BaseModel):
    health_score: int
    code_activity: int
    pull_request_health: int
    issue_health: int
    ci_health: int
    maintenance: int
    release_health: int
    security_health: int


class RepositoryMetricsSummary(BaseModel):
    health_score: int
    velocity_pts: int
    test_pass_rate: float
    pr_cycle_time_hours: float
    recent_commits_count: int
    open_prs_count: int
    releases_count: int
    contributors_count: int


class ConnectedRepositoryResponse(BaseModel):
    id: str
    name: str
    full_name: str
    owner: str
    owner_avatar: Optional[str] = None
    url: str
    description: Optional[str] = None
    default_branch: str = "main"
    language: Optional[str] = "Codebase"
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    watchers: int = 0
    is_private: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    pushed_at: Optional[str] = None
    size: int = 0
    license: Optional[str] = "None"
    health: HealthBreakdown
    metrics_summary: RepositoryMetricsSummary
    recent_commits: List[Dict[str, Any]] = []
    recent_pull_requests: List[Dict[str, Any]] = []
    recent_releases: List[Dict[str, Any]] = []
    recent_workflows: List[Dict[str, Any]] = []
    top_contributors: List[Dict[str, Any]] = []
    branches: List[str] = []
    is_real_github: bool = True
    analyzed_at: str
