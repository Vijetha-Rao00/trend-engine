from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

async def get_news(keyword: str, max_results: int = 5):
    try:
        response = client.search(
            query=keyword,
            search_depth="basic",
            max_results=max_results,
            include_answer=True
        )
        
        news_items = []
        for result in response.get("results", []):
            news_items.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "summary": result.get("content", "")[:300],
                "published_at": result.get("published_date", None)
            })
        
        return {
            "items": news_items,
            "answer": response.get("answer", "")
        }
    
    except Exception as e:
        return {"items": [], "answer": "", "error": str(e)}

async def get_multi_keyword_news(keywords: list):
    query = " OR ".join(keywords)
    return await get_news(query)