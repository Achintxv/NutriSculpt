from fastapi import FastAPI
from app.core.database import engine
app = FastAPI()
from sqlalchemy import text

@app.get('/')
def root():
    return {'message':'NutriSculpt API is running'}

@app.get('/health/db')
def database_health():
    with engine.connect() as connection:
        connection.execute(text('SELECT 1'))

    return {"database":"connected"}