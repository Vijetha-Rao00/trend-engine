import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_trend_insight(
    keywords: list,
    momentum_scores: dict,
    top_videos: list,
    news_summary: str,
    industry: str
):
    video_titles = [v["title"] for v in top_videos[:5]]
    
    rising = [k for k, v in momentum_scores.items() if v.get("is_rising")]
    emerging = [k for k, v in momentum_scores.items() if v.get("is_emerging")]
    
    prompt = f"""
You are a content strategist specializing in {industry}.

Based on the following trend data, generate a concise, actionable insight brief.

KEYWORDS TRACKED: {', '.join(keywords)}
RISING KEYWORDS: {', '.join(rising) if rising else 'None'}
EMERGING KEYWORDS (early stage): {', '.join(emerging) if emerging else 'None'}
TOP YOUTUBE VIDEOS THIS PERIOD: {', '.join(video_titles)}
NEWS SUMMARY: {news_summary}

Write a brief with exactly 3 sections:
1. WHAT'S HAPPENING NOW (2 sentences max)
2. WHAT TO WATCH (2 emerging angles worth creating content about)
3. THIS WEEK'S RECOMMENDATION (1 specific content idea with a suggested title)

Be specific, direct, and actionable. No fluff.
"""
    
    try:
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        return response.text
    except Exception as e:
        return f"Insight generation failed: {str(e)}"

async def generate_forecast(
    keywords: list,
    momentum_scores: dict,
    industry: str
):
    keyword_data = []
    for k, v in momentum_scores.items():
        keyword_data.append(
            f"{k}: momentum={v.get('momentum', 0)}%, "
            f"volume={v.get('current_volume', 0)}, "
            f"emerging={v.get('is_emerging', False)}"
        )
    
    prompt = f"""
You are a trend forecaster for the {industry} industry.

Based on momentum scores for these keywords, predict which topics will trend in the next 2-4 weeks.

KEYWORD DATA:
{chr(10).join(keyword_data)}

Provide:
1. TOP 3 PREDICTED TRENDS (with confidence: high/medium/low and a one-line reason)
2. ONE WILDCARD (a topic not in the list that might emerge based on these signals)
3. ONE TOPIC TO AVOID (oversaturated or declining)

Be specific and direct.
"""
    
    try:
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        return response.text
    except Exception as e:
        return f"Forecast generation failed: {str(e)}"