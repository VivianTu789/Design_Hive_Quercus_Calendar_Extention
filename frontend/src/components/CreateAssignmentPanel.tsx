import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

export const CreateAssignmentPanel = () => {
  const { courses, currentDate, isCreateOpen, closeCreate, addAssignment } = useCalendar();

  const [draft, setDraft] = useState<Partial<Assignment>>({});

  useEffect(() => {
    if (!isCreateOpen) return;

    const baseDate = currentDate ?? new Date();
    const isoDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      0,
      0,
      0,
      0,
    ).toISOString();

    setDraft({
      title: '',
      description: '',
      courseId: '',
      dueDate: isoDate,
      dueTime: '23:59',
      assignmentLink: '',
      location: '',
    });
  }, [isCreateOpen, courses, currentDate]);

  if (!isCreateOpen) return null;

  const handleFieldChange = (field: keyof Assignment, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    closeCreate();
    setDraft({});
  };

  const handleCreate = () => {
    if (!draft.title || !draft.dueDate) {
      alert('Please fill in at least a title and due date.');
      return;
    }

    addAssignment({ ...(draft as Assignment), status: 'new' });
    handleClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="assignment-panel">
          <div className="assignment-panel-header-course">
            <span>Create Custom Assignment</span>
            <button
              type="button"
              className="close-button"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <div className="assignment-panel-header-details">
            <div className="assignment-panel-title">
              {draft.title && draft.title.trim().length > 0 ? draft.title : 'New assignment'}
            </div>
          </div>
        </div>
        <section className="modal-body">
          <div className="field">
            <label htmlFor="create-title">Title</label>
            <input
              id="create-title"
              type="text"
              value={draft.title ?? ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="create-description">Description</label>
            <textarea
              id="create-description"
              value={draft.description ?? ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="create-dueDate">Due date</label>
            <input
              id="create-dueDate"
              type="date"
              value={draft.dueDate ? draft.dueDate.slice(0, 10) : ''}
              onChange={(e) => {
                const iso = new Date(`${e.target.value}T00:00:00`).toISOString();
                setDraft((prev) => ({ ...prev, dueDate: iso }));
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="create-dueTime">Due time</label>
            <input
              id="create-dueTime"
              type="time"
              value={draft.dueTime ?? ''}
              onChange={(e) => handleFieldChange('dueTime', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="create-course">Course (optional)</label>
            <select
              id="create-course"
              value={draft.courseId ?? ''}
              onChange={(e) => handleFieldChange('courseId', e.target.value)}
            >
              <option value="">None</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="create-location">Location (optional)</label>
            <input
              id="create-location"
              type="text"
              placeholder="None"
              value={draft.location ?? ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="create-assignmentLink">Assignment link (URL)</label>
            <input
              id="create-assignmentLink"
              type="url"
              placeholder="https://example.com/assignment"
              value={draft.assignmentLink ?? ''}
              onChange={(e) => handleFieldChange('assignmentLink', e.target.value)}
            />
          </div>
        </section>
        <footer className="modal-footer">
          <button
            type="button"
            className="ghost"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            onClick={handleCreate}
          >
            Create
          </button>
        </footer>
      </div>
    </div>
  );
};

