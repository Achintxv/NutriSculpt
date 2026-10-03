from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.workout import WorkoutPlan, WorkoutDay, WorkoutExercise
from app.schemas.workout import (
    WorkoutPlanCreate,
    WorkoutPlanResponse,
    WorkoutPlanUpdate,
    WorkoutExerciseUpdate,
    WorkoutDayUpdate)

router = APIRouter(
    prefix="/workouts",
    tags=["Workouts"]
)

@router.post(
    "/",
    response_model=WorkoutPlanResponse,
    status_code=status.HTTP_201_CREATED,
)

def create_workout_plan(
    workout_data: WorkoutPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_plan = WorkoutPlan(
        user_id=current_user.id,
        name=workout_data.name,
        description=workout_data.description,
        generated_by_ai=workout_data.generated_by_ai,
    )

    db.add(workout_plan)

    for day_data in workout_data.days:
        workout_day = WorkoutDay(
            day_of_week=day_data.day_of_week,
            title=day_data.title,
        )

        workout_plan.days.append(workout_day)

        for exercise_data in day_data.exercises:
            exercise = WorkoutExercise(
                exercise_name=exercise_data.exercise_name,
                sets=exercise_data.sets,
                reps=exercise_data.reps,
                duration=exercise_data.duration,
                rest_seconds=exercise_data.rest_seconds,
                notes=exercise_data.notes,
                order_index=exercise_data.order_index,
            )

            workout_day.exercises.append(exercise)

    db.commit()
    db.refresh(workout_plan)

    return workout_plan

@router.get(
    "/",
    response_model=list[WorkoutPlanResponse],
)
def get_workout_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_plans = (
        db.query(WorkoutPlan)
        .filter(WorkoutPlan.user_id == current_user.id)
        .all()
    )

    return workout_plans

@router.get(
    "/{workout_id}",
    response_model=WorkoutPlanResponse,
)
def get_workout_plan(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_plan = (
        db.query(WorkoutPlan)
        .filter(
            WorkoutPlan.id == workout_id,
            WorkoutPlan.user_id == current_user.id,
        )
        .first()
    )

    if not workout_plan:
        raise HTTPException(
            status_code=404,
            detail="Workout plan not found",
        )

    return workout_plan

@router.put(
    "/{workout_id}",
    response_model=WorkoutPlanResponse,
)
def update_workout_plan(
    workout_id: int,
    workout_data: WorkoutPlanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_plan = (
        db.query(WorkoutPlan)
        .filter(
            WorkoutPlan.id == workout_id,
            WorkoutPlan.user_id == current_user.id,
        )
        .first()
    )

    if not workout_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found",
        )

    update_data = workout_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(workout_plan, field, value)

    db.commit()
    db.refresh(workout_plan)

    return workout_plan

@router.put(
    "/{workout_id}/exercises/{exercise_id}",
)
def update_workout_exercise(
    workout_id: int,
    exercise_id: int,
    exercise_data: WorkoutExerciseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exercise = (
        db.query(WorkoutExercise)
        .join(WorkoutDay)
        .join(WorkoutPlan)
        .filter(
            WorkoutExercise.id == exercise_id,
            WorkoutPlan.id == workout_id,
            WorkoutPlan.user_id == current_user.id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )

    update_data = exercise_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(exercise, field, value)

    db.commit()
    db.refresh(exercise)

    return exercise

@router.put(
    "/{workout_id}/days/{day_id}",
)
def update_workout_day(
    workout_id: int,
    day_id: int,
    day_data: WorkoutDayUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_day = (
        db.query(WorkoutDay)
        .join(WorkoutPlan)
        .filter(
            WorkoutDay.id == day_id,
            WorkoutPlan.id == workout_id,
            WorkoutPlan.user_id == current_user.id,
        )
        .first()
    )

    if not workout_day:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout day not found",
        )

    update_data = day_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(workout_day, field, value)

    db.commit()
    db.refresh(workout_day)

    return workout_day