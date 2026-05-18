"use client";

import { useState } from "react";
import API from "../../services/api";

export default function ResumePage() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded! Resume ID: " + res.data.resume_id);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded ml-4"
      >
        Upload
      </button>
    </div>
  );
}