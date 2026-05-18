"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function ApplyPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [resumeId, setResumeId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  // 📡 fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  // 📄 upload resume
  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/resume/upload", formData);

      setResumeId(res.data.resume_id);

      toast.success("Resume uploaded ✅");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed ❌");
    }
  };

  // ☑️ select jobs
  const toggleJob = (id) => {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id],
    );
  };

  // 🚀 apply
  const handleApply = async () => {
    if (!resumeId) return toast.error("Upload resume first");
    if (selectedJobs.length === 0)
      return toast.error("Select at least one job");

    setLoading(true);

    try {
      await API.post("/apply/batch", {
        job_ids: selectedJobs,
        resume_id: resumeId,
      });

      toast.success("Applications started 🚀");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Auto Apply Jobs 🚀</h1>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Upload Resume</h2>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={handleUpload}
          className="bg-black text-white px-4 py-2 rounded ml-4"
        >
          Upload
        </button>

        {resumeId && <p className="text-green-600 mt-2">Resume ready ✅</p>}
      </div>

      {/* JOB LIST */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Select Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-3 border p-3 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedJobs.includes(job.id)}
                  onChange={() => toggleJob(job.id)}
                />

                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mb-2 text-sm text-gray-600">
        Selected Jobs: {selectedJobs.length}
      </p>

      {/* APPLY BUTTON */}
      <button
        onClick={handleApply}
        disabled={loading || !resumeId || selectedJobs.length === 0}
        className={`px-6 py-3 rounded w-full text-lg ${
          loading || !resumeId || selectedJobs.length === 0
            ? "bg-gray-400"
            : "bg-green-600"
        } text-white`}
      >
        {loading ? "Applying..." : "🚀 Apply to Selected Jobs"}
      </button>
    </div>
  );
}
