import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

const formatTime = (time?: string, isoDate?: string) => {
  const raw = time;
  if (!raw && !isoDate) return '';

  // Prefer explicit time if provided in "HH:MM" 24-hour format.
  const sourceTime = raw && raw.includes(':') ? raw : undefined;

  if (sourceTime) {
    const [hours, minutes] = sourceTime.split(':');
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  // Fallback: derive from dueDate if it has a time component.
  if (isoDate) {
    const d = new Date(isoDate);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return '';
};

const CalendarViewSwitcher = () => {
  const { view, setView } = useCalendar();
  return (
    <div className="view-switcher">
      {(['month', 'week', 'day'] as const).map((v) => (
        <button
          key={v}
          type="button"
          className={view === v ? 'active' : ''}
          onClick={() => setView(v)}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const CalendarGrid = ({ assignments }: { assignments: Assignment[] }) => {
  return (
    <div className="calendar-grid">
      {assignments.length === 0 ? (
        <p className="empty-state">No assignments yet. Use the import button or add manually.</p>
      ) : (
        assignments.map((a) => <AssignmentCard key={a.id} assignment={a} />)
      )}
    </div>
  );
};

const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
  const { openAssignment, courses } = useCalendar();
  const course = courses.find((c) => c.id === assignment.courseId);
  const timeLabel = formatTime(assignment.dueTime, assignment.dueDate);
  return (
    <button
      type="button"
      className="assignment-card"
      onClick={() => openAssignment(assignment.id)}
    >
      <div className="assignment-title">{assignment.title}</div>
      <div className="assignment-meta">
        <span>{course?.name ?? 'Unassigned course'}</span>
        <span>
          Due Date: {formatDate(assignment.dueDate)}
          {timeLabel ? ` ${timeLabel}` : ''}
        </span>
      </div>
    </button>
  );
};

const ImportButton = () => {
  const { openImport } = useCalendar();
  return (
    <button type="button" className="primary" onClick={openImport}>
      Import Assignments
    </button>
  );
};

export const CalendarPage = () => {
  const { assignments } = useCalendar();

  return (
    <main className="page calendar-page">
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>High-fidelity prototype calendar with fake data.</p>
        </div>
        <div className="header-actions">
          <CalendarViewSwitcher />
          <ImportButton />
        </div>
      </header>
      <CalendarGrid assignments={assignments} />
    </main>
  );
};

