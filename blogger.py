import requests

def send_to_teams(news_list):
  """Send a formatted news summary to Microsoft Teams using Adaptive Card."""
  if not news_list:
    print("⚠️ No news to send.")
    return

  card_content = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.4",
    "body": [
      {"type": "TextBlock", "size": "Large", "weight": "Bolder", "text": "📢 Daily Payoneer News Report 📢"}
    ]
  }

  for news in news_list:
    card_content["body"].append({
      "type": "TextBlock",
      "text": f"**[{news['title']}]({news['link']})**\n{news['summary']}",
      "wrap": True
    })

  payload = {"type": "message",
             "attachments": [{"contentType": "application/vnd.microsoft.card.adaptive", "content": card_content}]}

  try:
    response = requests.post(TEAMS_WEBHOOK_URL, json=payload)
    response.raise_for_status()
    print("✅ Report sent to Microsoft Teams successfully!")
  except requests.exceptions.RequestException as e:
    print(f"❌ Failed to send report: {e}")


# Example Usage
news_data = [
  {"title": "Payoneer Launches Enhanced Security Features", "link": "https://example.com/news1",
   "summary": "New security features include two-factor authentication and AI threat detection."},
  {"title": "Payoneer Introduces New Benefits for Remote Workers", "link": "https://example.com/news2",
   "summary": "New benefits include mental health resources and an employee assistance program."},
  {"title": "Payoneer Partners with Mastercard", "link": "https://example.com/news3",
   "summary": "Partnership expands digital payment capabilities for online transactions."}
]

send_to_teams(news_data)
