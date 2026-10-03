from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.services.ai_service import generate_fitness_plan
from app.services.plan_service import save_fitness_plan
from app.models.workout import WorkoutPlan
from app.models.meal import MealPlan

router = APIRouter(
    prefix="/plans",
    tags=["Plans"],
)

@router.post("/generate")
def generate_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Please complete your profile before generating a plan",
        )
    plan = generate_fitness_plan(profile)
    workout_plan, meal_plan = save_fitness_plan(
        plan=plan,
        user_id=current_user.id,
        db=db,
    )

    return {
        "message": "Fitness plan generated successfully",
        "workout_plan_id": workout_plan.id,
        "meal_plan_id": meal_plan.id,
    }

@router.get("/workouts")
def get_my_workout_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_plans = (
        db.query(WorkoutPlan)
        .filter(WorkoutPlan.user_id == current_user.id)
        .all()
    )
    return workout_plans


@router.get("/meals")
def get_my_meal_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plans = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id)
        .all()
    )

    return meal_plans