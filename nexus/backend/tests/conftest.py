"""
Pytest configuration and shared fixtures for NEXUS backend tests.
Provides isolated test client, mocked GitHub payloads, and JWT test helpers.
"""

import asyncio
import pytest
from typing import Dict, Any
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
from app.core.security import create_access_token


def run_async(coro):
    """Utility helper to run async coroutines in standard synchronous pytest tests"""
    return asyncio.run(coro)


@pytest.fixture
def mock_github_repo_payload() -> Dict[str, Any]:
    return {
        "id": 10270250,
        "name": "react",
        "full_name": "facebook/react",
        "owner": {
            "login": "facebook",
            "avatar_url": "https://avatars.githubusercontent.com/u/69631",
            "html_url": "https://github.com/facebook",
        },
        "html_url": "https://github.com/facebook/react",
        "description": "The library for web and native user interfaces.",
        "default_branch": "main",
        "language": "JavaScript",
        "stargazers_count": 225000,
        "forks_count": 45000,
        "open_issues_count": 850,
        "watchers_count": 225000,
        "private": False,
        "size": 185000,
        "license": {"spdx_id": "MIT"},
        "created_at": "2013-05-24T16:15:54Z",
        "updated_at": "2026-08-30T10:00:00Z",
        "pushed_at": "2026-08-30T09:45:00Z",
    }


@pytest.fixture
def mock_github_commits_payload() -> list:
    return [
        {
            "sha": "e4d3c2b1a0987654321",
            "commit": {
                "message": "fix(compiler): resolve reactive boundary optimization",
                "author": {"name": "Dan Abramov", "date": "2026-08-30T08:30:00Z"},
            },
            "author": {"avatar_url": "https://avatars.githubusercontent.com/u/810438"},
            "html_url": "https://github.com/facebook/react/commit/e4d3c2b",
        },
        {
            "sha": "a1b2c3d4e5f67890123",
            "commit": {
                "message": "feat(server): streaming suspense boundary support",
                "author": {"name": "Andrew Clark", "date": "2026-08-29T14:15:00Z"},
            },
            "author": {"avatar_url": "https://avatars.githubusercontent.com/u/3624098"},
            "html_url": "https://github.com/facebook/react/commit/a1b2c3d",
        },
    ]


@pytest.fixture
def mock_github_prs_payload() -> list:
    return [
        {
            "id": 19482,
            "number": 29840,
            "title": "Optimizing hydration memory footprint",
            "state": "open",
            "user": {"login": "gaearon", "avatar_url": "https://avatars.githubusercontent.com/u/810438"},
            "created_at": "2026-08-28T10:00:00Z",
            "merged_at": None,
            "html_url": "https://github.com/facebook/react/pull/29840",
        },
        {
            "id": 19480,
            "number": 29838,
            "title": "Release v19.2.0 stable channel",
            "state": "closed",
            "user": {"login": "acdlite", "avatar_url": "https://avatars.githubusercontent.com/u/3624098"},
            "created_at": "2026-08-26T10:00:00Z",
            "merged_at": "2026-08-27T00:48:00Z",
            "html_url": "https://github.com/facebook/react/pull/29838",
        },
    ]


@pytest.fixture
def mock_github_workflows_payload() -> list:
    return [
        {
            "id": 98471,
            "name": "CI Core & Tests",
            "status": "completed",
            "conclusion": "success",
            "head_branch": "main",
            "head_sha": "e4d3c2b",
            "created_at": "2026-08-30T08:35:00Z",
            "html_url": "https://github.com/facebook/react/actions/runs/98471",
        },
        {
            "id": 98470,
            "name": "Lint & Typecheck",
            "status": "completed",
            "conclusion": "success",
            "head_branch": "main",
            "head_sha": "e4d3c2b",
            "created_at": "2026-08-30T08:32:00Z",
            "html_url": "https://github.com/facebook/react/actions/runs/98470",
        },
    ]


@pytest.fixture
def mock_github_contributors_payload() -> list:
    return [
        {
            "login": "gaearon",
            "avatar_url": "https://avatars.githubusercontent.com/u/810438",
            "html_url": "https://github.com/gaearon",
            "contributions": 1840,
        },
        {
            "login": "acdlite",
            "avatar_url": "https://avatars.githubusercontent.com/u/3624098",
            "html_url": "https://github.com/acdlite",
            "contributions": 1250,
        },
    ]


@pytest.fixture
def mock_github_releases_payload() -> list:
    return [
        {
            "tag_name": "v19.2.0",
            "name": "React 19.2.0",
            "published_at": "2026-08-27T02:00:00Z",
            "html_url": "https://github.com/facebook/react/releases/tag/v19.2.0",
        }
    ]


@pytest.fixture
def test_jwt_token() -> str:
    """Generate a test JWT token for Devadharshini R"""
    return create_access_token(
        subject="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        extra_claims={
            "email": "devadharshini@nexus.internal",
            "name": "Devadharshini R",
            "role": "developer",
        },
    )
