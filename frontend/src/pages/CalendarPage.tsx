import { useCalendar } from '../context/CalendarContext';
import { useState } from 'react';
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
  const { courses, visibleCourseIds, setVisibleCourseIds } = useCalendar();
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(false);

  const getCourseColor = (courseId: string): string | undefined => {
    switch (courseId) {
      case 'course-6': // CSC318
        return '#22c55e';
      case 'course-5': // JRE420
        return '#fb923c';
      case 'course-7': // ECE568
        return '#ec4899';
      case 'course-8': // ECE316
        return '#3b82f6';
      case 'course-4': // ECE496
        return '#8b5cf6';
      default:
        return undefined;
    }
  };

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
        <div className="header-actions">
          <CalendarViewSwitcher />
          <ImportButton />
        </div>
      </header>
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
            {courses.map((course) => {
              const checked = visibleCourseIds.includes(course.id);
              const color = getCourseColor(course.id) ?? '#6b7280';
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

