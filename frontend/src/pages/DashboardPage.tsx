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
      <div className="dashboard-bg-block" />
    </main>
  );
};

