from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Keyword, GoogleTrend, MomentumScore
from services.google_trends import get_interest_over_time, get_momentum_score
from services.tavily import get_news
from services.gemini import generate_trend_insight, generate_forecast
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(prefix="/trends", tags=["trends"])

class KeywordRequest(BaseModel):
    keywords: List[str]
    industry: str

@router.post("/analyze")
async def analyze_trends(request: KeywordRequest, db: Session = Depends(get_db)):
    try:
        interest_data = get_interest_over_time(request.keywords)
        momentum_data = get_momentum_score(request.keywords)
        news_data = await get_news(" ".join(request.keywords))
        
        for keyword in request.keywords:
            db_keyword = db.query(Keyword).filter(
                Keyword.keyword == keyword,
                Keyword.industry == request.industry
            ).first()
            
            if not db_keyword:
                db_keyword = Keyword(
                    keyword=keyword,
                    industry=request.industry
                )
                db.add(db_keyword)
                db.commit()
                db.refresh(db_keyword)
            
            if keyword in momentum_data:
                score = MomentumScore(
                    keyword_id=db_keyword.id,
                    score=float(momentum_data[keyword]["momentum"]),
                    velocity=float(momentum_data[keyword]["momentum"]),
                    volume=float(momentum_data[keyword]["current_volume"]),
                    calculated_at=datetime.utcnow()
                )
                db.add(score)
        
        db.commit()
        
        return {
            "interest_over_time": interest_data,
            "momentum_scores": momentum_data,
            "news": news_data
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/insight")
async def get_insight(request: KeywordRequest):
    try:
        momentum_data = get_momentum_score(request.keywords)
        news_data = await get_news(" ".join(request.keywords))
        
        insight = await generate_trend_insight(
            keywords=request.keywords,
            momentum_scores=momentum_data,
            top_videos=[],
            news_summary=news_data.get("answer", ""),
            industry=request.industry
        )
        
        return {"insight": insight}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forecast")
async def get_forecast(request: KeywordRequest):
    try:
        momentum_data = get_momentum_score(request.keywords)
        
        forecast = await generate_forecast(
            keywords=request.keywords,
            momentum_scores=momentum_data,
            industry=request.industry
        )
        
        return {"forecast": forecast}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))