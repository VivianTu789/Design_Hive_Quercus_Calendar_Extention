import { useCalendar } from '../context/CalendarContext';

export const DashboardPage = () => {
  const { openChangeReview } = useCalendar();

  return (
    <main className="page dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard (Prototype)</h1>
          <p>This replicates the host app dashboard with a change alert.</p>
        </div>
      </header>
      <section className="dashboard-content">
        <button type="button" className="primary" onClick={openChangeReview}>
          View 1 pending change
        </button>
      </section>
    </main>
  );
};

