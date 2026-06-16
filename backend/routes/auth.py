from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from database.connection import get_db
from models.user import User
from services.auth_service import hash_password, verify_password, create_access_token, get_current_user
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @validator('name')
    def name_valid(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Name too short — minimum 2 characters')
        if len(v) > 100:
            raise ValueError('Name too long — maximum 100 characters')
        return v

    @validator('password')
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        if len(v) > 128:
            raise ValueError('Password too long')
        return v

class UpdateProfileRequest(BaseModel):
    name: str
    target_role: Optional[str] = None
    target_companies: Optional[str] = None

    @validator('name')
    def name_valid(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Name too short')
        if len(v) > 100:
            raise ValueError('Name too long')
        return v

    @validator('target_role')
    def role_valid(cls, v):
        if v and len(v) > 100:
            raise ValueError('Target role too long')
        return v

    @validator('target_companies')
    def companies_valid(cls, v):
        if v and len(v) > 200:
            raise ValueError('Target companies too long')
        return v

@router.post("/register")
@limiter.limit("3/minute")
def register(request: Request, body: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(body.password)
    new_user = User(name=body.name, email=body.email, password_hash=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": str(new_user.id)}

@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def get_profile(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.id == uuid.UUID(current_user["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "target_role": user.target_role,
        "target_companies": user.target_companies,
        "created_at": str(user.created_at)
    }

@router.put("/me")
def update_profile(request: UpdateProfileRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.id == uuid.UUID(current_user["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = request.name
    user.target_role = request.target_role
    user.target_companies = request.target_companies
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully"}