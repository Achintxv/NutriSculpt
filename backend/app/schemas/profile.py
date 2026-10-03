from pydantic import BaseModel

class ProfileCreate(BaseModel):
    height: float | None = None
    weight: float | None = None
    age: int | None = None
    fitness_goal: str | None = None
    activity_level: str | None = None
    fitness_experience: str | None = None
    workout_days_per_week: int | None = None
    dietary_preference: str | None = None
    allergies: str | None = None

class ProfileUpdate(BaseModel):
    height: float | None = None
    weight: float | None = None
    age: int | None = None
    fitness_goal: str | None = None
    activity_level: str | None = None
    fitness_experience: str | None = None
    workout_days_per_week: int | None = None
    dietary_preference: str | None = None
    allergies: str | None = None

class ProfileResponse(ProfileCreate):
    id: int
    user_id: int
    model_config = {
        "from_attributes": True
    }