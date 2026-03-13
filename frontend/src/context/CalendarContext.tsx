import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Assignment, CalendarView } from '../models/assignment';
import type { Course } from '../models/course';

interface CalendarState {
  view: CalendarView;
  assignments: Assignment[];
  courses: Course[];
  selectedAssignmentId?: string;
  isImportOpen: boolean;
  isChangeReviewOpen: boolean;
}

interface CalendarContextValue extends CalendarState {
  setView: (view: CalendarView) => void;
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

const createInitialState = (): CalendarState => {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as CalendarState;
      const normalizedAssignments: Assignment[] = (parsed.assignments || []).map((a) => {
        // Normalize any old placeholder times to a consistent 11:59 PM default.
        let dueTime = a.dueTime;
        if (!dueTime || /am|pm/i.test(dueTime)) {
          dueTime = '23:59';
        }
        return { ...a, dueTime };
      });
      // Always start with panels closed when the app first loads.
      return {
        ...parsed,
        assignments: normalizedAssignments,
        selectedAssignmentId: undefined,
        isImportOpen: false,
        isChangeReviewOpen: false,
      };
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }

  // Seed with some fake data
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
    assignments,
    courses,
    selectedAssignmentId: undefined,
    isImportOpen: false,
    isChangeReviewOpen: false,
  };
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CalendarState>(() => createInitialState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: CalendarContextValue = useMemo(
    () => ({
      ...state,
      setView: (view) => setState((s) => ({ ...s, view })),
      addAssignment: (assignment) =>
        setState((s) => ({ ...s, assignments: [...s.assignments, assignment] })),
      updateAssignment: (assignment) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) => (a.id === assignment.id ? assignment : a)),
        })),
      deleteAssignment: (id) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.filter((a) => a.id !== id),
          selectedAssignmentId: s.selectedAssignmentId === id ? undefined : s.selectedAssignmentId,
        })),
      openAssignment: (id) =>
        setState((s) => ({
          ...s,
          selectedAssignmentId: id,
        })),
      closeAssignment: () =>
        setState((s) => ({
          ...s,
          selectedAssignmentId: undefined,
        })),
      openImport: () =>
        setState((s) => ({
          ...s,
          isImportOpen: true,
        })),
      closeImport: () =>
        setState((s) => ({
          ...s,
          isImportOpen: false,
        })),
      openChangeReview: () =>
        setState((s) => ({
          ...s,
          isChangeReviewOpen: true,
        })),
      closeChangeReview: () =>
        setState((s) => ({
          ...s,
          isChangeReviewOpen: false,
        })),
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

