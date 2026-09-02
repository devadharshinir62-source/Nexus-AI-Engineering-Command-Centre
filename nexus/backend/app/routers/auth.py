from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.schemas.auth import AuthResponse, UserLogin
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user account",
)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    """
    Register a new user in the NEXUS Command Center.
    - Validates email format and password strength (min 8 chars).
    - Checks email uniqueness (returns HTTP 409 if already registered).
    - Automatically issues a JWT access token upon successful registration.
    """
    service = AuthService(db)
    return await service.register(user_in)


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT",
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    """
    Authenticate user with email and password.
    - Returns signed JWT access token and user metadata.
    - Returns HTTP 401 on invalid credentials.
    """
    service = AuthService(db)
    return await service.authenticate(credentials)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
)
async def get_me(
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    """
    Retrieve profile details of the currently authenticated developer session.
    Requires Bearer token authorization.
    """
    return UserResponse.model_validate(current_user)
