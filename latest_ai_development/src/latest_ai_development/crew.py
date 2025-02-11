# src/latest_ai_development/crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool
# from .tools.custom_tool import TeamsReporterTool, send_to_teams
from .tools.search_tool import NewsSearchTool


# tool = SerperDevTool(
#     country="fr",
#     locale="fr",
#     location="Paris, Paris, Ile-de-France, France",
#     n_results=2,
# )



@CrewBase
class PayoneerNewsCrew():
  """LatestAiDevelopment crew"""

  @agent
  def researcher(self) -> Agent:
    return Agent(
      config=self.agents_config['researcher'],
      verbose=True,
      tools=[NewsSearchTool()]
    )

  @agent
  def reporting_analyst(self) -> Agent:
    return Agent(
      config=self.agents_config['reporting_analyst'],
      verbose=True
    )

  @task
  def research_task(self) -> Task:
    return Task(
      config=self.tasks_config['research_task'],
    )

  @task
  def reporting_task(self) -> Task:
    return Task(
      config=self.tasks_config['reporting_task'],
      output_file='output/company_news_report.md'
    )

  @crew
  def crew(self) -> Crew:
    """Creates the LatestAiDevelopment crew"""
    return Crew(
      agents=self.agents,  # Automatically created by the @agent decorator
      tasks=self.tasks,  # Automatically created by the @task decorator
      process=Process.sequential,
      verbose=True,
    )
