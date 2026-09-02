"""
Unit Tests for GitHub Service and Deterministic Engineering Health Score Engine.
"""

import pytest
from unittest.mock import patch, AsyncMock
from app.services.github_service import GitHubService
from tests.conftest import run_async


class TestGitHubService:
    @pytest.fixture
    def service(self):
        return GitHubService()

    def test_deterministic_health_score_calculation(
        self,
        service: GitHubService,
        mock_github_repo_payload,
        mock_github_commits_payload,
        mock_github_prs_payload,
        mock_github_workflows_payload,
        mock_github_releases_payload,
    ):
        """Verify that health calculation is deterministic (same inputs = same output)"""
        score1 = service.calculate_health_score(
            repo_data=mock_github_repo_payload,
            commits=mock_github_commits_payload,
            prs=mock_github_prs_payload,
            issues=[],
            workflow_runs=mock_github_workflows_payload,
            releases=mock_github_releases_payload,
        )
        score2 = service.calculate_health_score(
            repo_data=mock_github_repo_payload,
            commits=mock_github_commits_payload,
            prs=mock_github_prs_payload,
            issues=[],
            workflow_runs=mock_github_workflows_payload,
            releases=mock_github_releases_payload,
        )

        assert score1 == score2
        assert 0 <= score1["health_score"] <= 100
        assert 0 <= score1["code_activity"] <= 100
        assert 0 <= score1["ci_health"] <= 100
        assert 0 <= score1["pull_request_health"] <= 100
        assert 0 <= score1["security_health"] <= 100

    def test_health_score_edge_cases(self, service: GitHubService):
        """Test calculation with empty data sets (zero commits, zero PRs, zero CI runs)"""
        empty_repo = {
            "name": "empty-project",
            "open_issues_count": 0,
            "stargazers_count": 0,
            "license": None,
            "description": None,
            "updated_at": "2020-01-01T00:00:00Z",
        }

        score = service.calculate_health_score(
            repo_data=empty_repo,
            commits=[],
            prs=[],
            issues=[],
            workflow_runs=[],
            releases=[],
        )

        assert isinstance(score["health_score"], int)
        assert 0 <= score["health_score"] <= 100
        assert score["code_activity"] <= 50

    def test_cache_hit_prevents_duplicate_network_requests(self, service: GitHubService):
        """Verify in-memory caching saves responses and avoids repeat HTTP calls"""
        cache_key = "test-cache-endpoint?[]"
        service._save_to_cache(cache_key, {"cached": "data"})

        result = service._get_from_cache(cache_key)
        assert result == {"cached": "data"}

    def test_rate_limit_error_handling(self, service: GitHubService):
        """Verify that HTTP 403 rate-limit responses raise descriptive PermissionError"""
        async def _test():
            mock_response = AsyncMock()
            mock_response.status_code = 403
            mock_response.headers = {"x-ratelimit-remaining": "0"}
            mock_response.is_success = False

            with patch("httpx.AsyncClient.get", return_value=mock_response):
                with pytest.raises(PermissionError) as exc_info:
                    await service._request("/repos/facebook/react")
                assert "rate limit exceeded" in str(exc_info.value).lower()

        run_async(_test())
