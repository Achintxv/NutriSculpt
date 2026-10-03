from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from sqlalchemy import Float
from sqlalchemy.orm import relationship


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    calorie_target: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    generated_by_ai: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    meals: Mapped[list["Meal"]] = relationship(
    back_populates="meal_plan",
    cascade="all, delete-orphan",
)

class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)

    meal_plan_id: Mapped[int] = mapped_column(
        ForeignKey("meal_plans.id"),
        nullable=False,
    )

    meal_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    calories: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    protein: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    carbs: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    fat: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    meal_plan: Mapped["MealPlan"] = relationship(
        back_populates="meals",
    )