import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def tailor_resume(resume, job_desc):
    prompt = f"""
    Tailor this resume for the job.

    Resume:
    {resume}

    Job Description:
    {job_desc}

    Return in this format:

    Name:
    Email:

    Summary:

    Skills:
    - skill1
    - skill2

    Experience:
    - point1
    - point2
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content