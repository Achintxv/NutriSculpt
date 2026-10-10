"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Dumbbell,
  Flame,
  LogOut,
  Salad,
  Sparkles,
  Target,
  Utensils,
} from "lucide-react";
import WorkoutSection from "./WorkoutSection";
import MealSection from "./MealSection";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState(null);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);

  const loadPlans = useCallback(async (selectLatest = false) => {
    const [workouts, meals] = await Promise.all([
      apiFetch("/plans/workouts"),
      apiFetch("/plans/meals"),
    ]);

    setWorkoutPlans(workouts);
    setMealPlans(meals);

    setSelectedWorkoutPlanId((currentId) => {
      const exists = workouts.some(
        (plan) => String(plan.id) === String(currentId),
      );

      if (!selectLatest && exists) return currentId;

      return workouts.length ? workouts[workouts.length - 1].id : null;
    });

    setSelectedMealPlanId((currentId) => {
      const exists = meals.some(
        (plan) => String(plan.id) === String(currentId),
      );

      if (!selectLatest && exists) return currentId;

      return meals.length ? meals[meals.length - 1].id : null;
    });
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userData = await apiFetch("/auth/me");
        setUser(userData);

        try {
          const profileData = await apiFetch("/profiles/me");
          setProfile(profileData);
        } catch (profileErr) {
          // If the profile doesn't exist yet, send them to the profile page to set it up!
          const msg = profileErr.message.toLowerCase();
          if (msg.includes("profile") || msg.includes("not found") || msg.includes("404")) {
            router.push("/profile");
            return;
          }
          throw profileErr; // Re-throw any other critical auth errors
        }

        await loadPlans();
      } catch (error) {
        console.error("Dashboard loading failed:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router, loadPlans]);

  async function handleGeneratePlan() {
    setGenerating(true);
    setMessage("");

    try {
      await apiFetch("/plans/generate", {
        method: "POST",
      });

      await loadPlans(true);
      setMessage("Your new fitness plan is ready!");
    } catch (error) {
      setMessage(error.message || "Couldn't generate your plan. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0]">
        <div className="rounded-xl border-2 border-black bg-white px-8 py-6 shadow-[5px_5px_0_#111]">
          <div className="flex items-center gap-3 font-bold">
            <Activity className="animate-pulse" size={22} />
            Loading NutriSculpt...
          </div>
        </div>
      </main>
    );
  }

  const latestWorkout =
    workoutPlans.find(
      (plan) => String(plan.id) === String(selectedWorkoutPlanId),
    ) ||
    (workoutPlans.length > 0 ? workoutPlans[workoutPlans.length - 1] : null);

  const latestMealPlan =
    mealPlans.find((plan) => String(plan.id) === String(selectedMealPlanId)) ||
    (mealPlans.length > 0 ? mealPlans[mealPlans.length - 1] : null);

  const totalExercises =
    latestWorkout?.days?.reduce(
      (total, day) => total + (day.exercises?.length || 0),
      0,
    ) || 0;

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-[#111111]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col border-b-2 border-black bg-white p-5 md:min-h-screen md:w-[250px] md:border-b-0 md:border-r-2 md:p-6">
          <a href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-[#ffdf00] shadow-[3px_3px_0_#111]">
              <Dumbbell size={23} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                NutriSculpt
              </h1>
              <p className="text-xs font-medium text-gray-500">
                YOUR FITNESS HQ
              </p>
            </div>
          </a>

          <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
            Workspace
          </p>

          <nav className="flex gap-2 md:flex-col">
            <a
              href="#overview"
              className="flex flex-1 items-center gap-3 rounded-lg border-2 border-black bg-[#ffdf00] px-3 py-3 font-bold md:flex-none"
            >
              <Activity size={19} />
              Overview
            </a>
            <a
              href="#workouts"
              className="flex flex-1 items-center gap-3 rounded-lg px-3 py-3 font-semibold transition hover:bg-gray-100 md:flex-none"
            >
              <Dumbbell size={19} />
              Workouts
            </a>
            <a
              href="#nutrition"
              className="flex flex-1 items-center gap-3 rounded-lg px-3 py-3 font-semibold transition hover:bg-gray-100 md:flex-none"
            >
              <Salad size={19} />
              Nutrition
            </a>
            <a
              href="/profile"
              className="flex flex-1 items-center gap-3 rounded-lg px-3 py-3 font-semibold transition hover:bg-gray-100 md:flex-none"
            >
              <Target size={19} />
              My Profile
            </a>
          </nav>

          <div className="mt-8 hidden rounded-xl border-2 border-black bg-[#b8f2cf] p-4 md:mt-auto md:block">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white">
              <Sparkles size={19} />
            </div>
            <p className="font-extrabold">Small steps. Big results.</p>
            <p className="mt-1 text-sm">
              Stay consistent and keep building your best self.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border-2 border-black px-4 py-3 font-bold transition hover:bg-red-50 md:mt-5"
          >
            <LogOut size={18} />
            Log out
          </button>
        </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {/* Welcome header */}
          <header
            id="overview"
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                YOUR PERSONAL FITNESS DASHBOARD
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Let&apos;s get
                <span className="relative ml-2 inline-block">
                  stronger.
                  <span className="absolute -bottom-3 left-0 -z-0 h-3 w-full bg-[#ffdf00]" />
                </span>
              </h2>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                Welcome back, {user?.email?.split("@")[0] || "athlete"}. Ready
                to make progress?
              </p>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="ns-button w-full shrink-0 sm:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {generating ? "Generating..." : "Generate My Plan"}
              {!generating && <ArrowUpRight size={18} />}
            </button>
          </header>

          {message && (
            <div
              role="status"
              className="mt-6 flex items-start justify-between gap-3 rounded-xl border-2 border-black bg-white p-4 font-semibold shadow-[3px_3px_0_#111]"
            >
              <p>{message}</p>
              <button
                onClick={() => setMessage("")}
                className="text-sm text-gray-500 hover:text-black"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}

          {/* Profile overview cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="ns-card flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Fitness goal
                </p>
                <p className="mt-3 text-xl font-extrabold capitalize">
                  {profile?.fitness_goal?.replaceAll("_", " ") || "Not set"}
                </p>
              </div>
              <div className="rounded-lg border-2 border-black bg-[#ffdf00] p-2">
                <Target size={21} />
              </div>
            </div>

            <div className="ns-card flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Workout plans
                </p>
                <p className="mt-3 text-3xl font-extrabold">
                  {workoutPlans.length}
                </p>
                <p className="mt-1 text-xs text-gray-500">Created for you</p>
              </div>
              <div className="rounded-lg border-2 border-black bg-[#b8f2cf] p-2">
                <Dumbbell size={21} />
              </div>
            </div>

            <div className="ns-card flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Meal plans
                </p>
                <p className="mt-3 text-3xl font-extrabold">
                  {mealPlans.length}
                </p>
                <p className="mt-1 text-xs text-gray-500">Ready to explore</p>
              </div>
              <div className="rounded-lg border-2 border-black bg-orange-200 p-2">
                <Utensils size={21} />
              </div>
            </div>

            <div className="ns-card flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Daily calories
                </p>
                <p className="mt-3 text-3xl font-extrabold">
                  {latestMealPlan?.calorie_target ?? "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {latestMealPlan ? "kcal target" : "Generate a meal plan"}
                </p>
              </div>
              <div className="rounded-lg border-2 border-black bg-[#ffdf00] p-2">
                <Flame size={21} />
              </div>
            </div>
          </div>

          {/* Workout plan section */}

          {/* Workout plan selector */}
          <div className="mt-10 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_#111]">
            <label
              htmlFor="workout-plan-select"
              className="mb-2 block text-sm font-extrabold uppercase tracking-wider"
            >
              <Dumbbell size={17} className="mr-2 inline" />
              Choose your workout plan
            </label>

            <select
              id="workout-plan-select"
              value={selectedWorkoutPlanId ?? ""}
              onChange={(e) => setSelectedWorkoutPlanId(e.target.value)}
              disabled={workoutPlans.length === 0}
              className="ns-input w-full"
            >
              {workoutPlans.length === 0 ? (
                <option value="">No workout plans available</option>
              ) : (
                workoutPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                    {plan.generated_by_ai ? " (AI)" : " (Manual)"}
                  </option>
                ))
              )}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              {workoutPlans.length} saved workout plan(s)
            </p>
          </div>

          {/* Workout plan section */}
          <WorkoutSection
            latestWorkout={latestWorkout}
            totalExercises={totalExercises}
            handleGeneratePlan={handleGeneratePlan}
            generating={generating}
            loadPlans={loadPlans}
          />

          {/* Meal plan selector */}
          <div className="mt-10 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_#111]">
            <label
              htmlFor="meal-plan-select"
              className="mb-2 block text-sm font-extrabold uppercase tracking-wider"
            >
              <Salad size={17} className="mr-2 inline" />
              Choose your meal plan
            </label>

            <select
              id="meal-plan-select"
              value={selectedMealPlanId ?? ""}
              onChange={(e) => setSelectedMealPlanId(e.target.value)}
              disabled={mealPlans.length === 0}
              className="ns-input w-full"
            >
              {mealPlans.length === 0 ? (
                <option value="">No meal plans available</option>
              ) : (
                mealPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                    {plan.generated_by_ai ? " (AI)" : " (Manual)"}
                  </option>
                ))
              )}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              {mealPlans.length} saved meal plan(s)
            </p>
          </div>

          {/* Nutrition plan section */}
          <MealSection latestMealPlan={latestMealPlan} loadPlans={loadPlans} />

          <footer className="mt-12 flex flex-col justify-between gap-2 border-t-2 border-black/10 py-5 text-xs font-medium text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} NutriSculpt</p>
            <p>Built for consistency, not perfection.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
