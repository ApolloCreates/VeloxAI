"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // ✅ Apply on toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="min-h-full flex flex-col transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
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