"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowRight, LogIn, Mail, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";

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
          email: email.trim(),
          password,
        }),
      });

      console.log("Login response", data);

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0] px-4 py-10 text-[#111111]">
      <div className="w-full max-w-md">
        {/* Header Logo */}
        <Link href="/login" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-[#ffdf00] shadow-[3px_3px_0_#111]">
            <Dumbbell size={25} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              NutriSculpt
            </h1>
            <p className="text-xs font-bold tracking-widest text-gray-500">
              YOUR FITNESS HQ
            </p>
          </div>
        </Link>

        {/* Login Card */}
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_#111] sm:p-8">
          <div className="mb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-[#ffdf00]">
              <LogIn size={22} />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Welcome back
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Access your personalized workout and nutrition plans.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <label className="block text-sm font-bold">
              Email address
              <span className="mt-1 flex items-center gap-2 rounded-lg border-2 border-black bg-[#f4f4f0] px-3">
                <Mail size={18} className="shrink-0 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </span>
            </label>

            {/* Password Field */}
            <label className="block text-sm font-bold">
              Password
              <span className="mt-1 flex items-center gap-2 rounded-lg border-2 border-black bg-[#f4f4f0] px-3">
                <Lock size={18} className="shrink-0 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <p role="alert" className="rounded-lg border-2 border-red-600 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ns-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-extrabold text-black underline decoration-2 underline-offset-4 hover:text-gray-600"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-gray-500">
          Small steps. Big results.
        </p>
      </div>
    </main>
  );
}