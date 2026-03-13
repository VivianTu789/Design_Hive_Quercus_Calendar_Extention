from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException

from .models import Assignment, ChangeReview, Course


app = FastAPI(title="Calendar Prototype Backend")

# In-memory "database" for the prototype session
course_1 = Course(id=uuid4(), name="COMP 101")
course_2 = Course(id=uuid4(), name="MATH 202")
course_3 = Course(id=uuid4(), name="HIST 210")

courses: List[Course] = [course_1, course_2, course_3]

assignments: List[Assignment] = [
    Assignment(
        id=uuid4(),
        title="Essay Draft 1",
        description="First draft of term essay.",
        due_date="2026-03-15",
        course_id=course_1.id,
    ),
    Assignment(
        id=uuid4(),
        title="Problem Set 3",
        description="Weekly math problem set.",
        due_date="2026-03-17",
        course_id=course_2.id,
    ),
    Assignment(
        id=uuid4(),
        title="Reading Quiz",
        description="Short quiz on assigned readings.",
        due_date="2026-03-19",
        course_id=course_3.id,
    ),
]

pending_change: Optional[ChangeReview] = None


@app.get("/")
def root() -> dict:
    return {"message": "Calendar prototype backend is running"}


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.get("/courses", response_model=List[Course])
def list_courses() -> List[Course]:
    return courses


@app.get("/assignments", response_model=List[Assignment])
def list_assignments() -> List[Assignment]:
    return assignments


@app.post("/assignments", response_model=Assignment)
def create_assignment(assignment: Assignment) -> Assignment:
    assignments.append(assignment)
    return assignment


@app.put("/assignments/{assignment_id}", response_model=Assignment)
def update_assignment(assignment_id: UUID, updated: Assignment) -> Assignment:
    for idx, existing in enumerate(assignments):
        if existing.id == assignment_id:
            assignments[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Assignment not found")


@app.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: UUID) -> dict:
    global assignments
    assignments = [a for a in assignments if a.id != assignment_id]
    return {"status": "deleted"}


@app.get("/import/preview", response_model=List[Assignment])
def preview_import() -> List[Assignment]:
    # For now, just return current assignments as a placeholder
    return assignments


@app.post("/import/apply")
def apply_import(selected_ids: List[UUID]) -> dict:
    # Placeholder: in a real app this would add new assignments
    return {"imported_count": len(selected_ids)}


@app.get("/changes/pending", response_model=Optional[ChangeReview])
def get_pending_change() -> Optional[ChangeReview]:
    return pending_change


@app.post("/changes/preview", response_model=ChangeReview)
def preview_change(change: ChangeReview) -> ChangeReview:
    global pending_change
    pending_change = change
    return change


@app.post("/changes/confirm", response_model=Optional[Assignment])
def confirm_change() -> Optional[Assignment]:
    global pending_change
    if pending_change is None:
        return None
    for assignment in assignments:
        if assignment.id == pending_change.assignment_id:
            assignment.due_date = pending_change.new_due_date
            confirmed = assignment
            pending_change = None
            return confirmed
    pending_change = None
    return None

