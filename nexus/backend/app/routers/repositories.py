"""
NEXUS — Repository Integration & GitHub Intelligence Router
Endpoints for connecting, analyzing, querying, and managing real GitHub repositories.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.repository import ConnectedRepositoryResponse, RepositoryConnectRequest
from app.services.github_service import GitHubService
from app.utils.github_url import parse_github_url

router = APIRouter(prefix="/repositories", tags=["Repositories"])

# Connected repositories storage (persisted in memory for fast retrieval)
CONNECTED_REPOSITORIES_STORE: Dict[str, Dict[str, Any]] = {}
github_service = GitHubService()


@router.post(
    "/connect",
    response_model=ConnectedRepositoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Connect and analyze a real GitHub repository",
)
async def connect_repository(
    request: RepositoryConnectRequest,
) -> ConnectedRepositoryResponse:
    """
    Connect a GitHub repository via its URL.
    - Validates and sanitizes the GitHub URL.
    - Retrieves real metadata, commits, pull requests, issues, contributors, and Actions workflow runs.
    - Computes deterministic Engineering Health Score.
    - Registers repository for active telemetry analysis in NEXUS.
    """
    try:
        owner, repo, full_name, html_url = parse_github_url(request.url)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    try:
        analyzed_repo = await github_service.analyze_full_repository(owner, repo)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository not found on GitHub: '{owner}/{repo}'. Please check that the repository is public and correctly spelled.",
        )
    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to fetch telemetry from GitHub: {str(exc)}",
        )

    # Store in memory registry (indexed by both full_name and safe id)
    repo_key = analyzed_repo["name"].lower()
    CONNECTED_REPOSITORIES_STORE[repo_key] = analyzed_repo
    CONNECTED_REPOSITORIES_STORE[analyzed_repo["id"]] = analyzed_repo
    CONNECTED_REPOSITORIES_STORE[analyzed_repo["full_name"].lower()] = analyzed_repo

    return ConnectedRepositoryResponse.model_validate(analyzed_repo)


@router.get(
    "",
    response_model=List[ConnectedRepositoryResponse],
    status_code=status.HTTP_200_OK,
    summary="List all connected GitHub repositories",
)
async def list_connected_repositories() -> List[ConnectedRepositoryResponse]:
    """Retrieve all real GitHub repositories currently connected to NEXUS"""
    # Deduplicate by full_name
    unique_repos = {}
    for repo in CONNECTED_REPOSITORIES_STORE.values():
        unique_repos[repo["full_name"]] = repo
    return [ConnectedRepositoryResponse.model_validate(r) for r in unique_repos.values()]


@router.get(
    "/{repo_identifier}",
    response_model=ConnectedRepositoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get connected repository details",
)
async def get_repository_details(repo_identifier: str) -> ConnectedRepositoryResponse:
    """Fetch details and health analysis for a connected repository"""
    key = repo_identifier.strip().lower()
    repo = CONNECTED_REPOSITORIES_STORE.get(key)
    if not repo:
        # Check if user provided owner/repo that hasn't been fetched yet
        if "/" in repo_identifier:
            try:
                owner, repo_name, _, _ = parse_github_url(f"https://github.com/{repo_identifier}")
                repo = await github_service.analyze_full_repository(owner, repo_name)
                CONNECTED_REPOSITORIES_STORE[repo["name"].lower()] = repo
                CONNECTED_REPOSITORIES_STORE[repo["id"]] = repo
                CONNECTED_REPOSITORIES_STORE[repo["full_name"].lower()] = repo
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Repository '{repo_identifier}' is not connected in NEXUS.",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Repository '{repo_identifier}' is not connected in NEXUS.",
            )

    return ConnectedRepositoryResponse.model_validate(repo)


@router.get(
    "/{repo_identifier}/health",
    status_code=status.HTTP_200_OK,
    summary="Get calculated Engineering Health Score breakdown",
)
async def get_repository_health(repo_identifier: str) -> Dict[str, Any]:
    """Return the 7-factor deterministic health score breakdown for the repository"""
    repo = await get_repository_details(repo_identifier)
    return {
        "repository": repo.full_name,
        "health": repo.health.model_dump(),
        "calculated_at": repo.analyzed_at,
    }


@router.get(
    "/{repo_identifier}/activity",
    status_code=status.HTTP_200_OK,
    summary="Get recent repository activity stream",
)
async def get_repository_activity(repo_identifier: str) -> List[Dict[str, Any]]:
    """Return recent commits, PRs, and workflow runs mapped as activity items"""
    repo = await get_repository_details(repo_identifier)
    activities = []

    for commit in repo.recent_commits[:10]:
        activities.append(
            {
                "id": f"act-c-{commit['sha']}",
                "type": "commit",
                "title": f"Commit: {commit['message']}",
                "description": f"Authored by {commit['author_name']}",
                "author": {
                    "name": commit["author_name"],
                    "avatar": commit["author_avatar"]
                    or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                    "handle": commit["author_name"].lower().replace(" ", "_"),
                },
                "repository": repo.name,
                "refId": commit["sha"],
                "timestamp": commit["date"] or repo.analyzed_at,
                "status": "success",
            }
        )

    for pr in repo.recent_pull_requests[:8]:
        activities.append(
            {
                "id": f"act-pr-{pr['number']}",
                "type": "pull_request",
                "title": f"PR #{pr['number']}: {pr['title']}",
                "description": f"Created by @{pr['user']} · Status: {pr['state']}",
                "author": {
                    "name": pr["user"],
                    "avatar": pr["avatar_url"]
                    or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
                    "handle": pr["user"],
                },
                "repository": repo.name,
                "refId": f"#{pr['number']}",
                "timestamp": pr["created_at"] or repo.analyzed_at,
                "status": "merged" if pr.get("merged_at") else "pending",
            }
        )

    return activities


@router.get(
    "/{repo_identifier}/telemetry",
    status_code=status.HTTP_200_OK,
    summary="Get 8-metric telemetry mappings with provenance markers",
)
async def get_repository_telemetry(repo_identifier: str) -> Dict[str, Any]:
    """
    Returns mapped telemetry for the 8 Engineering Pulse metrics,
    distinguishing real GitHub measurements from unavailable observability metrics.
    """
    repo = await get_repository_details(repo_identifier)
    m = repo.metrics_summary

    return {
        "repository": repo.full_name,
        "is_real_github": True,
        "metrics": [
            {
                "id": "healthScore",
                "label": "Health Score",
                "value": m.health_score,
                "unit": "score",
                "is_real": True,
                "source": "GitHub Multi-Vector Analysis Engine",
                "description": "Calculated across commits, PR merge cadence, open issues, and CI runs",
            },
            {
                "id": "velocity",
                "label": "Velocity",
                "value": m.velocity_pts,
                "unit": "pts",
                "is_real": True,
                "source": "GitHub Commit & PR Activity",
                "description": f"{m.recent_commits_count} commits + {m.open_prs_count} active pull requests",
            },
            {
                "id": "testPassRate",
                "label": "Test Pass %",
                "value": m.test_pass_rate,
                "unit": "%",
                "is_real": len(repo.recent_workflows) > 0,
                "source": (
                    "GitHub Actions Workflow Runs"
                    if len(repo.recent_workflows) > 0
                    else "No Workflows Configured"
                ),
                "description": (
                    f"{len([w for w in repo.recent_workflows if w['conclusion'] == 'success'])}/{len(repo.recent_workflows)} passing CI runs"
                    if repo.recent_workflows
                    else "Configure .github/workflows for live CI telemetry"
                ),
            },
            {
                "id": "deploymentFrequency",
                "label": "Deployment Frequency",
                "value": max(1, m.releases_count),
                "unit": "deploys",
                "is_real": True,
                "source": "GitHub Releases & Tag History",
                "description": f"{m.releases_count} tracked releases on {repo.default_branch}",
            },
            {
                "id": "codeCommits",
                "label": "Code Commits",
                "value": m.recent_commits_count,
                "unit": "commits",
                "is_real": True,
                "source": "GitHub Git Log Stream",
                "description": f"Recent commits pushed to {repo.default_branch}",
            },
            {
                "id": "prCycleTimeHours",
                "label": "PR Cycle Time",
                "value": m.pr_cycle_time_hours,
                "unit": "hrs",
                "is_real": True,
                "source": "GitHub Pull Request Timestamps",
                "description": f"Mean merge turnaround: {m.pr_cycle_time_hours} hours",
            },
            {
                "id": "apiLatencyMs",
                "label": "API Latency",
                "value": 0,
                "unit": "ms",
                "is_real": False,
                "status": "Not connected",
                "source": "No telemetry source",
                "description": "Requires APM / Observability Gateway agent integration",
            },
            {
                "id": "errorRatePercent",
                "label": "Error Rate",
                "value": 0.0,
                "unit": "%",
                "is_real": False,
                "status": "Not connected",
                "source": "No telemetry source",
                "description": "Requires Production Log Monitor agent integration",
            },
        ],
    }


@router.delete(
    "/{repo_identifier}",
    status_code=status.HTTP_200_OK,
    summary="Disconnect a repository from NEXUS",
)
async def disconnect_repository(repo_identifier: str) -> Dict[str, str]:
    """Remove a connected repository from active session"""
    key = repo_identifier.strip().lower()
    if key in CONNECTED_REPOSITORIES_STORE:
        repo = CONNECTED_REPOSITORIES_STORE.pop(key)
        # Clean aliases
        CONNECTED_REPOSITORIES_STORE.pop(repo.get("id", ""), None)
        CONNECTED_REPOSITORIES_STORE.pop(repo.get("name", "").lower(), None)
        CONNECTED_REPOSITORIES_STORE.pop(repo.get("full_name", "").lower(), None)
        return {"message": f"Repository '{repo_identifier}' disconnected successfully."}

    return {"message": f"Repository '{repo_identifier}' not found in active connections."}
