from fileinput import filename
from unittest import result

from workers.celery_app import celery_app
from database import SessionLocal
from models import Application, Job, Resume, User

@celery_app.task
def process_application(user_id, job_id, resume_id):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()
        job = db.query(Job).filter(Job.id == job_id).first()
        resume = db.query(Resume).filter(Resume.id == resume_id).first()

        print("USER ID:", user_id)
        print("JOB ID:", job_id)
        print("RESUME ID:", resume_id)

        print("USER:", user)
        print("JOB:", job)
        print("RESUME:", resume)

        
        if not user or not job or not resume:
            return {"status": "failed", "error": "Invalid data"}

        print(f"🔥 Processing application for {user.email}")

        # 💾 Save application
        

        application = Application(
            user_id=user.id,
            job_id=job.id,
            resume_id=resume.id,
            status="processing",
            pdf_path=filename   # ✅ STORE FILE NAME
        )

        db.add(application)
        application.status = result["status"]
        db.commit()

        return {"status": "processing"}

    except Exception as e:
        return {"status": "failed", "error": str(e)}

    finally:
        db.close()


    