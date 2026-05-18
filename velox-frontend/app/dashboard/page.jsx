"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import ApplicationChart from "../../components/ApplicationChart";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/apply/applications");

      setApplications((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
          return res.data;
        }
        return prev;
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fetch error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    (async () => {
      await fetchApplications();
    })();
  }, []);

  useEffect(() => {
    let isMounted = true;

  const poll = async () => {
    if (!isMounted) return;
    await fetchApplications();
    setTimeout(poll, 8000); // waits for completion
  };

  poll();

  return () => {
    isMounted = false;
  };
}, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const stats = {
    total: applications.length,
    success: applications.filter((a) => a.status === "success").length,
    failed: applications.filter((a) => a.status === "failed").length,
    processing: applications.filter((a) => a.status === "processing").length,
  };

  const chartData = [
    { name: "Success", value: stats.success },
    { name: "Failed", value: stats.failed },
    { name: "Processing", value: stats.processing },
  ];

  // 🌙 Dark mode friendly status styles
  const statusStyles = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    failed:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    processing:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    pending:
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Velox Dashboard 🚀
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* LAST UPDATED */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last updated: {lastUpdated || "Loading..."}
      </p>

      {/* STATS */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {[
          { label: "Total", value: stats.total, color: "" },
          { label: "Success", value: stats.success, color: "text-green-500" },
          { label: "Failed", value: stats.failed, color: "text-red-500" },
          {
            label: "Processing",
            value: stats.processing,
            color: "text-yellow-500",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border dark:border-gray-700"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {item.label}
            </p>
            <p className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* INSIGHTS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 dark:text-white">
          📊 Insights
        </h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <ApplicationChart data={chartData} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Quick Actions:
        </span>

        <a
          href="/jobs"
          className="bg-black dark:bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
        >
          Add Job
        </a>

        <a
          href="/resume"
          className="bg-black dark:bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
        >
          Upload Resume
        </a>

        <a
          href="/apply"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Auto Apply 🚀
        </a>
      </div>

      {/* APPLICATIONS */}
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          📋 Applications
        </h2>

        {loading ? (
          <p className="dark:text-gray-400">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="dark:text-gray-400">
            No applications yet. Start applying 🚀
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b text-gray-600 dark:text-gray-300 text-sm dark:border-gray-700">
                <th className="p-3">Job</th>
                <th className="p-3">Company</th>
                <th className="p-3">Status</th>
                <th className="p-3">Resume</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/applications/${app.id}`)
                  }
                >
                  <td className="p-3 font-semibold dark:text-white">
                    {app.job_title}
                  </td>

                  <td className="p-3 dark:text-gray-300">
                    {app.company}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {app.pdf ? (
                      <a
                        href={`http://127.0.0.1:8000/apply/download/${app.pdf}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-500 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}