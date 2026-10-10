"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Dumbbell,
  HeartPulse,
  LoaderCircle,
  Save,
  Salad,
  Target,
} from "lucide-react";

const initialForm = {
  height: "",
  weight: "",
  age: "",
  fitness_goal: "",
  activity_level: "",
  fitness_experience: "",
  workout_days_per_week: "",
  dietary_preference: "",
  allergies: "",
};

const fieldClass =
  "ns-input mt-2";

const labelClass = "block text-sm font-bold";

function FormField({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={fieldClass}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
    </label>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <label className={labelClass}>
      {label}
      <select
        className={fieldClass}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#ffdf00]">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await apiFetch("/profiles/me");

        if (!active) return;

        setForm({
          height: data.height ?? "",
          weight: data.weight ?? "",
          age: data.age ?? "",
          fitness_goal: data.fitness_goal ?? "",
          activity_level: data.activity_level ?? "",
          fitness_experience: data.fitness_experience ?? "",
          workout_days_per_week: data.workout_days_per_week ?? "",
          dietary_preference: data.dietary_preference ?? "",
          allergies: data.allergies ?? "",
        });
      } catch (err) {
        if (!active) return;

        setError(
          err.message || "Unable to load your profile. Please try again."
        );
      } finally {
        if (active) setPageLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await apiFetch("/profiles/me", {
        method: "POST",
        body: JSON.stringify({
          height: Number(form.height),
          weight: Number(form.weight),
          age: Number(form.age),
          fitness_goal: form.fitness_goal,
          activity_level: form.activity_level,
          fitness_experience: form.fitness_experience,
          workout_days_per_week: Number(form.workout_days_per_week),
          dietary_preference: form.dietary_preference,
          allergies: form.allergies.trim() || null,
        }),
      });

      setSuccess("Profile saved successfully!");

      // Give the user a moment to see the confirmation.
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err) {
      setError(err.message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f4f0]">
        <div className="ns-card flex items-center gap-3 px-6 py-5 font-bold">
          <LoaderCircle className="animate-spin" size={22} />
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f4f0] px-4 py-6 text-[#111111] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-2 font-bold transition hover:bg-[#ffdf00]"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <header className="relative overflow-hidden rounded-xl border-2 border-black bg-[#ffdf00] p-6 shadow-[6px_6px_0_#111] sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wider">
              <Target size={16} />
              Your fitness identity
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Build your profile.
              <br />
              Build your plan.
            </h1>

            <p className="mt-4 max-w-xl text-sm font-medium sm:text-base">
              Tell us about your body, routine, and food preferences.
              NutriSculpt uses these details to personalize your fitness plans.
            </p>
          </div>

          <Dumbbell
            className="absolute -bottom-5 -right-4 hidden rotate-[-20deg] opacity-15 sm:block"
            size={170}
          />
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Body information */}
          <section className="ns-card p-5 sm:p-7">
            <SectionHeading
              icon={HeartPulse}
              title="About you"
              description="Your basic measurements help personalize your plans."
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField
                label="Height (cm)"
                name="height"
                type="number"
                min="1"
                max="300"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                required
              />

              <FormField
                label="Weight (kg)"
                name="weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 70"
                required
              />

              <FormField
                label="Age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 22"
                required
              />
            </div>
          </section>

          {/* Training preferences */}
          <section className="ns-card p-5 sm:p-7">
            <SectionHeading
              icon={Dumbbell}
              title="Training preferences"
              description="Choose a goal and a training level that suit you."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormSelect
                label="Fitness goal"
                name="fitness_goal"
                value={form.fitness_goal}
                onChange={handleChange}
                options={[
                  { value: "muscle_gain", label: "Muscle Gain" },
                  { value: "fat_loss", label: "Fat Loss" },
                  { value: "maintenance", label: "Maintenance" },
                  { value: "general_fitness", label: "General Fitness" },
                ]}
              />

              <FormSelect
                label="Activity level"
                name="activity_level"
                value={form.activity_level}
                onChange={handleChange}
                options={[
                  { value: "sedentary", label: "Sedentary" },
                  { value: "light", label: "Lightly Active" },
                  { value: "moderate", label: "Moderately Active" },
                  { value: "very_active", label: "Very Active" },
                ]}
              />

              <FormSelect
                label="Fitness experience"
                name="fitness_experience"
                value={form.fitness_experience}
                onChange={handleChange}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />

              <FormField
                label="Workout days per week"
                name="workout_days_per_week"
                type="number"
                min="1"
                max="7"
                value={form.workout_days_per_week}
                onChange={handleChange}
                placeholder="Choose 1–7 days"
                required
              />
            </div>
          </section>

          {/* Nutrition preferences */}
          <section className="ns-card p-5 sm:p-7">
            <SectionHeading
              icon={Salad}
              title="Nutrition preferences"
              description="Help us make your meal plans more suitable for you."
            />

            <div className="space-y-5">
              <FormSelect
                label="Dietary preference"
                name="dietary_preference"
                value={form.dietary_preference}
                onChange={handleChange}
                options={[
                  { value: "omnivore", label: "Omnivore" },
                  { value: "vegetarian", label: "Vegetarian" },
                  { value: "vegan", label: "Vegan" },
                  { value: "eggetarian", label: "Eggetarian" },
                ]}
              />

              <label className={labelClass}>
                Food allergies or restrictions
                <textarea
                  className={`${fieldClass} min-h-28 resize-y`}
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="e.g. peanuts, lactose intolerance (optional)"
                  rows={4}
                />
                <span className="mt-2 block text-xs font-medium text-gray-500">
                  Mention any food allergies or ingredients you need to avoid.
                </span>
              </label>
            </div>
          </section>

          {/* Feedback */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border-2 border-black bg-red-100 p-4 font-semibold"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#b8f2cf] p-4 font-bold"
            >
              <Check size={20} />
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border-2 border-black bg-white px-6 py-3 font-bold transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="ns-button min-w-48"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" size={19} />
              ) : (
                <Save size={19} />
              )}
              {saving ? "Saving profile..." : "Save my profile"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-gray-500">
          Your goals can change. Update your profile whenever you need to.
        </p>
      </div>
    </main>
  );
}