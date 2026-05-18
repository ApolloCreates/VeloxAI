"use client";

import { useState } from "react";
import API from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    // 🔥 FIX: use correct key
    localStorage.setItem("token", res.data.access_token);

    window.location.href = "/dashboard";

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Login to Velox 🚀</h1>

      <input
        className="border p-2 w-64"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-64"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-500">Sign up</a>
      </p>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}