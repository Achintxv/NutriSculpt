from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
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

    days: Mapped[list["WorkoutDay"]] = relationship(
    back_populates="workout_plan",
    cascade="all, delete-orphan",
)

class WorkoutDay(Base):
    __tablename__ = "workout_days"

    id: Mapped[int] = mapped_column(primary_key=True)

    workout_plan_id: Mapped[int] = mapped_column(
        ForeignKey("workout_plans.id"),
        nullable=False,
    )

    day_of_week: Mapped[int] = mapped_column(
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    workout_plan: Mapped["WorkoutPlan"] = relationship(
        back_populates="days",
    )

    exercises: Mapped[list["WorkoutExercise"]] = relationship(
    back_populates="workout_day",
    cascade="all, delete-orphan",
    order_by="WorkoutExercise.order_index",
)

class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id: Mapped[int] = mapped_column(primary_key=True)

    workout_day_id: Mapped[int] = mapped_column(
        ForeignKey("workout_days.id"),
        nullable=False,
    )

    exercise_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    sets: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    reps: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    duration: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    rest_seconds: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    order_index: Mapped[int] = mapped_column(
        nullable=False,
    )

    workout_day: Mapped["WorkoutDay"] = relationship(
        back_populates="exercises",
    )