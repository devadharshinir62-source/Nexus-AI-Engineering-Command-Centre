"""
Tests for Authentication and JWT Lifecycle.
"""

import pytest
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from app.schemas.auth import UserLogin, AuthResponse
from app.schemas.user import UserCreate


class TestAuthSecurity:
    def test_password_hashing_and_verification(self):
        password = "SecurePassword123!"
        hashed = get_password_hash(password)

        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password("WrongPassword999", hashed) is False

    def test_jwt_token_generation_and_decoding(self):
        user_id = "123e4567-e89b-12d3-a456-426614174000"
        claims = {
            "email": "devadharshini@nexus.internal",
            "name": "Devadharshini R",
            "role": "lead_architect",
        }

        token = create_access_token(subject=user_id, extra_claims=claims)
        assert isinstance(token, str)
        assert len(token.split(".")) == 3  # Header.Payload.Signature

        decoded = decode_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == user_id
        assert decoded["email"] == "devadharshini@nexus.internal"
        assert decoded["name"] == "Devadharshini R"

    def test_jwt_token_invalid_signature_rejected(self):
        tampered_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.tampered_signature"
        decoded = decode_access_token(tampered_token)
        assert decoded is None

    def test_user_create_validation(self):
        valid = UserCreate(
            email="developer@nexus.ai",
            password="StrongPassword123!",
            full_name="Devadharshini R",
        )
        assert valid.email == "developer@nexus.ai"
        assert valid.full_name == "Devadharshini R"
