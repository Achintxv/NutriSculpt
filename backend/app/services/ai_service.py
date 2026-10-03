from google import genai
from google.genai import types

from app.core.config import settings
from app.models.profile import Profile
from app.schemas.ai import AIFitnessPlan

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

def generate_fitness_plan(profile: Profile) -> AIFitnessPlan:
    prompt = f"""
Create a personalized fitness plan for this user.

User profile:
- Age: {profile.age}
- Height: {profile.height} cm
- Weight: {profile.weight} kg
- Fitness goal: {profile.fitness_goal}
- Activity level: {profile.activity_level}
- Fitness experience: {profile.fitness_experience}
- Workout days per week: {profile.workout_days_per_week}
- Dietary preference: {profile.dietary_preference}
- Allergies: {profile.allergies}

Generate:
1. A weekly workout plan.
2. A daily meal plan.

Make the plan practical and appropriate for the user's stated experience,
goal, workout frequency, dietary preference, and allergies.

Return only the structured data matching the requested schema.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AIFitnessPlan,
        ),
    )

    return response.parsed