import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';

const getSuggestedDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 16);
};

export const ChangeReviewPanel = () => {
  const { assignments, courses, isChangeReviewOpen, closeChangeReview, updateAssignment, hideChangeAlert } =
    useCalendar();
  const [targetId, setTargetId] = useState<string | undefined>(undefined);
  const target = assignments.find((a) => a.id === targetId) ?? assignments[0];
  const course = courses.find((c) => c.id === target?.courseId);
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [defaultDueDate, setDefaultDueDate] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [defaultLocation, setDefaultLocation] = useState<string>('');

  const getRandomInt = (min: number, max: number) => {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(Math.random() * (high - low + 1)) + low;
  };

  useEffect(() => {
    if (!isChangeReviewOpen) return;

    // Prefer recently imported assignments (status === 'new') for the change review example.
    const imported = assignments.filter((a) => a.status === 'new');
    const pool = imported.length > 0 ? imported : assignments;
    if (pool.length === 0) return;

    const chosen = pool[getRandomInt(0, pool.length - 1)];
    setTargetId(chosen.id);

    // Suggest a due date change (1–3 days later than current deadline)
    const baseDate = new Date(chosen.dueDate);
    const offsetDays = getRandomInt(1, 3);
    const suggestedDate = new Date(baseDate);
    suggestedDate.setDate(baseDate.getDate() + offsetDays);
    const isoSuggested = suggestedDate.toISOString().slice(0, 16);

    setNewDueDate(isoSuggested);
    setDefaultDueDate(isoSuggested);

    // Suggest a location change (toggle between an online and room suggestion).
    const currentLocation = chosen.location?.trim() ? chosen.location : 'Room 101';
    const suggestedLocation = currentLocation.toLowerCase().includes('online')
      ? `Room ${100 + getRandomInt(1, 10)}`
      : 'Online';

    setNewLocation(suggestedLocation);
    setDefaultLocation(suggestedLocation);
  }, [isChangeReviewOpen, assignments]);

  if (!isChangeReviewOpen || !target) return null;

  const handleConfirm = () => {
    const iso = new Date(newDueDate).toISOString();
    updateAssignment({
      ...target,
      dueDate: iso,
      location: newLocation,
      status: 'changed',
    });
    hideChangeAlert();
    closeChangeReview();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>Review Change</h2>
          <button
            type="button"
            className="close-button"
            onClick={closeChangeReview}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <section className="modal-body">
          <p>
            There has been a change to an assignment that needs your attention and confirmation to update the calendar.
          </p>
          <p>
            <strong>Course:</strong> {course?.name ?? target.courseId}
          </p>
          <p>
            <strong>Assignment:</strong> {target.title}
          </p>
          <p>
            <strong>Former due date:</strong>{' '}
            {new Date(target.dueDate).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
          <p>
            <strong>Former location:</strong> {target.location ?? 'Room 101'}
          </p>
          <div className="field">
            <label className="field-label-prominent">Source of Change</label>
            <p>
              <a
                href="https://example.com/announcement"
                target="_blank"
                rel="noreferrer"
                className="assignment-link"
              >
                Example Announcement
              </a>
            </p>
          </div>
          <div className="field">
            <label htmlFor="newLocation" className="field-label-prominent">
              New location
            </label>
            <div className="field-row">
              <input
                id="newLocation"
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <button type="button" className="restore-btn" onClick={() => setNewLocation(defaultLocation)}>
                Restore
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="newDueDate" className="field-label-prominent">New Due Date</label>
            <div className="field-row">
              <input
                id="newDueDate"
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
              <button type="button" className="restore-btn" onClick={() => setNewDueDate(defaultDueDate)}>
                Restore
              </button>
            </div>
          </div>
        </section>
        <footer className="modal-footer">
          <button type="button" className="primary" onClick={handleConfirm}>
            Confirm changes
          </button>
        </footer>
      </div>
    </div>
  );
};
