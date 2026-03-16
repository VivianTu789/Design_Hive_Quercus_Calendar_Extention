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
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '999px',
          border: 'none',
          backgroundColor: 'transparent',
          opacity: 0,
          transition: 'opacity 0.2s ease, background-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = '#facc15';
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

