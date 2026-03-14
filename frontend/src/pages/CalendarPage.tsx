import { useCalendar } from '../context/CalendarContext';
import { MonthView, WeekView, DayView } from '../components/CalendarViews';

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

const CalendarContent = () => {
  const { view } = useCalendar();

  switch (view) {
    case 'month':
      return <MonthView />;
    case 'week':
      return <WeekView />;
    case 'day':
      return <DayView />;
    default:
      return <MonthView />;
  }
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
      <CalendarContent />
    </main>
  );
};

