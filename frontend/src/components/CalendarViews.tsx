import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';
import { useState } from 'react';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

const formatTime = (time?: string, isoDate?: string) => {
  const raw = time;
  if (!raw && !isoDate) return '';

  // Prefer explicit time if provided in "HH:MM" 24-hour format.
  const sourceTime = raw && raw.includes(':') ? raw : undefined;

  if (sourceTime) {
    const [hours, minutes] = sourceTime.split(':');
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  // Fallback: derive from dueDate if it has a time component.
  if (isoDate) {
    const d = new Date(isoDate);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return '';
};

const DatePicker = () => {
  const { navigateToDate, view } = useCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleJumpToDate = () => {
    const date = new Date(selectedYear, selectedMonth, view === 'day' ? selectedDay : 1);
    navigateToDate(date);
    setIsOpen(false);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
    <div className="date-picker">
      <button onClick={() => setIsOpen(!isOpen)} className="jump-to-date-btn">
        Jump to Date
      </button>
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-row">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {view === 'day' && (
            <div className="date-picker-row">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          )}
          <div className="date-picker-actions">
            <button onClick={handleJumpToDate}>Go</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
  const { openAssignment, courses } = useCalendar();
  const course = courses.find((c) => c.id === assignment.courseId);
  const timeLabel = formatTime(assignment.dueTime, assignment.dueDate);

  // Determine if this assignment is in the past relative to today (by date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const assignmentDate = new Date(assignment.dueDate);
  assignmentDate.setHours(0, 0, 0, 0);
  const isPast = assignmentDate < today;

  // Color-code by course
  let backgroundColor: string | undefined;
  let borderColor: string | undefined;

  switch (assignment.courseId) {
    case 'course-6': // CSC318
      backgroundColor = '#ecfdf3'; // soft green
      borderColor = '#22c55e';
      break;
    case 'course-5': // JRE420
      backgroundColor = '#fff7ed'; // soft orange
      borderColor = '#fb923c';
      break;
    case 'course-7': // ECE568
      backgroundColor = '#fdf2f8'; // soft pink
      borderColor = '#ec4899';
      break;
    case 'course-8': // ECE316
      backgroundColor = '#eff6ff'; // soft blue
      borderColor = '#3b82f6';
      break;
    case 'course-4': // ECE496
      backgroundColor = '#f5f3ff'; // soft purple
      borderColor = '#8b5cf6';
      break;
    default:
      backgroundColor = undefined;
      borderColor = undefined;
  }

  return (
    <button
      type="button"
      className="assignment-card"
      onClick={() => openAssignment(assignment.id)}
      style={
        backgroundColor
          ? {
              backgroundColor,
              borderColor: borderColor ?? 'transparent',
              borderWidth: '1px',
              borderStyle: 'solid',
            }
          : undefined
      }
    >
      <div
        className="assignment-title"
        style={isPast ? { textDecoration: 'line-through' } : undefined}
      >
        {assignment.title}
      </div>
      <div
        className="assignment-meta"
        style={isPast ? { textDecoration: 'line-through' } : undefined}
      >
        <span>{course?.name ?? 'Unassigned course'}</span>
        <span>
          Due Date: {formatDate(assignment.dueDate)}
          {timeLabel ? ` ${timeLabel}` : ''}
        </span>
      </div>
    </button>
  );
};

export const MonthView = () => {
  const { currentDate, assignments, navigateMonth, navigateToToday, visibleCourseIds } = useCalendar();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Fill the remaining cells of the last week with days from the next month
    const remainder = days.length % 7;
    if (remainder !== 0) {
      const daysToAdd = 7 - remainder;
      for (let i = 1; i <= daysToAdd; i++) {
        days.push(new Date(year, month, daysInMonth + i));
      }
    }

    return days;
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) => {
      if (!visibleCourseIds.includes(assignment.courseId)) return false;
      const assignmentDate = new Date(assignment.dueDate);
      return assignmentDate.toDateString() === date.toDateString();
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="calendar-view month-view">
      <div className="calendar-header">
        <div className="nav-buttons">
          <button onClick={() => navigateMonth(-1)}>&lt;</button>
          <button onClick={() => navigateMonth(1)}>&gt;</button>
        </div>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <div className="header-actions">
          <DatePicker />
          <button onClick={navigateToToday} className="today-btn">Today</button>
        </div>
      </div>
      <div className="calendar-grid month-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {days.map((date, index) => {
          const isToday =
            date !== null &&
            (() => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d.getTime() === today.getTime();
            })();

          return (
            <div
              key={index}
              className={`day-cell ${date ? '' : 'empty'}`}
              style={isToday ? { backgroundColor: '#f3f4f6' } : undefined}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  <div className="day-assignments">
                    {getAssignmentsForDate(date).slice(0, 3).map((assignment) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                    {getAssignmentsForDate(date).length > 3 && (
                      <div className="more-assignments">
                        +{getAssignmentsForDate(date).length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WeekView = () => {
  const { currentDate, assignments, navigateWeek, navigateToToday, visibleCourseIds } = useCalendar();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) => {
      if (!visibleCourseIds.includes(assignment.courseId)) return false;
      const assignmentDate = new Date(assignment.dueDate);
      return assignmentDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = getWeekDays(currentDate);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="calendar-view week-view">
      <div className="calendar-header">
        <div className="nav-buttons">
          <button onClick={() => navigateWeek(-1)}>&lt;</button>
          <button onClick={() => navigateWeek(1)}>&gt;</button>
        </div>
        <h2>
          {monthNames[weekDays[0].getMonth()]} {weekDays[0].getDate()} - {monthNames[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {weekDays[0].getFullYear()}
        </h2>
        <div className="header-actions">
          <DatePicker />
          <button onClick={navigateToToday} className="today-btn">Today</button>
        </div>
      </div>
      <div className="calendar-grid week-grid">
        {weekDays.map((date, index) => {
          const isToday = (() => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
          })();

          return (
            <div
              key={index}
              className="day-column"
              style={isToday ? { backgroundColor: '#f3f4f6' } : undefined}
            >
              <div className="day-header">
                <div className="day-name">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                </div>
                <div className="day-number">{date.getDate()}</div>
              </div>
              <div className="day-assignments">
                {getAssignmentsForDate(date).map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DayView = () => {
  const { currentDate, assignments, navigateDay, navigateToToday, visibleCourseIds } = useCalendar();

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) => {
      if (!visibleCourseIds.includes(assignment.courseId)) return false;
      const assignmentDate = new Date(assignment.dueDate);
      return assignmentDate.toDateString() === date.toDateString();
    });
  };

  const assignmentsForDay = getAssignmentsForDate(currentDate);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="calendar-view day-view">
      <div className="calendar-header">
        <div className="nav-buttons">
          <button onClick={() => navigateDay(-1)}>&lt;</button>
          <button onClick={() => navigateDay(1)}>&gt;</button>
        </div>
        <h2>
          {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
        </h2>
        <div className="header-actions">
          <DatePicker />
          <button onClick={navigateToToday} className="today-btn">Today</button>
        </div>
      </div>
      <div className="day-content">
        {assignmentsForDay.length === 0 ? (
          <p className="empty-state">No assignments for this day.</p>
        ) : (
          <div className="assignments-list">
            {assignmentsForDay.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};