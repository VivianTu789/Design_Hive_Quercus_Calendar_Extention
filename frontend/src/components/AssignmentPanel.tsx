import { useMemo, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

export const AssignmentPanel = () => {
  const {
    assignments,
    selectedAssignmentId,
    courses,
    closeAssignment,
    updateAssignment,
    deleteAssignment,
  } = useCalendar();

  const selected = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const [draft, setDraft] = useState<Assignment | undefined>(selected);

  if (!selected) return null;

  const handleFieldChange = (field: keyof Assignment, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () => {
    if (draft) {
      updateAssignment(draft);
      closeAssignment();
    }
  };

  const handleDelete = () => {
    deleteAssignment(selected.id);
    closeAssignment();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>Assignment Details</h2>
          <button type="button" className="ghost" onClick={closeAssignment}>
            Close
          </button>
        </header>
        <section className="modal-body">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={draft?.title ?? ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={draft?.description ?? ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              type="datetime-local"
              value={draft ? draft.dueDate.slice(0, 16) : ''}
              onChange={(e) =>
                handleFieldChange('dueDate', new Date(e.target.value).toISOString())
              }
            />
          </div>
          <div className="field">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              value={draft?.courseId ?? ''}
              onChange={(e) => handleFieldChange('courseId', e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </section>
        <footer className="modal-footer">
          <button type="button" className="danger" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" className="primary" onClick={handleSave}>
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
};

