from pytrends.request import TrendReq

def get_interest_over_time(keywords: list, timeframe: str = "today 3-m"):
    pytrends = TrendReq(hl='en-US', tz=360)
    chunks = [keywords[i:i+5] for i in range(0, len(keywords), 5)]
    all_data = {}
    
    for chunk in chunks:
        pytrends.build_payload(chunk, timeframe=timeframe)
        data = pytrends.interest_over_time()
        
        if not data.empty:
            data = data.drop(columns=["isPartial"], errors="ignore")
            for keyword in chunk:
                if keyword in data.columns:
                    all_data[keyword] = {
                        str(k): int(v) 
                        for k, v in data[keyword].to_dict().items()
                    }
    
    return all_data

def get_momentum_score(keywords: list):
    pytrends = TrendReq(hl='en-US', tz=360)
    scores = {}
    chunks = [keywords[i:i+5] for i in range(0, len(keywords), 5)]
    
    for chunk in chunks:
        pytrends.build_payload(chunk, timeframe="today 3-m")
        data = pytrends.interest_over_time()
        
        if data.empty:
            continue
            
        data = data.drop(columns=["isPartial"], errors="ignore")
        
        for keyword in chunk:
            if keyword not in data.columns:
                continue
                
            series = data[keyword]
            
            if len(series) < 4:
                continue
            
            recent = series[-2:].mean()
            previous = series[-6:-2].mean()
            overall = series.mean()
            
            if previous == 0:
                momentum = 0.0
            else:
                momentum = ((recent - previous) / previous) * 100
            
            scores[keyword] = {
                "momentum": round(float(momentum), 2),
                "current_volume": round(float(recent), 2),
                "avg_volume": round(float(overall), 2),
                "is_rising": bool(momentum > 10),
                "is_emerging": bool(momentum > 20 and overall < 50)
            }
    
    return scores