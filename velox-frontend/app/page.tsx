"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl">Loading Velox...</h1>
    </div>
  );
}