from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.meal import MealPlan, Meal
from app.models.user import User
from app.schemas.meal import MealPlanCreate, MealPlanResponse, MealPlanUpdate, MealUpdate

router = APIRouter(
    prefix="/meals",
    tags=["Meals"],
)

@router.post(
    "/",
    response_model=MealPlanResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_meal_plan(
    meal_data: MealPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plan = MealPlan(
        user_id=current_user.id,
        name=meal_data.name,
        calorie_target=meal_data.calorie_target,
        generated_by_ai=meal_data.generated_by_ai,
    )

    db.add(meal_plan)

    for meal_data_item in meal_data.meals:
        meal = Meal(
            meal_type=meal_data_item.meal_type,
            name=meal_data_item.name,
            calories=meal_data_item.calories,
            protein=meal_data_item.protein,
            carbs=meal_data_item.carbs,
            fat=meal_data_item.fat,
            notes=meal_data_item.notes,
        )

        meal_plan.meals.append(meal)

    db.commit()
    db.refresh(meal_plan)

    return meal_plan

@router.get(
    "/",
    response_model=list[MealPlanResponse],
)
def get_meal_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plans = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id)
        .all()
    )

    return meal_plans


@router.get(
    "/{meal_plan_id}",
    response_model=MealPlanResponse,
)
def get_meal_plan(
    meal_plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plan = (
        db.query(MealPlan)
        .filter(
            MealPlan.id == meal_plan_id,
            MealPlan.user_id == current_user.id,
        )
        .first()
    )

    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    return meal_plan

@router.put(
    "/{meal_plan_id}",
    response_model=MealPlanResponse,
)
def update_meal_plan(
    meal_plan_id: int,
    meal_data: MealPlanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plan = (
        db.query(MealPlan)
        .filter(
            MealPlan.id == meal_plan_id,
            MealPlan.user_id == current_user.id,
        )
        .first()
    )

    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    update_data = meal_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(meal_plan, field, value)

    db.commit()
    db.refresh(meal_plan)

    return meal_plan

@router.put("/{meal_plan_id}/meals/{meal_id}")
def update_meal(
    meal_plan_id: int,
    meal_id: int,
    meal_data: MealUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal = (
        db.query(Meal)
        .join(MealPlan)
        .filter(
            Meal.id == meal_id,
            MealPlan.id == meal_plan_id,
            MealPlan.user_id == current_user.id,
        )
        .first()
    )

    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found",
        )

    update_data = meal_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(meal, field, value)

    db.commit()
    db.refresh(meal)

    return meal