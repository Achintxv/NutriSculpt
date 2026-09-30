from pydantic import BaseModel

class ProfileCreate(BaseModel):
    height: float | None = None
    weight: float | None = None
    age: int | None = None
    fitness_goal: str | None = None
    activity_level: str | None = None

class ProfileResponse(ProfileCreate):
    id: int
    user_id: int
    model_config = {
        "from_attributes": True
    }