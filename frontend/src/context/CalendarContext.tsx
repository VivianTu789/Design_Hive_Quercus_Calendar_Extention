import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Assignment, CalendarView } from '../models/assignment';
import type { Course } from '../models/course';

interface CalendarState {
  view: CalendarView;
  currentDate: Date;
  selectedDate: Date;
  assignments: Assignment[];
  courses: Course[];
  selectedAssignmentId?: string;
  isImportOpen: boolean;
  isChangeReviewOpen: boolean;
}

interface CalendarContextValue extends CalendarState {
  setView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  navigateToDate: (date: Date) => void;
  navigateToToday: () => void;
  navigateMonth: (direction: number) => void;
  navigateWeek: (direction: number) => void;
  navigateDay: (direction: number) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  openAssignment: (id: string | undefined) => void;
  closeAssignment: () => void;
  openImport: () => void;
  closeImport: () => void;
  openChangeReview: () => void;
  closeChangeReview: () => void;
}

const STORAGE_KEY = 'calendar_prototype_state_v2';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

const isValidDate = (value: unknown): value is string | number | Date => {
  if (value === null || value === undefined) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const toDate = (value: unknown, fallback = new Date()): Date => {
  return isValidDate(value) ? new Date(value) : fallback;
};

const normalizeAssignment = (assignment: Partial<Assignment>): Assignment => {
  return {
    id: assignment.id ?? crypto.randomUUID(),
    title: assignment.title ?? 'Untitled Assignment',
    description: assignment.description ?? '',
    dueDate: isValidDate(assignment.dueDate)
      ? new Date(assignment.dueDate).toISOString()
      : new Date().toISOString(),
    dueTime:
      typeof assignment.dueTime === 'string' && /^\d{2}:\d{2}$/.test(assignment.dueTime)
        ? assignment.dueTime
        : '23:59',
    courseId: assignment.courseId ?? '',
    assignmentLink: assignment.assignmentLink ?? '',
  };
};

const getDefaultState = (): CalendarState => {
  const courses: Course[] = [
    { id: 'course-1', name: 'COMP 101' },
    { id: 'course-2', name: 'MATH 202' },
    { id: 'course-3', name: 'HIST 210' },
  ];

  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const assignments: Assignment[] = [
    {
      id: 'a-1',
      title: 'Essay Draft 1',
      description: 'First draft of term essay.',
      dueDate: new Date(now.getTime() + oneDayMs).toISOString(),
      dueTime: '23:59',
      courseId: 'course-1',
      assignmentLink: 'https://example.com/assignments/essay-draft-1',
    },
    {
      id: 'a-2',
      title: 'Problem Set 3',
      description: 'Weekly math problem set.',
      dueDate: new Date(now.getTime() + 3 * oneDayMs).toISOString(),
      dueTime: '17:00',
      courseId: 'course-2',
      assignmentLink: 'https://example.com/assignments/problem-set-3',
    },
    {
      id: 'a-3',
      title: 'Reading Quiz',
      description: 'Short quiz on assigned readings.',
      dueDate: new Date(now.getTime() + 5 * oneDayMs).toISOString(),
      dueTime: '09:00',
      courseId: 'course-3',
      assignmentLink: 'https://example.com/assignments/reading-quiz',
    },
  ];

  return {
    view: 'month',
    currentDate: now,
    selectedDate: now,
    assignments,
    courses,
    selectedAssignmentId: undefined,
    isImportOpen: false,
    isChangeReviewOpen: false,
  };
};

const loadPersistedState = (): CalendarState => {
  const fallback = getDefaultState();
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved) as Partial<CalendarState>;

    return {
      view: parsed.view === 'month' || parsed.view === 'week' || parsed.view === 'day'
        ? parsed.view
        : fallback.view,
      currentDate: toDate(parsed.currentDate, fallback.currentDate),
      selectedDate: toDate(parsed.selectedDate, fallback.selectedDate),
      assignments: Array.isArray(parsed.assignments)
        ? parsed.assignments.map((a) => normalizeAssignment(a))
        : fallback.assignments,
      courses: Array.isArray(parsed.courses) ? parsed.courses : fallback.courses,
      selectedAssignmentId: undefined,
      isImportOpen: false,
      isChangeReviewOpen: false,
    };
  } catch {
    return fallback;
  }
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CalendarState>(loadPersistedState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: CalendarContextValue = useMemo(
    () => ({
      ...state,
      setView: (view) => setState((s) => ({ ...s, view })),
      setCurrentDate: (date) => setState((s) => ({ ...s, currentDate: date })),
      setSelectedDate: (date) => setState((s) => ({ ...s, selectedDate: date })),
      navigateToDate: (date) => setState((s) => ({ ...s, currentDate: date, selectedDate: date })),
      navigateToToday: () => {
        const today = new Date();
        setState((s) => ({ ...s, currentDate: today, selectedDate: today }));
      },
      navigateMonth: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setMonth(newDate.getMonth() + direction);
          return { ...s, currentDate: newDate };
        }),
      navigateWeek: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setDate(newDate.getDate() + direction * 7);
          return { ...s, currentDate: newDate };
        }),
      navigateDay: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setDate(newDate.getDate() + direction);
          return { ...s, currentDate: newDate };
        }),
      addAssignment: (assignment) =>
        setState((s) => ({ ...s, assignments: [...s.assignments, normalizeAssignment(assignment)] })),
      updateAssignment: (assignment) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) =>
            a.id === assignment.id ? normalizeAssignment(assignment) : a,
          ),
        })),
      deleteAssignment: (id) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.filter((a) => a.id !== id),
          selectedAssignmentId: s.selectedAssignmentId === id ? undefined : s.selectedAssignmentId,
        })),
      openAssignment: (id) => setState((s) => ({ ...s, selectedAssignmentId: id })),
      closeAssignment: () => setState((s) => ({ ...s, selectedAssignmentId: undefined })),
      openImport: () => setState((s) => ({ ...s, isImportOpen: true })),
      closeImport: () => setState((s) => ({ ...s, isImportOpen: false })),
      openChangeReview: () => setState((s) => ({ ...s, isChangeReviewOpen: true })),
      closeChangeReview: () => setState((s) => ({ ...s, isChangeReviewOpen: false })),
    }),
    [state],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendar = (): CalendarContextValue => {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return ctx;
};