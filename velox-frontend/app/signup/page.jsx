"use client";

import { useState } from "react";
import API from "../../services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/auth/register", {
        email,
        password,
      });

      setSuccess("Account created! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.detail || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Create Account 🚀</h1>

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
        onClick={handleSignup}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">Login</a>
      </p>
    </div>
  );
}