import httpx
import os
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
BASE_URL = "https://www.googleapis.com/youtube/v3"

async def get_trending_videos(keyword: str, max_results: int = 10):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "q": keyword,
                "type": "video",
                "order": "viewCount",
                "publishedAfter": "2024-01-01T00:00:00Z",
                "maxResults": max_results,
                "key": YOUTUBE_API_KEY
            }
        )
        data = response.json()
        
        if "items" not in data:
            return []
        
        video_ids = [item["id"]["videoId"] for item in data["items"]]
        
        stats_response = await client.get(
            f"{BASE_URL}/videos",
            params={
                "part": "statistics,snippet",
                "id": ",".join(video_ids),
                "key": YOUTUBE_API_KEY
            }
        )
        stats_data = stats_response.json()
        
        videos = []
        for item in stats_data.get("items", []):
            videos.append({
                "video_id": item["id"],
                "title": item["snippet"]["title"],
                "channel": item["snippet"]["channelTitle"],
                "views": int(item["statistics"].get("viewCount", 0)),
                "likes": int(item["statistics"].get("likeCount", 0)),
                "published_at": item["snippet"]["publishedAt"]
            })
        
        return sorted(videos, key=lambda x: x["views"], reverse=True)