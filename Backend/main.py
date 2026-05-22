from fastapi import FastAPI
from database import Base, engine
from routers import auth, resume, jobs, application
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(application.router)


@app.get("/")
def root():
    return {"message": "Velox Apply AI Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}