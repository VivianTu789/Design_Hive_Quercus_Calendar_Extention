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

export const CalendarPage = () => {
  const { courses, visibleCourseIds, setVisibleCourseIds } = useCalendar();
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

