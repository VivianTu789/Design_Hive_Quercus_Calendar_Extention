from typing import Optional
from uuid import UUID

from pydantic import BaseModel


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
    due_date: str  # ISO date string
    course_id: UUID

