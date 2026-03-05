from tavily import TavilyClient
from dotenv import load_dotenv
import os
dotenv = load_dotenv()
def search_query(query: str):
    api_key = os.getenv("TavilyClient_API_KEY")
    client= TavilyClient(api_key=api_key)
    response=client.search(query=query, search_depth="fast")
    print(response)
    return [
        {
            "title": r["title"],
            "url": r["url"],
            "snippet": r["content"]
        }
        for r in response["results"]
    ]
