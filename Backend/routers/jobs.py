from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Job
from schemas import JobCreate
from shared.dependencies import get_current_user

router = APIRouter(prefix="/jobs")

@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/")
def get_jobs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Job).all()