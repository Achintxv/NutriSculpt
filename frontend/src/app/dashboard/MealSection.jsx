import { useState } from "react";
import { Salad, Flame, Pencil, X } from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function MealSection({ latestMealPlan, loadPlans }) {
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealForm, setMealForm] = useState({});
  const [savingMeal, setSavingMeal] = useState(false);
  const [editError, setEditError] = useState("");

  function startEditingMeal(meal) {
    setEditingMeal(meal.id);
    setEditError("");

    setMealForm({
      meal_type: meal.meal_type ?? "",
      name: meal.name ?? "",
      calories: meal.calories ?? "",
      protein: meal.protein ?? "",
      carbs: meal.carbs ?? "",
      fat: meal.fat ?? "",
      notes: meal.notes ?? "",
    });
  }

  async function saveMeal(mealPlanId, mealId) {
    if (!mealForm.name.trim()) {
      setEditError("Meal name is required.");
      return;
    }

    setSavingMeal(true);
    setEditError("");

    try {
      await apiFetch(`/meals/${mealPlanId}/meals/${mealId}`, {
        method: "PUT",
        body: JSON.stringify({
          meal_type: mealForm.meal_type,
          name: mealForm.name.trim(),
          calories: mealForm.calories === "" ? null : Number(mealForm.calories),
          protein: mealForm.protein === "" ? null : Number(mealForm.protein),
          carbs: mealForm.carbs === "" ? null : Number(mealForm.carbs),
          fat: mealForm.fat === "" ? null : Number(mealForm.fat),
          notes: mealForm.notes.trim() || null,
        }),
      });

      await loadPlans();
      setEditingMeal(null);
    } catch (error) {
      setEditError(error.message || "Couldn't update this meal.");
    } finally {
      setSavingMeal(false);
    }
  }

  return (
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
                  {editingMeal === meal.id ? (
                    <div className="space-y-3">
                      <label className="block text-sm font-bold">
                        Meal type
                        <input
                          className="ns-input mt-1 w-full"
                          value={mealForm.meal_type}
                          onChange={(e) =>
                            setMealForm({
                              ...mealForm,
                              meal_type: e.target.value,
                            })
                          }
                          placeholder="e.g. Breakfast"
                        />
                      </label>

                      <label className="block text-sm font-bold">
                        Meal name
                        <input
                          className="ns-input mt-1 w-full"
                          value={mealForm.name}
                          onChange={(e) =>
                            setMealForm({
                              ...mealForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Meal name"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["calories", "Calories"],
                          ["protein", "Protein (g)"],
                          ["carbs", "Carbs (g)"],
                          ["fat", "Fat (g)"],
                        ].map(([field, label]) => (
                          <label key={field} className="text-sm font-bold">
                            {label}
                            <input
                              className="ns-input mt-1 w-full"
                              type="number"
                              min="0"
                              value={mealForm[field]}
                              onChange={(e) =>
                                setMealForm({
                                  ...mealForm,
                                  [field]: e.target.value,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>

                      <label className="block text-sm font-bold">
                        Notes
                        <textarea
                          className="ns-input mt-1 w-full"
                          rows={3}
                          value={mealForm.notes}
                          onChange={(e) =>
                            setMealForm({
                              ...mealForm,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Optional notes or ingredients"
                        />
                      </label>

                      {editError && (
                        <p className="text-sm font-bold text-red-600">
                          {editError}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => saveMeal(latestMealPlan.id, meal.id)}
                          disabled={savingMeal}
                          className="ns-button"
                        >
                          {savingMeal ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingMeal(null);
                            setEditError("");
                          }}
                          disabled={savingMeal}
                          className="flex items-center gap-1 rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-bold"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-lg border-2 border-black bg-[#ffdf00] px-3 py-1 text-xs font-extrabold uppercase">
                          {meal.meal_type}
                        </span>

                        <div className="flex items-center gap-2">
                          <Salad size={20} />
                          <button
                            type="button"
                            onClick={() => startEditingMeal(meal)}
                            className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1.5 text-sm font-bold hover:bg-[#ffdf00]"
                            aria-label={`Edit ${meal.name}`}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                        </div>
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
                            <span className="ml-1 text-xs font-medium">g</span>
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
                    </>
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
            Generate a personalized meal plan to see your meals, calories, and
            macros here.
          </p>
        </div>
      )}
    </section>
  );
}
