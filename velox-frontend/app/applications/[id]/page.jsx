"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../services/api";
import StatusTimeline from "../../../components/StatusTimeline";

export default function ApplicationDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/apply/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-4">
        {data.job_title}
      </h1>

      <p className="text-lg text-gray-600 mb-4">
        {data.company}
      </p>

      {/* STATUS */}
      <StatusTimeline status={data.status} />

      {/* DOWNLOAD */}
      {data.pdf && (
        <a
          href={`http://127.0.0.1:8000/apply/download/${data.pdf}`}
          target="_blank"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download Resume
        </a>
      )}

      {/* DESCRIPTION */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Job Description
        </h2>

        <p className="text-gray-700 whitespace-pre-line">
          {data.description}
        </p>
      </div>

    </div>
  );
}