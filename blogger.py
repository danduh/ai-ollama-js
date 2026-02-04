import requests


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
