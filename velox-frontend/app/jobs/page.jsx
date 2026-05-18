"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get("/jobs");
      setJobs(res.data);
    };

    fetchJobs();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((j) => j !== id)
        : [...prev, id]
    );
  };

  const handleBatchApply = async () => {
    try {
      await API.post("/apply/batch", {
        job_ids: selected,
        resume_id: 1, // later dynamic
      });

      alert("Batch apply started 🚀");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <button
        onClick={handleBatchApply}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        Apply to Selected
      </button>

      <div className="space-y-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center gap-3 border p-3 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(job.id)}
              onChange={() => toggleSelect(job.id)}
            />

            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}