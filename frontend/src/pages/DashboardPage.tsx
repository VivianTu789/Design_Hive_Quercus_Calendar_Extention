import { useCalendar } from '../context/CalendarContext';

export const DashboardPage = () => {
  const { openChangeReview } = useCalendar();

  return (
    <main className="page dashboard-page">
      <div className="change-alert-banner">
        <p>Alert: You have 1 change to review.</p>
        <button type="button" className="danger" onClick={openChangeReview}>
          Change Review
        </button>
      </div>
      <header className="page-header">
        <div>
          <h1>Dashboard (Prototype)</h1>
          <p>This replicates the host app dashboard with a change alert.</p>
        </div>
      </header>
    </main>
  );
};

