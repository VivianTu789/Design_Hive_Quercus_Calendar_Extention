import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

export const ChangeReviewPanel = () => {
  const { assignments, isChangeReviewOpen, closeChangeReview, updateAssignment } = useCalendar();
  const [target, setTarget] = useState<Assignment | undefined>();
  const [newDueDate, setNewDueDate] = useState<string>('');

  useEffect(() => {
    if (!isChangeReviewOpen) return;
    const first = assignments[0];
    if (first) {
      setTarget(first);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewDueDate(tomorrow.toISOString().slice(0, 16));
    }
  }, [assignments, isChangeReviewOpen]);

  if (!isChangeReviewOpen || !target) return null;

  const handleConfirm = () => {
    const iso = new Date(newDueDate).toISOString();
    updateAssignment({ ...target, dueDate: iso });
    closeChangeReview();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>Review Change</h2>
          <button type="button" className="ghost" onClick={closeChangeReview}>
            Close
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
            <label htmlFor="newDueDate">New due date</label>
            <input
              id="newDueDate"
              type="datetime-local"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
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

