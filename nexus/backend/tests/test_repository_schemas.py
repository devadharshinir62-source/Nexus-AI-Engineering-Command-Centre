"""
Tests for Repository Schemas and Data Models.
"""

import pytest
from pydantic import ValidationError
from app.schemas.repository import (
    RepositoryConnectRequest,
    ConnectedRepositoryResponse,
    HealthBreakdown,
    RepositoryMetricsSummary,
)


class TestRepositorySchemas:
    def test_repository_connect_request_valid(self):
        req = RepositoryConnectRequest(url="https://github.com/facebook/react")
        assert req.url == "https://github.com/facebook/react"

    def test_repository_connect_request_missing_url(self):
        with pytest.raises(ValidationError):
            RepositoryConnectRequest()

    def test_health_breakdown_schema(self):
        health = HealthBreakdown(
            health_score=87,
            code_activity=95,
            pull_request_health=80,
            issue_health=75,
            ci_health=100,
            maintenance=98,
            release_health=95,
            security_health=90,
        )
        assert health.health_score == 87
        assert health.ci_health == 100

    def test_connected_repository_response_schema(self):
        repo_data = {
            "id": "gh-10270250",
            "name": "react",
            "full_name": "facebook/react",
            "owner": "facebook",
            "url": "https://github.com/facebook/react",
            "default_branch": "main",
            "language": "JavaScript",
            "stars": 225000,
            "forks": 45000,
            "open_issues": 850,
            "watchers": 225000,
            "is_private": False,
            "size": 185000,
            "health": {
                "health_score": 87,
                "code_activity": 95,
                "pull_request_health": 80,
                "issue_health": 75,
                "ci_health": 100,
                "maintenance": 98,
                "release_health": 95,
                "security_health": 90,
            },
            "metrics_summary": {
                "health_score": 87,
                "velocity_pts": 99,
                "test_pass_rate": 100.0,
                "pr_cycle_time_hours": 14.8,
                "recent_commits_count": 30,
                "open_prs_count": 5,
                "releases_count": 10,
                "contributors_count": 10,
            },
            "recent_commits": [],
            "recent_pull_requests": [],
            "recent_releases": [],
            "recent_workflows": [],
            "top_contributors": [],
            "branches": ["main"],
            "is_real_github": True,
            "analyzed_at": "2026-08-30T10:00:00Z",
        }
        res = ConnectedRepositoryResponse.model_validate(repo_data)
        assert res.name == "react"
        assert res.stars == 225000
        assert res.health.health_score == 87
        assert res.is_real_github is True
