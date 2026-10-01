from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileResponse

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)

@router.post(
    "/{user_id}",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    user_id: int,
    profile_data: ProfileCreate,
    db:Session = Depends(get_db)
):
    user=db.query(User).filter(User.id==user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    existing_profile=(
        db.query(Profile).filter(Profile.user_id == user_id).first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Profile already exists"
        )

    profile = Profile(
        user_id=user_id,
        height=profile_data.height,
        weight=profile_data.weight,
        age=profile_data.age,
        fitness_goal=profile_data.fitness_goal,
        activity_level=profile_data.activity_level
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile