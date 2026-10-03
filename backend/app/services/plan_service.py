from sqlalchemy.orm import Session

from app.models.meal import Meal, MealPlan
from app.models.workout import WorkoutDay, WorkoutExercise, WorkoutPlan
from app.schemas.ai import AIFitnessPlan

def save_fitness_plan(
    plan: AIFitnessPlan,
    user_id: int,
    db: Session,
):
    workout_plan = WorkoutPlan(
    user_id=user_id,
    name=plan.workout.name,
    description=plan.workout.description,
    generated_by_ai=True,
)
    db.add(workout_plan)
    for day_data in plan.workout.days:
        workout_day = WorkoutDay(
            day_of_week=day_data.day_of_week,
            title=day_data.title,
        )

        workout_plan.days.append(workout_day)
        for exercise_data in day_data.exercises:
            exercise = WorkoutExercise(
                exercise_name=exercise_data.exercise_name,
                sets=exercise_data.sets,
                reps=exercise_data.reps,
                duration=exercise_data.duration,
                rest_seconds=exercise_data.rest_seconds,
                notes=exercise_data.notes,
                order_index=exercise_data.order_index,
            )

            workout_day.exercises.append(exercise)

    meal_plan = MealPlan(
        user_id=user_id,
        name=plan.meal_plan.name,
        calorie_target=plan.meal_plan.calorie_target,
        generated_by_ai=True,
    )

    db.add(meal_plan)
    for meal_data in plan.meal_plan.meals:
        meal = Meal(
            meal_type=meal_data.meal_type,
            name=meal_data.name,
            calories=meal_data.calories,
            protein=meal_data.protein,
            carbs=meal_data.carbs,
            fat=meal_data.fat,
            notes=meal_data.notes,
        )

        meal_plan.meals.append(meal)


    try:
    # create objects
        db.commit()

    except Exception:
        db.rollback()
        raise

    db.refresh(workout_plan)
    db.refresh(meal_plan)
    return workout_plan, meal_plan