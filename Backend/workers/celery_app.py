from celery import Celery

celery_app = Celery(
    "velox",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

# 🔥 ADD THIS
celery_app.autodiscover_tasks(['workers'])