import { useCalendar } from '../context/CalendarContext';

export const DashboardPage = () => {
  const { openChangeReview, showChangeAlert, showChangeAlertBanner } = useCalendar();

  return (
    <main className="page dashboard-page">
      {showChangeAlert && (
        <div className="change-alert-banner">
          <p>Alert: You have 1 change to review.</p>
          <button type="button" className="danger" onClick={openChangeReview}>
            Change Review
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={showChangeAlertBanner}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '24px',
          height: '24px',
          borderRadius: '999px',
          border: 'none',
          backgroundColor: 'transparent',
          opacity: 0,
          transition: 'opacity 0.2s ease, background-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Toggle change alert"
      />
      <div className="dashboard-bg-block" />
    </main>
  );
};

