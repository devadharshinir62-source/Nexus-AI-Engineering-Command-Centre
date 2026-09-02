"""
Tests for GitHub URL Validation and SSRF Protection.
"""

import pytest
from app.utils.github_url import parse_github_url


class TestGitHubUrlValidation:
    """Test suite for safe GitHub repository URL parsing."""

    @pytest.mark.parametrize(
        "url, expected_owner, expected_repo",
        [
            ("https://github.com/facebook/react", "facebook", "react"),
            ("https://github.com/devadharshini/example-repository", "devadharshini", "example-repository"),
            ("github.com/facebook/react", "facebook", "react"),
            ("https://github.com/facebook/react/", "facebook", "react"),
            ("http://github.com/facebook/react", "facebook", "react"),
            ("https://www.github.com/vercel/next.js", "vercel", "next.js"),
            ("https://github.com/fastapi/fastapi.git", "fastapi", "fastapi"),
            ("https://github.com/owner-with-hyphens/repo_with_underscores", "owner-with-hyphens", "repo_with_underscores"),
        ],
    )
    def test_valid_github_urls(self, url: str, expected_owner: str, expected_repo: str):
        owner, repo, full_name, html_url = parse_github_url(url)
        assert owner == expected_owner
        assert repo == expected_repo
        assert full_name == f"{expected_owner}/{expected_repo}"
        assert html_url == f"https://github.com/{expected_owner}/{expected_repo}"

    @pytest.mark.parametrize(
        "invalid_url",
        [
            "https://google.com/test",
            "https://github.com/",
            "not-a-url",
            "https://github.com",
            "https://github.com/a",
            "https://github.com/owner/repo/extra/path",
            "https://evil-github.com/owner/repo",
            "http://169.254.169.254/latest/meta-data",
            "javascript:alert(1)",
            "file:///etc/passwd",
            "",
            "   ",
            "https://github.com/owner/..",
            "https://github.com/-invalid-owner/repo",
        ],
    )
    def test_invalid_github_urls_rejected(self, invalid_url: str):
        with pytest.raises(ValueError):
            parse_github_url(invalid_url)
