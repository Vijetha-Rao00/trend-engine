from fastapi import APIRouter, HTTPException
from services.tavily import get_news, get_multi_keyword_news
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/news", tags=["news"])

class NewsRequest(BaseModel):
    keyword: str
    max_results: int = 5

class MultiNewsRequest(BaseModel):
    keywords: List[str]

@router.post("/latest")
async def get_latest_news(request: NewsRequest):
    try:
        news = await get_news(
            keyword=request.keyword,
            max_results=request.max_results
        )
        return news
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multi")
async def get_multi_news(request: MultiNewsRequest):
    try:
        news = await get_multi_keyword_news(request.keywords)
        return news
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))