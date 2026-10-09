"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Login response", data);

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-5 rounded-2xl border p-8">
        <div>
            <h1 className="text-3xl font-bold">
                Welcome to NutriSculpt
            </h1>

            <p className="mt-2 text-gray-500">
                Sign in to continue
            </p>
        </div>

        <div>
            <label className="mb-2 block">
                Email
            </label>
            <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required className="w-full rounded-lg border p-3" />
        </div>

        <div>
            <label className="mb-2 block">
                Password
            </label>
            <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} required className="w-full rounded-lg border p-3" />
        </div>

        {error && (
            <p className="texxt-sm text-red-500">{error}</p>
        )}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-black p-3 text-white">
            {loading ? "Signing in..." : "Sign in"}
        </button>

      </form>
    </div>
  );
}
