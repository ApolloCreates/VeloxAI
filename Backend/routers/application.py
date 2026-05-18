# from unittest import result

from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from database import get_db
# from models import Application, Job, Resume
# from schemas import ApplyRequest
# from services.ai_service import tailor_resume
# from shared.dependencies import get_current_user
# from services.pdf_service import generate_pdf
# from fastapi.responses import FileResponse
# from services.automation_service import apply_to_job
# from workers.tasks import process_application

router = APIRouter(prefix="/apply")


# @router.post("/")
# def apply(
#     data: ApplyRequest,
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     job = db.query(Job).filter(Job.id == data.job_id).first()
#     resume = db.query(Resume).filter(Resume.id == data.resume_id).first()

#     if not job or not resume:
#         return {"error": "Invalid job_id or resume_id"}

#     # 🤖 AI Resume
#     tailored = tailor_resume(resume.content, job.description)

#     # 📄 Generate PDF
#     import os
#     os.makedirs("generated", exist_ok=True)

#     filename = f"resume_{user.id}_{job.id}.pdf"
#     filepath = f"generated/{filename}"

#     generate_pdf(tailored, filepath)

#     # 💾 Save application FIRST
#     application = Application(
#         user_id=user.id,
#         job_id=job.id,
#         resume_id=resume.id,
#         status="pending"
#     )

#     db.add(application)
#     db.commit()
#     db.refresh(application)

#     # 🤖 Run automation AFTER PDF is ready
#     result = apply_to_job(
#         url=job.apply_url,
#         name="Mohit Pandey",
#         email=user.email,
#         resume_path=filepath
#     )

#     # 🔄 Update status
#     application.status = result["status"]
#     db.commit()

#     return {
#         "status": result["status"],
#         "pdf_path": filepath,
#         "automation": result
#     }

# @router.get("/download/{filename}")
# def download_file(filename: str):
#     path = f"generated/{filename}"
#     return FileResponse(path, media_type='application/pdf', filename=filename)


from schemas import ApplyRequest
from workers.tasks import process_application
from database import get_db
from shared.dependencies import get_current_user
from models import Application
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

@router.post("/")
def apply(
    data: ApplyRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    task = process_application.delay(user.id, data.job_id, data.resume_id)

    return {
        "message": "Application queued",
        "task_id": task.id
    }

from models import Application, Job

@router.get("/applications")
def get_applications(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    applications = (
        db.query(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .filter(Application.user_id == user.id)
        .all()
    )

    return [
    {
        "id": app.id,
        "job_title": job.title,
        "company": job.company,
        "status": app.status,
        "pdf": app.pdf_path   # ✅ ADD THIS
    }
    for app, job in applications
]

from fastapi.responses import FileResponse

@router.get("/download/{filename}")
def download_file(filename: str):
    path = f"generated/{filename}"
    return FileResponse(path, media_type="application/pdf", filename=filename)

@router.get("/{app_id}")
def get_application_detail(
    app_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    result = (
        db.query(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .filter(Application.id == app_id)
        .filter(Application.user_id == user.id)
        .first()
    )

    if not result:
        return {"error": "Application not found"}

    app, job = result

    return {
        "id": app.id,
        "job_title": job.title,
        "company": job.company,
        "description": job.description,
        "status": app.status,
        "pdf": app.pdf_path
    }


from schemas import BatchApplyRequest

@router.post("/batch")
def batch_apply(
    data: BatchApplyRequest,
    user=Depends(get_current_user)
):
    tasks = []

    for job_id in data.job_ids:
        task = process_application.delay(user.id, job_id, data.resume_id)
        tasks.append(task.id)

    return {
        "message": "Batch application started",
        "tasks": tasks
    }