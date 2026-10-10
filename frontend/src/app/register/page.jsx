"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowRight, UserPlus, Mail, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const emailTrimmed = form.email.trim();

      // 1. Create the user account in the database
      await apiFetch("/users/", {
        method: "POST",
        body: JSON.stringify({
          email: emailTrimmed,
          password: form.password,
        }),
      });

      // 2. Automatically log them in to receive their access token
      const loginData = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailTrimmed,
          password: form.password,
        }),
      });

      // 3. Save the token to localStorage so authenticated pages can use it
      localStorage.setItem("token", loginData.access_token);

      setSuccess("Account created! Redirecting to your profile...");

      // 4. Now redirect to profile page safely with an active session
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      setError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0] px-4 py-10 text-[#111111]">
      <div className="w-full max-w-md">
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

        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_#111] sm:p-8">
          <div className="mb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-[#b8f2cf]">
              <UserPlus size={22} />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Start your journey
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Create account
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Build your personalized workout and nutrition plans.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-bold">
              Email address
              <span className="mt-1 flex items-center gap-2 rounded-lg border-2 border-black bg-[#f4f4f0] px-3">
                <Mail size={18} className="shrink-0 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </span>
            </label>

            <label className="block text-sm font-bold">
              Password
              <span className="mt-1 flex items-center gap-2 rounded-lg border-2 border-black bg-[#f4f4f0] px-3">
                <Lock size={18} className="shrink-0 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg border-2 border-red-600 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="rounded-lg border-2 border-black bg-[#b8f2cf] p-3 text-sm font-semibold">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ns-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create my account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-extrabold text-black underline decoration-2 underline-offset-4 hover:text-gray-600"
            >
              Log in
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