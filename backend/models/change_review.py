from uuid import UUID

from pydantic import BaseModel


class ChangeReview(BaseModel):
    """
    Placeholder data model for a change review request.

    Group members:
    - This represents a proposed change to an assignment's deadline.
    - Extend with additional metadata (who requested the change, timestamps, etc.)
      as the prototype evolves.
    """

    assignment_id: UUID
    new_due_date: str

