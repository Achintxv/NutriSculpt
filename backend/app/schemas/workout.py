from pydantic import BaseModel


class WorkoutExerciseCreate(BaseModel):
    exercise_name: str
    sets: int | None = None
    reps: int | None = None
    duration: int | None = None
    rest_seconds: int | None = None
    notes: str | None = None
    order_index: int


class WorkoutDayCreate(BaseModel):
    day_of_week: int
    title: str
    exercises: list[WorkoutExerciseCreate]


class WorkoutPlanCreate(BaseModel):
    name: str
    description: str | None = None
    generated_by_ai: bool = False
    days: list[WorkoutDayCreate]
    

class WorkoutExerciseResponse(WorkoutExerciseCreate):
    id: int

    model_config = {
        "from_attributes": True
    }


class WorkoutDayResponse(WorkoutDayCreate):
    id: int
    exercises: list[WorkoutExerciseResponse]

    model_config = {
        "from_attributes": True
    }


class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None = None
    generated_by_ai: bool
    days: list[WorkoutDayResponse]

    model_config = {
        "from_attributes": True
    }