import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';

const getSuggestedDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 16);
};

export const ChangeReviewPanel = () => {
  const { assignments, isChangeReviewOpen, closeChangeReview, updateAssignment, hideChangeAlert } =
    useCalendar();
  const target = assignments[0];
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [defaultDueDate, setDefaultDueDate] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [defaultLocation, setDefaultLocation] = useState<string>('');

  useEffect(() => {
    if (!isChangeReviewOpen || !target) return;
    const suggested = getSuggestedDate();
    setNewDueDate(suggested);
    setDefaultDueDate(suggested);

    // Suggest a new location change for the example alert.
    const currentLocation = target.location ?? 'Room 101';
    const suggestedLocation = currentLocation === 'Online' ? 'Room 202' : 'Online';
    setNewLocation(suggestedLocation);
    setDefaultLocation(suggestedLocation);
  }, [isChangeReviewOpen, target]);

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
