from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import trends, youtube, news
from models.database import Base, engine
import os

load_dotenv()

# Automatically create the required PostgreSQL tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trend Engine API")

# Dynamically load permitted origins for CORS validation from environment variables
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trends.router)
app.include_router(youtube.router)
app.include_router(news.router)

@app.get("/")
def root():
    return {"status": "Trend Engine is running"}

@app.get("/health")
def health():
    return {"status": "ok"}