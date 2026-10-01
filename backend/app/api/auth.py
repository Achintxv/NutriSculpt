from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.core.security import create_access_token, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (db.query(User).filter(User.email == login_data.email).first())

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    password_valid = verify_password(
        login_data.password,
        user.password_hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(user.id)

    return{
        "access_token": access_token,
        "token_type": "bearer",
    }