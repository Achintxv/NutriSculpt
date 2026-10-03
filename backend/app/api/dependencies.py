from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.user import User

def get_current_user(
        user_id: int = Depends(get_current_user_id),
        db: Session = Depends(get_db)
) -> User:
    user = (
        db.query(User).filter(User.id == user_id).first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user