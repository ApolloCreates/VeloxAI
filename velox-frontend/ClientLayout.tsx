"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialDark = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  }, []);

  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Toaster position="top-right" />

      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow
        bg-gray-800 text-white hover:bg-gray-700
        dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {children}
    </div>
  );
}