from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdate
from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)

@router.post("/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db:Session = Depends(get_db)
):

    existing_profile=(
        db.query(Profile).filter(Profile.user_id == current_user.id).first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Profile already exists"
        )

    profile = Profile(
        user_id=current_user.id,
        height=profile_data.height,
        weight=profile_data.weight,
        age=profile_data.age,
        fitness_goal=profile_data.fitness_goal,
        activity_level=profile_data.activity_level,
        fitness_experience=profile_data.fitness_experience,
        workout_days_per_week=profile_data.workout_days_per_week,
        dietary_preference=profile_data.dietary_preference,
        allergies=profile_data.allergies,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(Profile).filter(Profile.user_id == current_user.id).first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile

@router.post("/me", response_model=ProfileResponse)
def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(Profile).filter(Profile.user_id == current_user.id).first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile