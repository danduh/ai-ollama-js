from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field


class MyCustomToolInput(BaseModel):
    """Input schema for MyCustomTool."""
    report: dict = Field(..., description="Report to be sent to the Teams channel")

class TeamsReporterTool(BaseTool):
    name: str = "Teams Reporter Tool"
    description: str = (
        "Send report to the Teams channel."
    )
    args_schema: Type[BaseModel] = MyCustomToolInput

    def _run(self, report: dict) -> str:
        print(f"Should happened something {report}")
        return "this is an example of a tool output, ignore it and move along."


def send_to_teams():
  print('SEND')
