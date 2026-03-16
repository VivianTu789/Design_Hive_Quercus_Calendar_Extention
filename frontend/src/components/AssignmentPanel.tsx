import { useEffect, useMemo, useState } from 'react';
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
    reopenImportAfterAssignmentClose,
    openImport,
    setReopenImportAfterAssignmentClose,
  } = useCalendar();

  const selected = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const [draft, setDraft] = useState<Assignment | undefined>(selected);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset.x, dragOffset.y]);

  if (!selected) return null;

  const handleFieldChange = (field: keyof Assignment, value: string) => {
    if (!isEditing) return;
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    const baseDate = selected.dueDate ? new Date(selected.dueDate) : new Date();
    const defaultTime =
      selected.dueTime ||
      '23:59' ||
      `${baseDate.getHours().toString().padStart(2, '0')}:${baseDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    setDraft({ ...selected, dueTime: defaultTime });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft(selected);
  };

  const handleSave = () => {
    if (draft) {
      const deadlineChanged =
        draft.dueDate !== selected.dueDate || draft.dueTime !== selected.dueTime;
      updateAssignment({
        ...draft,
        status: deadlineChanged ? 'changed' : draft.status,
      });
      setIsEditing(false);
      if (reopenImportAfterAssignmentClose) {
        setReopenImportAfterAssignmentClose(false);
        openImport();
      }
    }
  };

  const handleDelete = () => {
    deleteAssignment(selected.id);
    closeAssignment();
    if (reopenImportAfterAssignmentClose) {
      setReopenImportAfterAssignmentClose(false);
      openImport();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setDraft(undefined);
    setDragging(false);
    setPosition({ x: 0, y: 0 });
    closeAssignment();
    if (reopenImportAfterAssignmentClose) {
      setReopenImportAfterAssignmentClose(false);
      openImport();
    }
  };

  const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect) return;
    setDragging(true);
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const course = courses.find((c) => c.id === selected.courseId);
  const dueDate = draft?.dueDate ?? selected.dueDate;
  const rawDueTime = draft?.dueTime ?? selected.dueTime ?? '23:59';

  const formattedDueDate =
    dueDate && !Number.isNaN(Date.parse(dueDate))
      ? new Date(dueDate).toLocaleDateString()
      : '';

  const formattedDueTime = (() => {
    if (!rawDueTime) return '';
    // Expect rawDueTime in "HH:MM" 24-hour format.
    const [hours, minutes] = rawDueTime.split(':');
    if (hours === undefined || minutes === undefined) return rawDueTime;
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  })();

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        style={{
          position: 'fixed',
          top: position.y || '50%',
          left: position.x || '50%',
          transform: position.x || position.y ? 'none' : 'translate(-50%, -50%)',
          cursor: dragging ? 'grabbing' : 'move',
        }}
        onMouseDown={handleDragStart}
      >
        <div className="assignment-panel">
          <div className="assignment-panel-header-course">
            <span>{course?.name ?? 'Unassigned course'}</span>
            <button
              type="button"
              className="close-button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <div className="assignment-panel-header-details">
            <div className="assignment-panel-title">{draft?.title ?? selected.title}</div>
            <div className="assignment-panel-meta">
              <span>Due Date:</span>
              <span>
                {formattedDueDate} {formattedDueTime}
              </span>
            </div>
            {selected.location && selected.location !== 'None' && !isEditing && (
              <div className="assignment-panel-meta">
                <span>Location:</span>
                <span>{selected.location}</span>
              </div>
            )}
          </div>
        </div>
        <section className="modal-body">
          {!isEditing ? (
            <>
              <div className="field">
                <label>Description</label>
                <p className="read-only-text">{selected.description || 'No description.'}</p>
              </div>
              {selected.assignmentLink && (
                <div className="field">
                  <label>Assignment link</label>
                  <a
                    href={selected.assignmentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="assignment-link"
                  >
                    Open assignment
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
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
                <label htmlFor="location">Location (optional)</label>
                <input
                  id="location"
                  type="text"
                  placeholder="None"
                  value={draft?.location ?? ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="dueDate">Due date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={draft ? draft.dueDate.slice(0, 10) : ''}
                  onChange={(e) => {
                    if (!isEditing) return;
                    const iso = new Date(`${e.target.value}T00:00:00`).toISOString();
                    setDraft((prev) => (prev ? { ...prev, dueDate: iso } : prev));
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="dueTime">Due time</label>
                <input
                  id="dueTime"
                  type="time"
                  value={draft?.dueTime ?? ''}
                  onChange={(e) => handleFieldChange('dueTime', e.target.value)}
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
              <div className="field">
                <label htmlFor="assignmentLink">Assignment link (URL)</label>
                <input
                  id="assignmentLink"
                  type="url"
                  placeholder="https://example.com/assignment"
                  value={draft?.assignmentLink ?? ''}
                  onChange={(e) => handleFieldChange('assignmentLink', e.target.value)}
                />
              </div>
            </>
          )}
        </section>
        <footer className="modal-footer">
          <button type="button" className="danger" onClick={handleDelete}>
            Delete
          </button>
          {!isEditing ? (
            <button type="button" className="primary" onClick={handleStartEdit}>
              Edit
            </button>
          ) : (
            <>
              <button type="button" className="ghost" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="button" className="primary" onClick={handleSave}>
                Save changes
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

