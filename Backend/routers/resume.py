from schemas import ResumeCreate
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os

from database import get_db
from models import Resume
from shared.dependencies import get_current_user
from services.parser_service import extract_text_from_pdf

router = APIRouter(prefix="/resume")


@router.post("/")
def create_resume(
    resume: ResumeCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    db_resume = Resume(user_id=user.id, content=resume.content)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume




router = APIRouter(prefix="/resume")

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # 🤖 Extract text
    extracted_text = extract_text_from_pdf(file_path)

    # 💾 Save to DB
    resume = Resume(
        user_id=user.id,
        content=extracted_text,
        file_path=file_path
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id
    }