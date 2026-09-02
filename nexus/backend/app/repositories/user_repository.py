import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """Fetch user by primary UUID key"""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Fetch user by normalized unique email"""
        normalized_email = email.strip().lower()
        result = await self.db.execute(select(User).where(User.email == normalized_email))
        return result.scalars().first()

    async def create(self, user_in: UserCreate, hashed_password: str) -> User:
        """Create and persist a new user record"""
        user = User(
            email=user_in.email.strip().lower(),
            hashed_password=hashed_password,
            full_name=user_in.full_name.strip(),
            role="developer",
            is_active=True,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user
