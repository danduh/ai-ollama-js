import requests
import json
import os
from dotenv import load_dotenv
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field

load_dotenv()


class MyCustomToolInput(BaseModel):
  """Input schema for MyCustomTool."""
  query: str = Field(..., description="Query to be search")


class NewsSearchTool(BaseTool):
  name: str = "Internet Searcher Tool"
  description: str = (
    "Search internet ."
  )
  args_schema: Type[BaseModel] = MyCustomToolInput

  def _run(self, query: str) -> str:
    """
    Search the internet for news.
    """

    url = "https://google.serper.dev/search"

    payload = json.dumps({
      "q": query,
      "num": 5,
      "tbs": "qdr:d"
    })
    headers = {
      'X-API-KEY': os.getenv('SERPER_API_KEY'),
      'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    # Parse the JSON response
    response_data = response.json()
    # Extract only the 'news' property
    news_data = response_data.get('organic', [])

    # Convert the news data back to a JSON string
    return json.dumps(news_data, indent=2)
