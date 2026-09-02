"""
API Integration Tests for Repositories Router (/api/v1/repositories).
"""

import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from tests.conftest import run_async


class TestRepositoriesApi:
    def test_connect_repository_success(self):
        """Test POST /api/v1/repositories/connect with valid public repo URL"""
        async def _test():
            mock_analyzed = {
                "id": "gh-10270250",
                "name": "react",
                "full_name": "facebook/react",
                "owner": "facebook",
                "owner_avatar": "https://avatars.githubusercontent.com/u/69631",
                "url": "https://github.com/facebook/react",
                "description": "The library for web and native user interfaces.",
                "default_branch": "main",
                "language": "JavaScript",
                "stars": 225000,
                "forks": 45000,
                "open_issues": 850,
                "watchers": 225000,
                "is_private": False,
                "size": 185000,
                "license": "MIT",
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
                "recent_commits": [
                    {
                        "sha": "e4d3c2b",
                        "message": "fix(compiler): resolve reactive boundary",
                        "author_name": "Dan Abramov",
                        "author_avatar": "https://avatars.githubusercontent.com/u/810438",
                        "date": "2026-08-30T08:30:00Z",
                        "html_url": "https://github.com/facebook/react/commit/e4d3c2b",
                    }
                ],
                "recent_pull_requests": [],
                "recent_releases": [],
                "recent_workflows": [],
                "top_contributors": [],
                "branches": ["main"],
                "is_real_github": True,
                "analyzed_at": "2026-08-30T10:00:00Z",
            }

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                with patch("app.routers.repositories.github_service.analyze_full_repository", new=AsyncMock(return_value=mock_analyzed)):
                    response = await client.post(
                        "/api/v1/repositories/connect",
                        json={"url": "https://github.com/facebook/react"},
                    )
                    assert response.status_code == 201
                    data = response.json()
                    assert data["name"] == "react"
                    assert data["health"]["health_score"] == 87
                    assert data["stars"] == 225000

        run_async(_test())

    def test_connect_repository_invalid_url_returns_400(self):
        """Test POST /api/v1/repositories/connect with invalid non-GitHub URL"""
        async def _test():
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                response = await client.post(
                    "/api/v1/repositories/connect",
                    json={"url": "https://google.com/malicious-url"},
                )
                assert response.status_code == 400
                assert "Only github.com repositories are supported" in response.json()["detail"]

        run_async(_test())

    def test_connect_repository_not_found_returns_404(self):
        """Test POST /api/v1/repositories/connect when repo is not found on GitHub"""
        async def _test():
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                with patch("app.routers.repositories.github_service.analyze_full_repository", side_effect=FileNotFoundError("Not found")):
                    response = await client.post(
                        "/api/v1/repositories/connect",
                        json={"url": "https://github.com/nonexistent-user-12345/does-not-exist"},
                    )
                    assert response.status_code == 404

        run_async(_test())

    def test_connect_repository_rate_limit_returns_403(self):
        """Test POST /api/v1/repositories/connect when GitHub API rate limit is exceeded"""
        async def _test():
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                with patch("app.routers.repositories.github_service.analyze_full_repository", side_effect=PermissionError("Rate limit exceeded")):
                    response = await client.post(
                        "/api/v1/repositories/connect",
                        json={"url": "https://github.com/facebook/react"},
                    )
                    assert response.status_code == 403

        run_async(_test())

    def test_list_connected_repositories(self):
        """Test GET /api/v1/repositories"""
        async def _test():
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                response = await client.get("/api/v1/repositories")
                assert response.status_code == 200
                assert isinstance(response.json(), list)

        run_async(_test())

    def test_get_repository_details_and_health(self):
        """Test GET /api/v1/repositories/{id}/health and telemetry"""
        async def _test():
            mock_analyzed = {
                "id": "gh-9999",
                "name": "fastapi",
                "full_name": "fastapi/fastapi",
                "owner": "fastapi",
                "url": "https://github.com/fastapi/fastapi",
                "default_branch": "master",
                "language": "Python",
                "stars": 85000,
                "forks": 7200,
                "open_issues": 120,
                "watchers": 85000,
                "is_private": False,
                "size": 15000,
                "health": {
                    "health_score": 92,
                    "code_activity": 90,
                    "pull_request_health": 88,
                    "issue_health": 85,
                    "ci_health": 95,
                    "maintenance": 94,
                    "release_health": 90,
                    "security_health": 95,
                },
                "metrics_summary": {
                    "health_score": 92,
                    "velocity_pts": 95,
                    "test_pass_rate": 98.5,
                    "pr_cycle_time_hours": 12.0,
                    "recent_commits_count": 25,
                    "open_prs_count": 8,
                    "releases_count": 12,
                    "contributors_count": 10,
                },
                "recent_commits": [],
                "recent_pull_requests": [],
                "recent_releases": [],
                "recent_workflows": [],
                "top_contributors": [],
                "branches": ["master"],
                "is_real_github": True,
                "analyzed_at": "2026-08-30T10:00:00Z",
            }

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                with patch("app.routers.repositories.github_service.analyze_full_repository", new=AsyncMock(return_value=mock_analyzed)):
                    # Connect first
                    await client.post("/api/v1/repositories/connect", json={"url": "https://github.com/fastapi/fastapi"})

                    # Query health
                    health_res = await client.get("/api/v1/repositories/fastapi/health")
                    assert health_res.status_code == 200
                    assert health_res.json()["health"]["health_score"] == 92

                    # Query telemetry provenance markers
                    telemetry_res = await client.get("/api/v1/repositories/fastapi/telemetry")
                    assert telemetry_res.status_code == 200
                    t_data = telemetry_res.json()
                    assert t_data["is_real_github"] is True

                    # Verify API latency and Error Rate are marked as 'Not connected'
                    latency_metric = next(m for m in t_data["metrics"] if m["id"] == "apiLatencyMs")
                    assert latency_metric["is_real"] is False
                    assert latency_metric["status"] == "Not connected"

                    error_metric = next(m for m in t_data["metrics"] if m["id"] == "errorRatePercent")
                    assert error_metric["is_real"] is False
                    assert error_metric["status"] == "Not connected"

                    # Verify commit and PR metrics are marked as real
                    commits_metric = next(m for m in t_data["metrics"] if m["id"] == "codeCommits")
                    assert commits_metric["is_real"] is True

        run_async(_test())

    def test_get_unknown_repository_returns_404(self):
        """Test GET /api/v1/repositories/{unknown_id} returns 404"""
        async def _test():
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://testserver") as client:
                response = await client.get("/api/v1/repositories/non-existent-repo-id-9999")
                assert response.status_code == 404

        run_async(_test())
