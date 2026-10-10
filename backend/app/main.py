from fastapi import FastAPI
from app.core.database import engine
from sqlalchemy import text
from app.api.users import router as users_router
from app.api.profiles import router as profile_router
from app.api.auth import router as auth_router
from app.api.workouts import router as workout_router
from app.api.meals import router as meal_router
from app.api.plans import router as plan_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users_router)
app.include_router(profile_router)
app.include_router(auth_router)
app.include_router(workout_router)
app.include_router(meal_router)
app.include_router(plan_router)

@app.get('/')
def root():
    return {'message':'NutriSculpt API is running'}

@app.get('/health')
def root():
    return {'message': 'Status ok'}

@app.get('/health/db')
def database_health():
    with engine.connect() as connection:
        connection.execute(text('SELECT 1'))

    return {"database":"connected"}