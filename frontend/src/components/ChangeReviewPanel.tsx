import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';

const getSuggestedDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 16);
};

export const ChangeReviewPanel = () => {
  const { assignments, isChangeReviewOpen, closeChangeReview, updateAssignment } = useCalendar();
  const target = assignments[0];
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [defaultDueDate, setDefaultDueDate] = useState<string>('');

  useEffect(() => {
    if (!isChangeReviewOpen || !target) return;
    const suggested = getSuggestedDate();
    setNewDueDate(suggested);
    setDefaultDueDate(suggested);
  }, [isChangeReviewOpen, target]);

  if (!isChangeReviewOpen || !target) return null;

  const handleConfirm = () => {
    const iso = new Date(newDueDate).toISOString();
    updateAssignment({ ...target, dueDate: iso });
    closeChangeReview();
  };

  const handleRestore = () => {
    setNewDueDate(defaultDueDate);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>Review Change</h2>
          <button type="button" className="modal-close-btn" onClick={closeChangeReview} aria-label="Close">
            ✕
          </button>
        </header>
        <section className="modal-body">
          <p>
            This panel represents a pending change to a deadline coming from the host application.
          </p>
          <p>
            <strong>Assignment:</strong> {target.title}
          </p>
          <div className="field">
            <label htmlFor="newDueDate" className="field-label-prominent">New Due Date</label>
            <div className="field-row">
              <input
                id="newDueDate"
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
              <button type="button" className="restore-btn" onClick={handleRestore}>
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
