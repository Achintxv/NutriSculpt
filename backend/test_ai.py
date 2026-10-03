from app.models.profile import Profile
from app.services.ai_service import generate_fitness_plan


profile = Profile(
    age=22,
    height=175,
    weight=70,
    fitness_goal="muscle gain",
    activity_level="moderate",
    fitness_experience="beginner",
    workout_days_per_week=4,
    dietary_preference="vegetarian",
    allergies="peanuts",
)

plan = generate_fitness_plan(profile)

print(plan)