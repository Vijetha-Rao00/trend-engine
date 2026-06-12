from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import trends, youtube, news
from models.database import Base, engine
import os

load_dotenv()

# Automatically create the required PostgreSQL tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trend Engine API")

# Inline middleware to automatically collapse consecutive double slashes in inbound paths
@app.middleware("http")
async def collapse_double_slashes(request: Request, call_next):
    path = request.scope.get("path", "")
    if "//" in path:
        while "//" in path:
            path = path.replace("//", "/")
        request.scope["path"] = path
    response = await call_next(request)
    return response

# Standardize to public wildcard origins to allow dynamic Vercel previews and local connections seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when using allow_origins=["*"]
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