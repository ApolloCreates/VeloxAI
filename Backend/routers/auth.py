from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserLogin
from shared.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth")

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed = hash_password(user.password)

    db_user = User(email=user.email, password=hashed)
    db.add(db_user)
    db.commit()

    return {"msg": "User created"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    print("TOKEN RECEIVED:", token)

    return {
        "access_token": token,
        "token_type": "bearer"
    }