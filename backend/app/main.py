from fastapi import FastAPI
from app.core.database import engine
from sqlalchemy import text
from app.api.users import router as users_router

app = FastAPI()

app.include_router(users_router)

@app.get('/')
def root():
    return {'message':'NutriSculpt API is running'}

@app.get('/health/db')
def database_health():
    with engine.connect() as connection:
        connection.execute(text('SELECT 1'))

    return {"database":"connected"}