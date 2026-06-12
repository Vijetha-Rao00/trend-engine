from sqlalchemy import create_engine, Column, Integer, String, Float, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Dynamically patch the legacy postgres:// prefix to postgresql:// for SQLAlchemy 1.4+ compatibility
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Keyword(Base):
    __tablename__ = "keywords"
    id = Column(Integer, primary_key=True)
    keyword = Column(String(100))
    industry = Column(String(100))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class YoutubeTrend(Base):
    __tablename__ = "youtube_trends"
    id = Column(Integer, primary_key=True)
    keyword_id = Column(Integer)
    video_id = Column(String(50))
    title = Column(Text)
    channel = Column(String(200))
    views = Column(Integer)
    likes = Column(Integer)
    published_at = Column(TIMESTAMP)
    fetched_at = Column(TIMESTAMP, default=datetime.utcnow)

class GoogleTrend(Base):
    __tablename__ = "google_trends"
    id = Column(Integer, primary_key=True)
    keyword_id = Column(Integer)
    interest_score = Column(Integer)
    recorded_at = Column(TIMESTAMP)
    fetched_at = Column(TIMESTAMP, default=datetime.utcnow)

class NewsItem(Base):
    __tablename__ = "news_items"
    id = Column(Integer, primary_key=True)
    keyword_id = Column(Integer)
    title = Column(Text)
    url = Column(Text)
    summary = Column(Text)
    published_at = Column(TIMESTAMP)
    fetched_at = Column(TIMESTAMP, default=datetime.utcnow)

class MomentumScore(Base):
    __tablename__ = "momentum_scores"
    id = Column(Integer, primary_key=True)
    keyword_id = Column(Integer)
    score = Column(Float)
    velocity = Column(Float)
    volume = Column(Float)
    calculated_at = Column(TIMESTAMP, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()