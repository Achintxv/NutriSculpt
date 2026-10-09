"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Dumbbell,
  Flame,
  LogOut,
  Salad,
  Sparkles,
  Target,
  Utensils,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadPlans = useCallback(async () => {
    const [workouts, meals] = await Promise.all([
      apiFetch("/plans/workouts"),
      apiFetch("/plans/meals"),
    ]);

    setWorkoutPlans(workouts);
    setMealPlans(meals);
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userData = await apiFetch("/auth/me");
        setUser(userData);

        const profileData = await apiFetch("/profiles/me");
        setProfile(profileData);

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

      await loadPlans();
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
    workoutPlans.length > 0
      ? workoutPlans[workoutPlans.length - 1]
      : null;

  const latestMealPlan =
    mealPlans.length > 0
      ? mealPlans[mealPlans.length - 1]
      : null;

  const totalExercises =
    latestWorkout?.days?.reduce(
      (total, day) => total + (day.exercises?.length || 0),
      0
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
                Welcome back, {user?.email?.split("@")[0] || "athlete"}.
                Ready to make progress?
              </p>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="ns-button w-full shrink-0 sm:w-auto"
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

          {/* Workout plan */}
          <section id="workouts" className="mt-10 scroll-mt-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  TRAINING
                </p>
                <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                  Your workout plan
                </h3>
              </div>
              {latestWorkout && (
                <div className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-bold">
                  <CalendarDays size={17} />
                  {latestWorkout.days?.length || 0} days
                </div>
              )}
            </div>

            {latestWorkout ? (
              <div className="ns-card overflow-hidden">
                <div className="border-b-2 border-black bg-[#ffdf00] p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest">
                        YOUR TRAINING ROUTINE
                      </p>
                      <h4 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                        {latestWorkout.name}
                      </h4>
                      <p className="mt-2 max-w-2xl text-sm sm:text-base">
                        {latestWorkout.description ||
                          "Your personalized workout routine."}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white">
                      <Dumbbell size={25} />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
                    <span className="rounded-lg border-2 border-black bg-white px-3 py-2">
                      {latestWorkout.days?.length || 0} training days
                    </span>
                    <span className="rounded-lg border-2 border-black bg-white px-3 py-2">
                      {totalExercises} exercises
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
                  {latestWorkout.days?.length ? (
                    latestWorkout.days.map((day) => (
                      <article
                        key={day.id}
                        className="rounded-xl border-2 border-black bg-white p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#b8f2cf] font-extrabold">
                            {day.day_of_week}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              DAY {day.day_of_week}
                            </p>
                            <h5 className="text-lg font-extrabold">
                              {day.title}
                            </h5>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {day.exercises?.length ? (
                            day.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex items-start gap-3 rounded-lg bg-[#f4f4f0] p-3"
                              >
                                <div className="mt-0.5">
                                  <Dumbbell size={17} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold">
                                    {exercise.exercise_name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {exercise.sets != null &&
                                      `${exercise.sets} sets`}
                                    {exercise.reps != null &&
                                      ` × ${exercise.reps} reps`}
                                    {exercise.duration != null &&
                                      ` · ${exercise.duration} min`}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No exercises added yet.
                            </p>
                          )}
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No workout days have been added to this plan yet.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="ns-card flex flex-col items-center px-6 py-12 text-center">
                <div className="rounded-xl border-2 border-black bg-[#ffdf00] p-4">
                  <Dumbbell size={30} />
                </div>
                <h4 className="mt-5 text-xl font-extrabold">
                  Your next chapter starts here
                </h4>
                <p className="mt-2 max-w-md text-sm text-gray-600">
                  Generate your personalized plan to get a workout routine
                  tailored to your fitness goals.
                </p>
                <button
                  onClick={handleGeneratePlan}
                  disabled={generating}
                  className="ns-button mt-5"
                >
                  <Sparkles size={17} />
                  {generating ? "Generating..." : "Create my first plan"}
                </button>
              </div>
            )}
          </section>

          {/* Nutrition plan */}
          <section id="nutrition" className="mt-10 scroll-mt-6">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                FUEL YOUR BODY
              </p>
              <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Nutrition & meals
              </h3>
            </div>

            {latestMealPlan ? (
              <div className="ns-card overflow-hidden">
                <div className="border-b-2 border-black bg-[#b8f2cf] p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest">
                        YOUR DAILY FUEL
                      </p>
                      <h4 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                        {latestMealPlan.name}
                      </h4>
                      <p className="mt-2 text-sm">
                        A nutrition plan to support your fitness journey.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-4">
                      <Flame size={25} />
                      <div>
                        <p className="text-2xl font-extrabold">
                          {latestMealPlan.calorie_target ?? "—"}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          kcal / day
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                  {latestMealPlan.meals?.length ? (
                    latestMealPlan.meals.map((meal) => (
                      <article
                        key={meal.id}
                        className="flex flex-col rounded-xl border-2 border-black bg-white p-4 transition hover:-translate-y-1 hover:shadow-[4px_4px_0_#111]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-lg border-2 border-black bg-[#ffdf00] px-3 py-1 text-xs font-extrabold uppercase">
                            {meal.meal_type}
                          </span>
                          <Salad size={20} />
                        </div>

                        <h5 className="mt-4 text-xl font-extrabold">
                          {meal.name}
                        </h5>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-[#f4f4f0] p-3">
                            <p className="text-xs font-semibold text-gray-500">
                              Calories
                            </p>
                            <p className="mt-1 font-extrabold">
                              {meal.calories ?? "—"}
                              <span className="ml-1 text-xs font-medium">
                                kcal
                              </span>
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#f4f4f0] p-3">
                            <p className="text-xs font-semibold text-gray-500">
                              Protein
                            </p>
                            <p className="mt-1 font-extrabold">
                              {meal.protein ?? "—"}
                              <span className="ml-1 text-xs font-medium">
                                g
                              </span>
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#f4f4f0] p-3">
                            <p className="text-xs font-semibold text-gray-500">
                              Carbs
                            </p>
                            <p className="mt-1 font-extrabold">
                              {meal.carbs ?? "—"} g
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#f4f4f0] p-3">
                            <p className="text-xs font-semibold text-gray-500">
                              Fat
                            </p>
                            <p className="mt-1 font-extrabold">
                              {meal.fat ?? "—"} g
                            </p>
                          </div>
                        </div>

                        {meal.notes && (
                          <p className="mt-4 border-t border-dashed border-gray-300 pt-3 text-sm text-gray-600">
                            {meal.notes}
                          </p>
                        )}
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No meals have been added to this plan yet.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="ns-card flex flex-col items-center px-6 py-12 text-center">
                <div className="rounded-xl border-2 border-black bg-[#b8f2cf] p-4">
                  <Salad size={30} />
                </div>
                <h4 className="mt-5 text-xl font-extrabold">
                  Give your goals the right fuel
                </h4>
                <p className="mt-2 max-w-md text-sm text-gray-600">
                  Generate a personalized meal plan to see your meals,
                  calories, and macros here.
                </p>
              </div>
            )}
          </section>

          <footer className="mt-12 flex flex-col justify-between gap-2 border-t-2 border-black/10 py-5 text-xs font-medium text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} NutriSculpt</p>
            <p>Built for consistency, not perfection.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}