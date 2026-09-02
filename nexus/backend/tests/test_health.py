"""
Tests for System Health Endpoint.
"""

from httpx import AsyncClient, ASGITransport
from app.main import app
from tests.conftest import run_async


def test_health_check_endpoint():
    """Verify that GET /health returns status 200 and indicates a healthy service"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.get("/health")
            assert response.status_code == 200

            data = response.json()
            assert data["status"] == "healthy"
            assert "service" in data
            assert "version" in data
            assert "environment" in data

    run_async(_test())
