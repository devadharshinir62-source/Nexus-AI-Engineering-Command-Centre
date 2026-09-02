"""
GitHub URL Parser & Security Validator for NEXUS
Protects against SSRF and validates legitimate GitHub repository paths.
"""

import re
from typing import Tuple
from urllib.parse import urlparse


def parse_github_url(url_string: str) -> Tuple[str, str, str, str]:
    """
    Safely parses and validates a GitHub repository URL.

    Accepts formats:
      - https://github.com/owner/repo
      - https://github.com/owner/repo/
      - http://github.com/owner/repo
      - github.com/owner/repo
      - owner/repo (if structured as clean repo path)

    Returns:
      (owner, repo_name, full_name, normalized_html_url)

    Raises:
      ValueError if the URL is invalid or not a GitHub repository.
    """
    if not url_string or not isinstance(url_string, str):
        raise ValueError("Repository URL must be a non-empty string.")

    cleaned = url_string.strip()

    # Prepend https:// if protocol is omitted
    if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
        cleaned = f"https://{cleaned}"

    parsed = urlparse(cleaned)

    # Validate hostname is github.com (or www.github.com)
    hostname = (parsed.hostname or "").lower()
    if hostname not in ("github.com", "www.github.com"):
        raise ValueError("Invalid URL: Only github.com repositories are supported.")

    # Extract path parts
    path = parsed.path.strip("/")
    parts = [p for p in path.split("/") if p]

    if len(parts) != 2:
        raise ValueError(
            "Invalid repository format. Expected: https://github.com/owner/repository"
        )

    owner = parts[0].strip()
    repo_name = parts[1].strip()

    # Strip .git suffix if present
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]

    # Validate owner & repo characters per GitHub naming rules
    # GitHub username: alphanumeric + hyphens, cannot start/end with hyphen
    # Repository: alphanumeric, hyphens, underscores, dots
    owner_pattern = r"^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$"
    repo_pattern = r"^[a-zA-Z0-9_.-]+$"

    if not re.match(owner_pattern, owner):
        raise ValueError(f"Invalid GitHub owner name: '{owner}'.")

    if not re.match(repo_pattern, repo_name) or repo_name in (".", ".."):
        raise ValueError(f"Invalid GitHub repository name: '{repo_name}'.")

    full_name = f"{owner}/{repo_name}"
    html_url = f"https://github.com/{full_name}"

    return owner, repo_name, full_name, html_url
