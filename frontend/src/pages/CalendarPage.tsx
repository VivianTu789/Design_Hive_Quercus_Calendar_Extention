import { useCalendar } from '../context/CalendarContext';
import { useState } from 'react';
import { MonthView, WeekView, DayView } from '../components/CalendarViews';
import { getCourseColor } from '../features/courses/courseColors';

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

const CreateAssignmentButton = () => {
  const { openCreate } = useCalendar();
  return (
    <button
      type="button"
      className="primary"
      onClick={openCreate}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '999px',
          backgroundColor: 'white',
          color: '#0b3b76',
          fontWeight: 700,
          fontSize: '13px',
        }}
      >
        +
      </span>
      <span>New Event</span>
    </button>
  );
};

const MarkAllSeenButton = () => {
  const { markAllSeen } = useCalendar();
  return (
    <button
      type="button"
      className="ghost"
      onClick={markAllSeen}
      style={{
        border: '1px solid #d1d5db',
        color: '#4b5563',
      }}
    >
      Mark all as seen
    </button>
  );
};

export const CalendarPage = () => {
  const { courses, visibleCourseIds, setVisibleCourseIds, showUncategorized, setShowUncategorized } =
    useCalendar();
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(false);

  const toggleCourse = (courseId: string) => {
    if (visibleCourseIds.includes(courseId)) {
      setVisibleCourseIds(visibleCourseIds.filter((id) => id !== courseId));
    } else {
      setVisibleCourseIds([...visibleCourseIds, courseId]);
    }
  };

  return (
    <main className="page calendar-page">
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>High-fidelity prototype calendar with fake data.</p>
        </div>
      </header>
      <div
        className="header-actions"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <CalendarViewSwitcher />
        <ImportButton />
        <CreateAssignmentButton />
        <MarkAllSeenButton />
      </div>
      <CalendarContent />
      <section className="calendars-panel" style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setIsCalendarsOpen((open) => !open)}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            cursor: 'pointer',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>CALENDARS</span>
          <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 700 }}>
            {isCalendarsOpen ? '▾' : '▸'}
          </span>
        </button>
        {isCalendarsOpen && (
          <div
            style={{
              paddingTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#111827',
              }}
            >
              <input
                type="checkbox"
                checked={showUncategorized}
                onChange={(e) => setShowUncategorized(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#6b7280',
                  cursor: 'pointer',
                }}
              />
              <span>Uncategorized</span>
            </label>
            {courses.map((course) => {
              const checked = visibleCourseIds.includes(course.id);
              const color = getCourseColor(course.id);
              return (
                <label
                  key={course.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#111827',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCourse(course.id)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: color,
                      cursor: 'pointer',
                    }}
                  />
                  <span>{course.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

