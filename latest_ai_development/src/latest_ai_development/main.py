import requests
import sys
import warnings
import os

from .crew import PayoneerNewsCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

TEAMS_WEBHOOK_URL = os.getenv("TEAMS_WEBHOOK_URL")


def send_to_teams(summary):
  """Send the news summary to Microsoft Teams."""
  message = {"text": f"📢 **Daily Payoneer News Report** 📢\n\n{summary}"}
  response = requests.post(TEAMS_WEBHOOK_URL, json=message)
  if response.status_code == 200:
    print("✅ Report sent to Microsoft Teams successfully!")
  else:
    print(f"❌ Failed to send report: {response.text}")


def run():
  """
  Run the crew.
  """
  inputs = {
    'company_name': 'Payoneer',
    'hours_back': 24
  }

  try:
    PayoneerNewsCrew().crew().kickoff(inputs=inputs)

    # Read the generated report

    print("Current Working Directory:", os.getcwd())

    with open("output/company_news_report.md", "r") as f:
      report_text = f.read()

    # Send report to Teams
    send_to_teams(report_text)

  except Exception as e:
    raise Exception(f"An error occurred while running the crew: {e}")


def train():
  """
  Train the crew for a given number of iterations.
  """
  inputs = {
    'company_name': 'Payoneer',
  }
  try:
    PayoneerNewsCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

  except Exception as e:
    raise Exception(f"An error occurred while training the crew: {e}")


def replay():
  """
  Replay the crew execution from a specific task.
  """
  try:
    PayoneerNewsCrew().crew().replay(task_id=sys.argv[1])

  except Exception as e:
    raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
  """
  Test the crew execution and returns the results.
  """
  inputs = {
    'company_name': 'Payoneer',
  }
  try:
    PayoneerNewsCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

  except Exception as e:
    raise Exception(f"An error occurred while testing the crew: {e}")
