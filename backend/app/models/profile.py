from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    height: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    weight: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    fitness_goal: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    activity_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )