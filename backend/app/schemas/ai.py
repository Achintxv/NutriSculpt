from pydantic import BaseModel


class AIExercise(BaseModel):
    exercise_name: str
    sets: int | None = None
    reps: int | None = None
    duration: int | None = None
    rest_seconds: int | None = None
    notes: str | None = None
    order_index: int


class AIDay(BaseModel):
    day_of_week: int
    title: str
    exercises: list[AIExercise]


class AIWorkoutPlan(BaseModel):
    name: str
    description: str | None = None
    days: list[AIDay]


class AIMeal(BaseModel):
    meal_type: str
    name: str
    calories: int | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None
    notes: str | None = None


class AIMealPlan(BaseModel):
    name: str
    calorie_target: int | None = None
    meals: list[AIMeal]


class AIFitnessPlan(BaseModel):
    workout: AIWorkoutPlan
    meal_plan: AIMealPlan