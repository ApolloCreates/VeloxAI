from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class ResumeCreate(BaseModel):
    content: str


class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    apply_url: str


class ApplyRequest(BaseModel):
    job_id: int
    resume_id: int

class UserLogin(BaseModel):
    email: str
    password: str

class BatchApplyRequest(BaseModel):
    job_ids: list[int]
    resume_id: int