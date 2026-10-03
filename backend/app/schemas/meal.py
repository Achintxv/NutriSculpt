from pydantic import BaseModel


class MealCreate(BaseModel):
    meal_type: str
    name: str
    calories: int | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None
    notes: str | None = None


class MealPlanCreate(BaseModel):
    name: str
    calorie_target: int | None = None
    generated_by_ai: bool = False
    meals: list[MealCreate]


class MealResponse(MealCreate):
    id: int

    model_config = {
        "from_attributes": True
    }


class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    name: str
    calorie_target: int | None = None
    generated_by_ai: bool
    meals: list[MealResponse]

    model_config = {
        "from_attributes": True
    }