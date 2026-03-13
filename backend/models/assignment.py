from typing import Optional
from uuid import UUID

from pydantic import BaseModel, HttpUrl


class Assignment(BaseModel):
    """
    Placeholder data model for an assignment/event.

    Group members:
    - Add or rename fields to match the real assignment data you expect.
    - Keep the type information accurate so the FastAPI docs stay helpful.
    """

    id: UUID
    title: str
    description: Optional[str] = None
    # Date portion of the deadline; keep as an ISO date string (YYYY-MM-DD).
    due_date: str
    # Human-friendly due time, defaults to end of day.
    due_time: Optional[str] = "11:59 PM"
    course_id: UUID
    # Optional link to the full assignment in the LMS or source system.
    assignment_link: Optional[HttpUrl] = None

