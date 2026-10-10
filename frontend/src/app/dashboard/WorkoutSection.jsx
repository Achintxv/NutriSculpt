import { Dumbbell, CalendarDays, Pencil, X } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { useState } from "react";

export default function WorkoutSection({
  latestWorkout,
  totalExercises,
  handleGeneratePlan,
  generating,
  loadPlans,
}) {
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseForm, setExerciseForm] = useState({});
  const [savingExercise, setSavingExercise] = useState(false);
  const [editError, setEditError] = useState("");

  function startEditingExercise(exercise) {
    setEditingExercise(exercise.id);
    setEditError("");

    setExerciseForm({
      exercise_name: exercise.exercise_name ?? "",
      sets: exercise.sets ?? "",
      reps: exercise.reps ?? "",
      duration: exercise.duration ?? "",
    });
  }

  async function saveExercise(workoutId, exerciseId) {
    if (!exerciseForm.exercise_name.trim()) {
      setEditError("Exercise name is required.");
      return;
    }

    setSavingExercise(true);
    setEditError("");

    try {
      await apiFetch(`/workouts/${workoutId}/exercises/${exerciseId}`, {
        method: "PUT",
        body: JSON.stringify({
          exercise_name: exerciseForm.exercise_name.trim(),
          sets: exerciseForm.sets === "" ? null : Number(exerciseForm.sets),
          reps: exerciseForm.reps === "" ? null : Number(exerciseForm.reps),
          duration:
            exerciseForm.duration === "" ? null : Number(exerciseForm.duration),
        }),
      });

      await loadPlans();
      setEditingExercise(null);
    } catch (error) {
      setEditError(error.message || "Couldn't update the exercise.");
    } finally {
      setSavingExercise(false);
    }
  }

  return (
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
                      <h5 className="text-lg font-extrabold">{day.title}</h5>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {day.exercises?.length ? (
                      day.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="rounded-lg border-2 border-black bg-[#f4f4f0] p-3"
                        >
                          {editingExercise === exercise.id ? (
                            <div className="space-y-3">
                              <label className="block text-sm font-bold">
                                Exercise name
                                <input
                                  className="ns-input mt-1 w-full"
                                  value={exerciseForm.exercise_name}
                                  onChange={(e) =>
                                    setExerciseForm({
                                      ...exerciseForm,
                                      exercise_name: e.target.value,
                                    })
                                  }
                                  placeholder="Exercise name"
                                />
                              </label>

                              <div className="grid grid-cols-3 gap-2">
                                <label className="text-sm font-bold">
                                  Sets
                                  <input
                                    className="ns-input mt-1 w-full"
                                    type="number"
                                    min="0"
                                    value={exerciseForm.sets}
                                    onChange={(e) =>
                                      setExerciseForm({
                                        ...exerciseForm,
                                        sets: e.target.value,
                                      })
                                    }
                                  />
                                </label>

                                <label className="text-sm font-bold">
                                  Reps
                                  <input
                                    className="ns-input mt-1 w-full"
                                    type="number"
                                    min="0"
                                    value={exerciseForm.reps}
                                    onChange={(e) =>
                                      setExerciseForm({
                                        ...exerciseForm,
                                        reps: e.target.value,
                                      })
                                    }
                                  />
                                </label>

                                <label className="text-sm font-bold">
                                  Minutes
                                  <input
                                    className="ns-input mt-1 w-full"
                                    type="number"
                                    min="0"
                                    value={exerciseForm.duration}
                                    onChange={(e) =>
                                      setExerciseForm({
                                        ...exerciseForm,
                                        duration: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                              </div>

                              {editError && (
                                <p className="text-sm font-bold text-red-600">
                                  {editError}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveExercise(latestWorkout.id, exercise.id)
                                  }
                                  disabled={savingExercise}
                                  className="ns-button flex items-center gap-2"
                                >
                                  {savingExercise ? "Saving..." : "Save"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExercise(null);
                                    setEditError("");
                                  }}
                                  disabled={savingExercise}
                                  className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-bold"
                                >
                                  <X size={16} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
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

                              <button
                                type="button"
                                onClick={() => startEditingExercise(exercise)}
                                className="flex shrink-0 items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1.5 text-sm font-bold hover:bg-[#ffdf00]"
                                aria-label={`Edit ${exercise.exercise_name}`}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                            </div>
                          )}
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
            Generate your personalized plan to get a workout routine tailored to
            your fitness goals.
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="ns-button mt-5 flex items-center gap-2"
          >
            {generating ? "Generating..." : "Create my first plan"}
          </button>
        </div>
      )}
    </section>
  );
}
