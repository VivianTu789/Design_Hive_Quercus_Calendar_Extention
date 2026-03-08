from uuid import UUID

from pydantic import BaseModel


class Course(BaseModel):
    """
    Placeholder data model for a course.

    Group members:
    - Add any additional fields you need for courses here.
    - This model is used by the calendar prototype backend and can be
      extended without changing the overall structure.
    """

    id: UUID
    name: str

