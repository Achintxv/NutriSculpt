"use client"

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Profile(){
    const router = useRouter();
    
    const [form, setForm] = useState({
        height: "",
        weight: "",
        age: "",
        fitness_goal: "",
        activity_level: "",
        fitness_experience: "",
        workout_days_per_week: "",
        dietary_preference: "",
        allergies: "",
    });

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        async function loadProfile() {
            try {
                const data = await apiFetch("/profiles/me");
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
                })
            } catch (error) {
                console.log(error.message)
            }
        }
        loadProfile()
    }, [])

    function handleChange(event){
        const {name, value} = event.target;
        setForm((previous)=>({
            ...previous,
            [name]:value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await apiFetch("/profiles/me",{
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
                    allergies: form.allergies || null,
                })
            })
            router.push("/dashboard")
        } catch (error) {
            setError(error.message);
        }finally{
            setLoading(false)
        }
    }
    
    return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
            Complete your profile
        </h1>
        <p className="mt-2 text-gray-500">
            This information helps NutriSculpt create your personalized plans.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input name="height" type="number" placeholder="Height (cm)" value={form.height} onChange={handleChange} required className="w-full rounded-lg border p-3" />

            <input name="weight" type="number" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required className="w-full rounded-lg border p-3" />

            <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required className="w-full rounded-lg border p-3" />

            <select name="fitness_goal" value={form.fitness_goal} onChange={handleChange} required className="w-full rounded-lg border p-3" >
                <option value="">Fitness Goal</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="general_fitness">General Fitness</option>
            </select>

            <select name="activity_level" value={form.activity_level} onChange={handleChange} required className="w-full rounded-lg border p-3" >
                <option value="">Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="very_active">Very Active</option>
            </select>

            <select name="fitness_experience" value={form.fitness_experience} onChange={handleChange} required className="w-full rounded-lg border p-3" >
                <option value="">Fitness Experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>

            <input name="workout_days_per_week" type="number" min="1" max="7" placeholder="Workout days per week" value={form.workout_days_per_week} onChange={handleChange} required className="w-full rounded-lg border p-3" />

            <select name="dietary_preference" value={form.dietary_preference} onChange={handleChange} required className="w-full rounded-lg border p-3" >
                <option value="">Dietary Preference</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
            </select>

            <textarea name="allergies" placeholder="Food Allergies (optional)" value={form.allergies} onChange={handleChange} className="w-full rounded-lg border p-3"></textarea>

            {error && (
                <p className="text-red-500">{error}</p>
            )}

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-black p-3 text-white cursor-pointer">
                {loading ? "Saving" : "Continue"}
            </button>
        </form>
      </div>
    </div>
  )
}
