import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

const formatDate = (iso: string) => new Date(iso).toLocaleString();

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
  return (
    <button
      type="button"
      className="assignment-card"
      onClick={() => openAssignment(assignment.id)}
    >
      <div className="assignment-title">{assignment.title}</div>
      <div className="assignment-meta">
        <span>{course?.name ?? 'Unassigned course'}</span>
        <span>{formatDate(assignment.dueDate)}</span>
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

