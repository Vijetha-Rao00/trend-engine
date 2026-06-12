from fastapi import APIRouter, HTTPException
from services.youtube import get_trending_videos
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/youtube", tags=["youtube"])

class YoutubeRequest(BaseModel):
    keyword: str
    max_results: int = 10

@router.post("/trending")
async def get_trending(request: YoutubeRequest):
    try:
        videos = await get_trending_videos(
            keyword=request.keyword,
            max_results=request.max_results
        )
        return {"videos": videos, "count": len(videos)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multi")
async def get_multi_trending(keywords: List[str], max_results: int = 5):
    try:
        all_videos = []
        for keyword in keywords:
            videos = await get_trending_videos(keyword, max_results)
            all_videos.extend(videos)
        
        all_videos = sorted(all_videos, key=lambda x: x["views"], reverse=True)
        seen = set()
        unique_videos = []
        for v in all_videos:
            if v["video_id"] not in seen:
                seen.add(v["video_id"])
                unique_videos.append(v)
        
        return {"videos": unique_videos[:20], "count": len(unique_videos[:20])}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))